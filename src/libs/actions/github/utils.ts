import * as Context from "./context.ts";
import * as Utils from "./internal/utils.ts";

// octokit + plugins
import { Octokit } from "../../octokit/core/index.ts";
import { OctokitOptions } from "../../octokit/core/types.ts";
import { restEndpointMethods } from "../../octokit/plugin-rest-endpoint-methods/index.ts";
import { paginateRest } from "../../octokit/plugin-paginate-rest/index.ts";
import { getProxyClient } from "../../http-client/index.ts";

export const context = new Context.Context();

const baseUrl = Utils.getApiBaseUrl();
const defaults = {
  baseUrl,
  request: {
    client: getProxyClient(baseUrl),
  },
};

export const GitHub = Octokit.plugin(
  restEndpointMethods,
  paginateRest,
).defaults(defaults);

/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
export function getOctokitOptions(
  token: string,
  options?: OctokitOptions,
): OctokitOptions {
  const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller

  // Auth
  const auth = Utils.getAuthString(token, opts);
  if (auth) {
    opts.auth = auth;
  }

  return opts;
}
