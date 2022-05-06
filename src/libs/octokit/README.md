# Octokit for Deno

Even though octokit does officially supports Deno, Octokit libraries do not have sufficient
support for Deno, for example customizing requests.  
So I reimplement octokit in Deno to support these cases.


## Considerations for Porting

```mermaid
graph TD;
  core --> request;
  core --> types;
  core --> graphql;
  core --> auth-token;

  graphql --> request;
  graphql --> types;

  auth-token --> types;

  request --> endpoint;
  request --> types;
  request --> node-fetch;
  request --> request-error;

  request-error --> types;

  types --> openapi-types;

  endpoint --> types;

  plugin-rest-endpoint-methods --> core;
  plugin-rest-endpoint-methods --> types;
```

- `openapi-types` and `plugin-rest-endpoint-methods` are auto-generated.
  Needs to make some pipeline or workflow to convert that code.

- `openapi-types` does not have to be ported, as it does not depend on
  other things and only use pure typescript definitions. In this repository,
  [openapi-types](openapi-types) directory exists only for consistency, and it
  maps to original repository.

- `types` seemingly does not have to be ported, but it has some caveats;
  it does not support web types.
