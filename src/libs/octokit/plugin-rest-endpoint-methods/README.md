# plugin-rest-endpoint-methods.js for Deno

> Octokit plugin adding one method for all of api.github.com REST API endpoints



## Ported from Deno

📃 Ported from [@octokit/plugin-rest-endpoint-methods 5.13.0](https://github.com/octokit/plugin-rest-endpoint-methods.js/tree/6710760f16a1747c937fe58a39acd716624781b2).  
[See this for original license.](https://github.com/octokit/plugin-rest-endpoint-methods.js/blob/main/packages/core/LICENSE.md)



## Usage

```js
import { Octokit } from "https://cdn.skypack.dev/@octokit/core?dts";
import { restEndpointMethods } from "https://cdn.skypack.dev/@octokit/plugin-rest-endpoint-methods?dts";
```

```js
const MyOctokit = Octokit.plugin(restEndpointMethods);
const octokit = new MyOctokit({ auth: "secret123" });

// https://developer.github.com/v3/users/#get-the-authenticated-user
octokit.rest.users.getAuthenticated();
```

There is one method for each REST API endpoint documented at [https://developer.github.com/v3](https://developer.github.com/v3). All endpoint methods are documented in the [docs/](https://github.com/octokit/plugin-rest-endpoint-methods.js/tree/master/doc) folder, e.g. [docs/users/getAuthenticated.md](https://github.com/octokit/plugin-rest-endpoint-methods.js/tree/master/docs/users/getAuthenticated.md)

## TypeScript

Parameter and response types for all endpoint methods exported as `{ RestEndpointMethodTypes }`.

Example

```ts
import { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

type UpdateLabelParameters =
  RestEndpointMethodTypes["issues"]["updateLabel"]["parameters"];
type UpdateLabelResponse =
  RestEndpointMethodTypes["issues"]["updateLabel"]["response"];
```

In order to get types beyond parameters and responses, check out [`@octokit/openapi-types`](https://github.com/octokit/openapi-types.ts/#readme), which is a direct transpilation from GitHub's official OpenAPI specification.
