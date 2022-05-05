# types.ts for Deno

> Shared TypeScript definitions for Octokit projects


## Ported from Deno

📃 Ported from [@octokit/types 6.34.0](https://github.com/octokit/types.ts/tree/7e5dd312188253e962fa209b16963f78113ba8c3).  
[See this for original license.](https://github.com/octokit/types.ts/blob/main/packages/core/LICENSE.md)

<br>

<!-- toc -->

- [Usage](#usage)
- [Examples](#examples)
  - [Get parameter and response data types for a REST API endpoint](#get-parameter-and-response-data-types-for-a-rest-api-endpoint)
  - [Get response types from endpoint methods](#get-response-types-from-endpoint-methods)

<!-- tocstop -->

## Usage

See all exported types at https://octokit.github.io/types.ts

## Examples

### Get parameter and response data types for a REST API endpoint

```ts
import { Endpoints } from "@octokit/types"; // TODO: url

type listUserReposParameters =
  Endpoints["GET /repos/{owner}/{repo}"]["parameters"];
type listUserReposResponse = Endpoints["GET /repos/{owner}/{repo}"]["response"];

async function listRepos(
  options: listUserReposParameters,
): listUserReposResponse["data"] {
  // ...
}
```

### Get response types from endpoint methods

```ts
import {
  GetResponseDataTypeFromEndpointMethod,
  GetResponseTypeFromEndpointMethod,
} from "@octokit/types";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit();
type CreateLabelResponseType = GetResponseTypeFromEndpointMethod<
  typeof octokit.issues.createLabel
>;
type CreateLabelResponseDataType = GetResponseDataTypeFromEndpointMethod<
  typeof octokit.issues.createLabel
>;
```
