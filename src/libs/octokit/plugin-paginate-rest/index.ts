import { Octokit } from "../core/index.ts";

import { VERSION } from "./version.ts";
import { paginate } from "./paginate.ts";
import { iterator } from "./iterator.ts";
import { PaginateInterface } from "./types.ts";

export type { PaginateInterface } from "./types.ts";
export type { PaginatingEndpoints } from "./types.ts";
export { composePaginateRest } from "./compose-paginate.ts";
export {
  isPaginatingEndpoint,
  paginatingEndpoints,
} from "./paginating-endpoints.ts";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */
export function paginateRest(octokit: Octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit),
    }) as PaginateInterface,
  };
}
paginateRest.VERSION = VERSION;
