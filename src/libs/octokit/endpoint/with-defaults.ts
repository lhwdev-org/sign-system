import {
  EndpointDefaults,
  EndpointInterface,
  RequestParameters,
} from "../types/index.ts";

import { endpointWithDefaults } from "./endpoint-with-defaults.ts";
import { merge } from "./merge.ts";
import { parse } from "./parse.ts";

export function withDefaults(
  oldDefaults: EndpointDefaults | null,
  newDefaults: RequestParameters,
): EndpointInterface {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);

  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse,
  }) as EndpointInterface<typeof oldDefaults & typeof newDefaults>;
}
