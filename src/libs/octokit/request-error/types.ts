import {
  OctokitResponse,
  RequestOptions,
  ResponseHeaders,
} from "../types/index.ts";

export type RequestErrorOptions =
  | {
    /** @deprecated set `response` instead */
    headers?: ResponseHeaders;
    request: RequestOptions;
  }
  | {
    response: OctokitResponse<unknown>;
    request: RequestOptions;
  };
