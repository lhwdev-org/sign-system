import { getProxyUrl } from "./proxy.ts";

export enum HttpCodes {
  OK = 200,
  MultipleChoices = 300,
  MovedPermanently = 301,
  ResourceMoved = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  SwitchProxy = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

export type HttpClient =
  & ((
    input: string | Request,
    init?: RequestInit | undefined,
  ) => Promise<Response>)
  & { close: () => void };

export const DefaultHttpClient: HttpClient = Object.assign({}, fetch, {
  close() {},
});

export function getProxyClient(
  destinationUrl: string,
): HttpClient | undefined {
  const url = getProxyUrl(new URL(destinationUrl));

  if (url) {
    const client = Deno.createHttpClient({ proxy: { url: url.toString() } });
    const newFetch = (
      input: string | Request | URL,
      init?: RequestInit,
    ): Promise<Response> => fetch(input, { client, ...init });
    return Object.assign(newFetch, {
      close() {
        client.close();
      },
    });
  }
}

export function getApiBaseUrl(): string {
  return Deno.env.get("GITHUB_API_URL") || "https://api.github.com";
}

export function headersToRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};
  let result = <Record<string, string>> {};
  if (Array.isArray(headers) || headers instanceof Headers) {
    for (const [key, value] of headers) {
      result[key] = value;
    }
  } else {
    result = headers;
  }
  return result;
}
