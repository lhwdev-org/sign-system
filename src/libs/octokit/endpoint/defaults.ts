import { EndpointDefaults } from "../types/index.ts";

import { VERSION } from "./version.ts";

const userAgent = `octokit-endpoint.js/${VERSION} Deno/${Deno.version.deno}`;

// DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.
export const DEFAULTS: EndpointDefaults = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent,
  },
  mediaType: {
    format: "",
    previews: [] as string[],
  },
};
