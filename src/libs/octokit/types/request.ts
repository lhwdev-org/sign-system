// deno-lint-ignore-file no-explicit-any ban-types
import { Route, Url } from "./common.ts";
import { EndpointInterface } from "./endpoints.ts";
import { Endpoints } from "./generated/endpoints.ts";
import { RequestRequestOptions } from "./octokit.ts";
import { OctokitResponse } from "./response.ts";

/**
 * HTTP Verb supported by GitHub's REST API
 */
export type RequestMethod =
  | "DELETE"
  | "GET"
  | "HEAD"
  | "PATCH"
  | "POST"
  | "PUT";

export type RequestHeaders = {
  /**
   * Avoid setting `headers.accept`, use `mediaType.{format|previews}` option instead.
   */
  accept?: string;
  /**
   * Use `authorization` to send authenticated request, remember `token ` / `bearer ` prefixes. Example: `token 1234567890abcdef1234567890abcdef12345678`
   */
  authorization?: string;
  /**
   * `user-agent` is set do a default and can be overwritten as needed.
   */
  "user-agent"?: string;
  [header: string]: string | number | undefined;
};

/**
 * Generic request options as they are returned by the `endpoint()` method
 */
export type RequestOptions = {
  method: RequestMethod;
  url: Url;
  headers: RequestHeaders;
  body?: any;
  request?: RequestRequestOptions;
};

/**
 * Parameters that can be passed into `request(route, parameters)` or `endpoint(route, parameters)` methods
 */
export type RequestParameters = {
  /**
   * Base URL to be used when a relative URL is passed, such as `/orgs/{org}`.
   * If `baseUrl` is `https://enterprise.acme-inc.com/api/v3`, then the request
   * will be sent to `https://enterprise.acme-inc.com/api/v3/orgs/{org}`.
   */
  baseUrl?: Url;
  /**
   * HTTP headers. Use lowercase keys.
   */
  headers?: RequestHeaders;
  /**
   * Media type options, see {@link https://developer.github.com/v3/media/|GitHub Developer Guide}
   */
  mediaType?: {
    /**
     * `json` by default. Can be `raw`, `text`, `html`, `full`, `diff`, `patch`, `sha`, `base64`. Depending on endpoint
     */
    format?: string;
    /**
     * Custom media type names of {@link https://developer.github.com/v3/media/|API Previews} without the `-preview` suffix.
     * Example for single preview: `['squirrel-girl']`.
     * Example for multiple previews: `['squirrel-girl', 'mister-fantastic']`.
     */
    previews?: string[];
  };
  /**
   * Pass custom meta information for the request. The `request` object will be returned as is.
   */
  request?: RequestRequestOptions;
  /**
   * Any additional parameter will be passed as follows
   * 1. URL parameter if `':parameter'` or `{parameter}` is part of `url`
   * 2. Query parameter if `method` is `'GET'` or `'HEAD'`
   * 3. Request body if `parameter` is `'data'`
   * 4. JSON in the request body in the form of `body[parameter]` unless `parameter` key is `'data'`
   */
  [parameter: string]: unknown;
};

export interface RequestInterface<D extends object = object> {
  /**
   * Sends a request based on endpoint options
   *
   * @param {object} options Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <T = any, O extends RequestParameters = RequestParameters>(
    options:
      & O
      & { method?: string }
      & ("url" extends keyof D ? { url?: string }
        : { url: string }),
  ): Promise<OctokitResponse<T>>;

  /**
   * Sends a request based on endpoint options
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
   * @param {object} options URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <R extends Route>(
    route: keyof Endpoints | R,
    options?: R extends keyof Endpoints
      ? Endpoints[R]["parameters"] & RequestParameters
      : RequestParameters,
  ): R extends keyof Endpoints ? Promise<Endpoints[R]["response"]>
    : Promise<OctokitResponse<any>>;

  /**
   * Returns a new `request` with updated route and parameters
   */
  defaults: <O extends RequestParameters = RequestParameters>(
    newDefaults: O,
  ) => RequestInterface<D & O>;

  /**
   * Octokit endpoint API, see {@link https://github.com/octokit/endpoint.js|@octokit/endpoint}
   */
  endpoint: EndpointInterface<D>;
}

export type RequestError = {
  name: string;
  status: number;
  documentation_url: string;
  errors?: Array<{
    resource: string;
    code: string;
    field: string;
    message?: string;
  }>;
};
