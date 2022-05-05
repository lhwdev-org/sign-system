import {
  AnyResponse,
  EndpointDefaults,
  EndpointOptions,
  RequestInterface,
  RequestParameters,
  Route,
  Token,
} from "./types.ts";

import { withAuthorizationPrefix } from "./with-authorization-prefix.ts";

export function hook(
  token: Token,
  request: RequestInterface,
  route: Route | EndpointOptions,
  parameters?: RequestParameters,
): Promise<AnyResponse> {
  const endpoint: EndpointDefaults = request.endpoint.merge(
    route as string,
    parameters,
  );

  endpoint.headers.authorization = withAuthorizationPrefix(token);

  return request(endpoint as EndpointOptions);
}
