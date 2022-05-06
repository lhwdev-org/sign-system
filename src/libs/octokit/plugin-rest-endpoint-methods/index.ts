import { Octokit } from "../core/index.ts";

import ENDPOINTS from "./generated/endpoints.ts";
export type { RestEndpointMethodTypes } from "./generated/parameters-and-response-types.ts";
import { VERSION } from "./version.ts";
import { Api } from "./types.ts";
import { endpointsToMethods } from "./endpoints-to-methods.ts";

export function restEndpointMethods(octokit: Octokit): Api {
  const api = endpointsToMethods(octokit, ENDPOINTS);
  return {
    rest: api,
  };
}
restEndpointMethods.VERSION = VERSION;

export function legacyRestEndpointMethods(octokit: Octokit): Api["rest"] & Api {
  const api = endpointsToMethods(octokit, ENDPOINTS);
  return {
    ...api,
    rest: api,
  };
}
legacyRestEndpointMethods.VERSION = VERSION;
