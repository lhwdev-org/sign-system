// // deno-lint-ignore-file no-explicit-any

// export interface IHeaders {
//   [key: string]: string;
// }

// export interface IHttpClient {
//   options(
//     requestUrl: string,
//     additionalHeaders?: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   get(
//     requestUrl: string,
//     additionalHeaders?: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   del(
//     requestUrl: string,
//     additionalHeaders?: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   post(
//     requestUrl: string,
//     data: string,
//     additionalHeaders?: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   patch(
//     requestUrl: string,
//     data: string,
//     additionalHeaders?: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   put(
//     requestUrl: string,
//     data: string,
//     additionalHeaders?: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   sendStream(
//     verb: string,
//     requestUrl: string,
//     stream: ReadableStream,
//     additionalHeaders?: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   request(
//     verb: string,
//     requestUrl: string,
//     data: string | ReadableStream,
//     headers: IHeaders,
//   ): Promise<IHttpClientResponse>;
//   requestRaw(
//     info: IRequestInfo,
//     data: string | ReadableStream,
//   ): Promise<IHttpClientResponse>;
//   requestRawWithCallback(
//     info: IRequestInfo,
//     data: string | ReadableStream,
//     onResult: (err: any, res?: IHttpClientResponse) => void,
//   ): void;
// }

// export interface IRequestHandler {
//   prepareRequest(options: RequestInit): void;
//   canHandleAuthentication(response: IHttpClientResponse): boolean;
//   handleAuthentication(
//     httpClient: IHttpClient,
//     requestInfo: IRequestInfo,
//     objs: any,
//   ): Promise<IHttpClientResponse | null>;
// }

// export interface IHttpClientResponse {
//   message: Response;
//   readBody(): Promise<string>;
// }

// export interface IRequestInfo {
//   options: RequestData;
//   parsedUrl: URL;
// }

// export type RequestData = RequestInit & { headers: Headers };

// export interface IRequestOptions {
//   headers?: IHeaders;
//   socketTimeout?: number;
//   ignoreSslError?: boolean;
//   allowRedirects?: boolean;
//   allowRedirectDowngrade?: boolean;
//   maxRedirects?: number;
//   maxSockets?: number;
//   keepAlive?: boolean;
//   deserializeDates?: boolean;
//   // Allows retries only on Read operations (since writes may not be idempotent)
//   allowRetries?: boolean;
//   maxRetries?: number;
// }

// export interface ITypedResponse<T> {
//   statusCode: number;
//   result: T | null;
//   headers: Record<string, string>;
// }
