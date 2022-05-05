# graphql.js for Deno

> GitHub GraphQL API client for Deno


## Ported from Deno

📃 Ported from [@octokit/graphql 5.13.0](https://github.com/octokit/graphql.js/tree/5d2a0886d60412cd0a8cb293450060b366102667).  
[See this for original license.](https://github.com/octokit/graphql.js/blob/main/packages/core/LICENSE.md)


<!-- toc -->

- [Usage](#usage)
  - [Send a simple query](#send-a-simple-query)
  - [Authentication](#authentication)
  - [Variables](#variables)
  - [Pass query together with headers and variables](#pass-query-together-with-headers-and-variables)
  - [Use with GitHub Enterprise](#use-with-github-enterprise)
  - [Use custom `@octokit/request` instance](#use-custom-octokitrequest-instance)
- [TypeScript](#typescript)
  - [Additional Types](#additional-types)
- [Errors](#errors)
- [Partial responses](#partial-responses)
- [Writing tests](#writing-tests)
- [License](#license)

<!-- tocstop -->

## Usage

```js
import { graphql } from "@octokit/graphql"; // TODO: url
```

### Send a simple query

```js
const { repository } = await graphql(
  `
    {
      repository(owner: "octokit", name: "graphql.js") {
        issues(last: 3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  `,
  {
    headers: {
      authorization: `token secret123`,
    },
  }
);
```

### Authentication

The simplest way to authenticate a request is to set the `Authorization` header, e.g. to a [personal access token](https://github.com/settings/tokens/).

```js
const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token secret123`,
  },
});
const { repository } = await graphqlWithAuth(`
  {
    repository(owner: "octokit", name: "graphql.js") {
      issues(last: 3) {
        edges {
          node {
            title
          }
        }
      }
    }
  }
`);
```

For more complex authentication strategies such as GitHub Apps or Basic, we recommend the according authentication library exported by [`@octokit/auth`](https://github.com/octokit/auth.js).

```js
import { createAppAuth } from "@octokit/auth-app";
const auth = createAppAuth({
  id: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY,
  installationId: 123,
});
const graphqlWithAuth = graphql.defaults({
  request: {
    hook: auth.hook,
  },
});

const { repository } = await graphqlWithAuth(
  `{
    repository(owner: "octokit", name: "graphql.js") {
      issues(last: 3) {
        edges {
          node {
            title
          }
        }
      }
    }
  }`
);
```

### Variables

⚠️ Do not use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) in the query strings as they make your code vulnerable to query injection attacks (see [#2](https://github.com/octokit/graphql.js/issues/2)). Use variables instead:

```js
const { lastIssues } = await graphql(
  `
    query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
      repository(owner: $owner, name: $repo) {
        issues(last: $num) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  `,
  {
    owner: "octokit",
    repo: "graphql.js",
    headers: {
      authorization: `token secret123`,
    },
  }
);
```

### Pass query together with headers and variables

```js
import { graphql } from "@octokit/graphql";
const { lastIssues } = await graphql({
  query: `query lastIssues($owner: String!, $repo: String!, $num: Int = 3) {
    repository(owner:$owner, name:$repo) {
      issues(last:$num) {
        edges {
          node {
            title
          }
        }
      }
    }
  }`,
  owner: "octokit",
  repo: "graphql.js",
  headers: {
    authorization: `token secret123`,
  },
});
```

### Use with GitHub Enterprise

```js
import { graphql } from "@octokit/graphql";
graphql = graphql.defaults({
  baseUrl: "https://github-enterprise.acme-inc.com/api",
  headers: {
    authorization: `token secret123`,
  },
});
const { repository } = await graphql(`
  {
    repository(owner: "acme-project", name: "acme-repo") {
      issues(last: 3) {
        edges {
          node {
            title
          }
        }
      }
    }
  }
`);
```

### Use custom `@octokit/request` instance

```js
import { request } from "@octokit/request";
import { graphql } from "@octokit/graphql";

let requestCounter = 0;
const myRequest = request.defaults({
  headers: {
    authentication: "token secret123",
  },
  request: {
    hook(request, options) {
      requestCounter++;
      return request(options);
    },
  },
});
const myGraphql = withCustomRequest(myRequest);
await request("/");
await myGraphql(`
  {
    repository(owner: "acme-project", name: "acme-repo") {
      issues(last: 3) {
        edges {
          node {
            title
          }
        }
      }
    }
  }
`);
// requestCounter is now 2
```

## TypeScript

`@octokit/graphql` is exposing proper types for its usage with TypeScript projects.

### Additional Types

Additionally, `GraphQlQueryResponseData` has been exposed to users:

```ts
import type { GraphQlQueryResponseData } from "@octokit/graphql";
```

## Errors

In case of a GraphQL error, `error.message` is set to a combined message describing all errors returned by the endpoint.
All errors can be accessed at `error.errors`. `error.request` has the request options such as query, variables and headers set for easier debugging.

```js
import { graphql, GraphqlResponseError } from "@octokit/graphql";
graphqlt = graphql.defaults({
  headers: {
    authorization: `token secret123`,
  },
});
const query = `{
  viewer {
    bioHtml
  }
}`;

try {
  const result = await graphql(query);
} catch (error) {
  if (error instanceof GraphqlResponseError) {
    // do something with the error, allowing you to detect a graphql response error,
    // compared to accidentally catching unrelated errors.

    // server responds with an object like the following (as an example)
    // class GraphqlResponseError {
    //  "headers": {
    //    "status": "403",
    //  },
    //  "data": null,
    //  "errors": [{
    //   "message": "Field 'bioHtml' doesn't exist on type 'User'",
    //   "locations": [{
    //    "line": 3,
    //    "column": 5
    //   }]
    //  }]
    // }

    console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
    console.log(error.message); // Field 'bioHtml' doesn't exist on type 'User'
  } else {
    // handle non-GraphQL error
  }
}
```

## Partial responses

A GraphQL query may respond with partial data accompanied by errors. In this case we will throw an error but the partial data will still be accessible through `error.data`

```js
import { graphql } from "@octokit/graphql";
graphql = graphql.defaults({
  headers: {
    authorization: `token secret123`,
  },
});
const query = `{
  repository(name: "probot", owner: "probot") {
    name
    ref(qualifiedName: "master") {
      target {
        ... on Commit {
          history(first: 25, after: "invalid cursor") {
            nodes {
              message
            }
          }
        }
      }
    }
  }
}`;

try {
  const result = await graphql(query);
} catch (error) {
  // server responds with
  // {
  //   "data": {
  //     "repository": {
  //       "name": "probot",
  //       "ref": null
  //     }
  //   },
  //   "errors": [
  //     {
  //       "type": "INVALID_CURSOR_ARGUMENTS",
  //       "path": [
  //         "repository",
  //         "ref",
  //         "target",
  //         "history"
  //       ],
  //       "locations": [
  //         {
  //           "line": 7,
  //           "column": 11
  //         }
  //       ],
  //       "message": "`invalid cursor` does not appear to be a valid cursor."
  //     }
  //   ]
  // }

  console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
  console.log(error.message); // `invalid cursor` does not appear to be a valid cursor.
  console.log(error.data); // { repository: { name: 'probot', ref: null } }
}
```
