import fetchWrapper from "./fetch-wrapper.ts";
import {
  EndpointInterface,
  EndpointOptions,
  OctokitResponse,
  RequestInterface,
  RequestParameters,
  Route,
} from "../types/index.ts";

export default function withDefaults(
  oldEndpoint: EndpointInterface,
  newDefaults: RequestParameters,
): RequestInterface {
  const endpoint = oldEndpoint.defaults(newDefaults);
  const newApi = function (
    route: Route | EndpointOptions,
    parameters?: RequestParameters,
    // deno-lint-ignore no-explicit-any
  ): Promise<OctokitResponse<any>> {
    const endpointOptions = endpoint.merge(route as Route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (
      route: Route | EndpointOptions,
      parameters?: RequestParameters,
    ) => {
      return fetchWrapper(
        endpoint.parse(endpoint.merge(route as Route, parameters)),
      );
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint),
    });

    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint),
  }) as RequestInterface<typeof endpoint.DEFAULTS & typeof newDefaults>;
}
