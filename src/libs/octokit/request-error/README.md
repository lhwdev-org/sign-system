# request-error.js for Deno

> Error class for Octokit request errors


## Ported from Deno

📃 Ported from [@octokit/request-error 6.34.0](https://github.com/octokit/request-error.js/tree/ef0d80659da2f9377d20a8a44a9f113f3fc2aa97).  
[See this for original license.](https://github.com/octokit/request-error.js/blob/main/packages/core/LICENSE.md)


## Usage

```js
import { RequestError } from "@octokit/request-error"; // TODO: url
```

```js
const error = new RequestError("Oops", 500, {
  request: {
    method: "POST",
    url: "https://api.github.com/foo",
    body: {
      bar: "baz",
    },
    headers: {
      authorization: "token secret123",
    },
  },
  response: {
    status: 500,
    url: "https://api.github.com/foo"
    headers: {
      "x-github-request-id": "1:2:3:4",
    },
    data: {
      foo: "bar"
    }
  },
});

error.message; // Oops
error.status; // 500
error.request; // { method, url, headers, body }
error.response; // { url, status, headers, data }
```
