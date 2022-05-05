import { Url } from "./common.ts";

export type ResponseHeaders = {
  "cache-control"?: string;
  "content-length"?: number;
  "content-type"?: string;
  date?: string;
  etag?: string;
  "last-modified"?: string;
  link?: string;
  location?: string;
  server?: string;
  status?: string;
  vary?: string;
  "x-github-mediatype"?: string;
  "x-github-request-id"?: string;
  "x-oauth-scopes"?: string;
  "x-ratelimit-limit"?: string;
  "x-ratelimit-remaining"?: string;
  "x-ratelimit-reset"?: string;

  [header: string]: string | number | undefined;
};

export type OctokitResponse<T, S extends number = number> = {
  headers: ResponseHeaders;
  /**
   * http response code
   */
  status: S;
  /**
   * URL of response after all redirects
   */
  url: Url;
  /**
   * Response data as documented in the REST API reference documentation at https://docs.github.com/rest/reference
   */
  data: T;
};

// deno-lint-ignore no-explicit-any
type AnyFunction = (...args: any[]) => any;

export type GetResponseTypeFromEndpointMethod<T extends AnyFunction> = Awaited<
  ReturnType<T>
>;
export type GetResponseDataTypeFromEndpointMethod<T extends AnyFunction> =
  Awaited<ReturnType<T>>["data"];
