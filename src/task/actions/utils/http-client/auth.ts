// // deno-lint-ignore-file require-await no-unused-vars no-explicit-any
// import * as http from "node/http.ts";
// import { encode as encodeBase64 } from "encoding/base64.ts";

// import {
//   IHttpClient,
//   IHttpClientResponse,
//   IRequestHandler,
//   IRequestInfo,
// } from "./interfaces.ts";

// export class BasicCredentialHandler implements IRequestHandler {
//   username: string;
//   password: string;

//   constructor(username: string, password: string) {
//     this.username = username;
//     this.password = password;
//   }

//   prepareRequest(options: http.RequestOptions): void {
//     if (!options.headers) options.headers = {};
//     options.headers["Authorization"] = "Basic " +
//       encodeBase64(this.username + ":" + this.password);
//   }

//   // This handler cannot handle 401
//   canHandleAuthentication(response: IHttpClientResponse): boolean {
//     return false;
//   }

//   async handleAuthentication(
//     httpClient: IHttpClient,
//     requestInfo: IRequestInfo,
//     objs: any,
//   ): Promise<IHttpClientResponse | null> {
//     return null;
//   }
// }

// export class BearerCredentialHandler implements IRequestHandler {
//   token: string;

//   constructor(token: string) {
//     this.token = token;
//   }

//   // currently implements pre-authorization
//   // TODO: support preAuth = false where it hooks on 401
//   prepareRequest(options: http.RequestOptions): void {
//     if (!options.headers) options.headers = {};
//     options.headers["Authorization"] = "Bearer " + this.token;
//   }

//   // This handler cannot handle 401
//   canHandleAuthentication(response: IHttpClientResponse): boolean {
//     return false;
//   }

//   async handleAuthentication(
//     httpClient: IHttpClient,
//     requestInfo: IRequestInfo,
//     objs: any,
//   ): Promise<IHttpClientResponse | null> {
//     return null;
//   }
// }

// export class PersonalAccessTokenCredentialHandler implements IRequestHandler {
//   token: string;

//   constructor(token: string) {
//     this.token = token;
//   }

//   // currently implements pre-authorization
//   // TODO: support preAuth = false where it hooks on 401
//   prepareRequest(options: http.RequestOptions): void {
//     if (!options.headers) options.headers = {};
//     options.headers["Authorization"] = "Basic " +
//       encodeBase64("PAT:" + this.token);
//   }

//   // This handler cannot handle 401
//   canHandleAuthentication(response: IHttpClientResponse): boolean {
//     return false;
//   }

//   async handleAuthentication(
//     httpClient: IHttpClient,
//     requestInfo: IRequestInfo,
//     objs: any,
//   ): Promise<IHttpClientResponse | null> {
//     return null;
//   }
// }
