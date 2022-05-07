// deno-lint-ignore-file no-explicit-any ban-types
import { HttpClient } from "../../http-client/index.ts";
import { Route } from "./common.ts";
import { EndpointDefaults, EndpointOptions } from "./endpoints.ts";
import { RequestInterface, RequestParameters } from "./request.ts";
import { OctokitResponse } from "./response.ts";

/**
 * Octokit-specific request options which are ignored for the actual request, but can be used by Octokit or plugins to manipulate how the request is sent or how a response is handled
 */
export interface RequestRequestOptions extends RequestInit {
  /**
   * Custom replacement for built-in fetch method. Useful for testing or request hooks.
   * Useful for custom proxy, certificate, or dns lookup.
   */
  client?: HttpClient;

  log?: { warn(text: string): void };

  hook?: (
    request: (
      route: Route | EndpointOptions,
      parameters?: RequestParameters,
    ) => Promise<OctokitResponse<any>>,
    endpointOptions: EndpointDefaults,
  ) => Promise<OctokitResponse<any>>;

  // /**
  //  * Request/response timeout in ms, it resets on redirect. 0 to disable (OS limit applies). `options.request.signal` is recommended instead.
  //  */
  // timeout?: number;
}

/**
 * Interface to implement complex authentication strategies for Octokit.
 * An object Implementing the AuthInterface can directly be passed as the
 * `auth` option in the Octokit constructor.
 *
 * For the official implementations of the most common authentication
 * strategies, see https://github.com/octokit/auth.js
 */
export interface AuthInterface<
  AuthOptions extends any[],
  Authentication extends any,
> {
  (...args: AuthOptions): Promise<Authentication>;

  hook: {
    /**
     * Sends a request using the passed `request` instance
     *
     * @param {object} request Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    <T = any>(request: RequestInterface, options: EndpointOptions): Promise<
      OctokitResponse<T>
    >;

    /**
     * Sends a request using the passed `request` instance
     *
     * @param {string} route Request method + URL. Example: `'GET /orgs/{org}'`
     * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
     */
    <T = any>(
      request: RequestInterface,
      route: Route,
      parameters?: RequestParameters,
    ): Promise<OctokitResponse<T>>;
  };
}

export interface StrategyInterface<
  StrategyOptions extends any[],
  AuthOptions extends any[],
  Authentication extends object,
> {
  (...args: StrategyOptions): AuthInterface<AuthOptions, Authentication>;
}
