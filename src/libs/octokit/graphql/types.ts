import {
  EndpointInterface,
  EndpointOptions,
  RequestParameters as RequestParametersType,
} from "../types/index.ts";

import { graphql } from "./graphql.ts";

export type GraphQlEndpointOptions = EndpointOptions & {
  variables?: { [key: string]: unknown };
};
export type RequestParameters = RequestParametersType;

export type Query = string;

export interface graphql {
  /**
   * Sends a GraphQL query request based on endpoint options
   * The GraphQL query must be specified in `options`.
   *
   * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <ResponseData>(options: RequestParameters): GraphQlResponse<ResponseData>;

  /**
   * Sends a GraphQL query request based on endpoint options
   *
   * @param {string} query GraphQL query. Example: `'query { viewer { login } }'`.
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  <ResponseData>(
    query: Query,
    parameters?: RequestParameters,
  ): GraphQlResponse<ResponseData>;

  /**
   * Returns a new `endpoint` with updated route and parameters
   */
  defaults: (newDefaults: RequestParameters) => graphql;

  /**
   * Octokit endpoint API, see {@link https://github.com/octokit/endpoint.js|@octokit/endpoint}
   */
  endpoint: EndpointInterface;
}

// export type withCustomRequest = (request: typeof Request) => graphql;

export type GraphQlResponse<ResponseData> = Promise<ResponseData>;

export type GraphQlQueryResponseData = {
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
};

export type GraphQlQueryResponse<ResponseData> = {
  data: ResponseData;
  errors?: [
    {
      // https://github.com/octokit/graphql.js/pull/314
      type: string;
      message: string;
      path: [string];
      // deno-lint-ignore no-explicit-any
      extensions: { [key: string]: any };
      locations: [
        {
          line: number;
          column: number;
        },
      ];
    },
  ];
};
