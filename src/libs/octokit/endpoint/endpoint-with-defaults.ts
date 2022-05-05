import { EndpointOptions, RequestParameters, Route } from "../types/index.ts";

import { DEFAULTS } from "./defaults.ts";
import { merge } from "./merge.ts";
import { parse } from "./parse.ts";

export function endpointWithDefaults(
  defaults: typeof DEFAULTS,
  route: Route | EndpointOptions,
  options?: RequestParameters,
) {
  return parse(merge(defaults, route, options));
}
