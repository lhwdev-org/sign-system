import { request } from "../request/index.ts";

import { VERSION } from "./version.ts";

import { withDefaults } from "./with-defaults.ts";

export const graphql = withDefaults(request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} Deno/${Deno.version.deno}`,
  },
  method: "POST",
  url: "/graphql",
});

export type { GraphQlQueryResponseData } from "./types.ts";
export { GraphqlResponseError } from "./error.ts";

export function withCustomRequest(customRequest: typeof request) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql",
  });
}
