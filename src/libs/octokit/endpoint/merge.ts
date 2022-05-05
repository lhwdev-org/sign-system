import { EndpointDefaults, RequestParameters, Route } from "../types/index.ts";

import { lowercaseKeys } from "./util/lowercase-keys.ts";
import { mergeDeep } from "./util/merge-deep.ts";
import { removeUndefinedProperties } from "./util/remove-undefined-properties.ts";

export function merge(
  defaults: EndpointDefaults | null,
  route?: Route | RequestParameters,
  options?: RequestParameters,
) {
  if (typeof route === "string") {
    const [method, url] = route.split(" ");
    options = Object.assign(url ? { method, url } : { url: method }, options);
  } else {
    options = Object.assign({}, route);
  }

  // lowercase header names before merging with defaults to avoid duplicates
  options.headers = lowercaseKeys(options.headers);

  // remove properties with undefined values before merging
  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);

  const mergedOptions = mergeDeep(defaults || {}, options) as EndpointDefaults;

  // mediaType.previews arrays are merged, instead of overwritten
  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews
      .filter((preview) => !mergedOptions.mediaType.previews.includes(preview))
      .concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(
    (preview: string) => preview.replace(/-preview/, ""),
  );

  return mergedOptions;
}
