import { RequestParameters, Route } from "../types/index.ts";

import { RestEndpointMethods } from "./generated/method-types.ts";

export type Api = { rest: RestEndpointMethods };

export type EndpointDecorations = {
  mapToData?: string;
  deprecated?: string;
  renamed?: [string, string];
  renamedParameters?: {
    [name: string]: string;
  };
};

export type EndpointsDefaultsAndDecorations = {
  [scope: string]: {
    [methodName: string]: [Route, RequestParameters?, EndpointDecorations?];
  };
};
