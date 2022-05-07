import { debug, setSecret } from "./core.ts";
import { headersToRecord, HttpClient } from "../http-client/index.ts";
interface TokenResponse {
  value?: string;
}

export class OidcClient {
  private static createHttpClient(
    // allowRetry = true,
    // maxRetry = 10,
  ): HttpClient {
    // const requestOptions: IRequestOptions = {
    //   allowRetries: allowRetry,
    //   maxRetries: maxRetry,
    // };
    const token = OidcClient.getRequestToken();

    const newFetch = (
      input: string | Request,
      init?: RequestInit | undefined,
    ): Promise<Response> =>
      fetch(input, {
        ...init,
        headers: {
          "User-Agent": `actions/oidc-client Deno/${Deno.version.deno}`,
          "Authorization": `Bearer ${token}`,
          ...headersToRecord(init?.headers),
        },
      });

    return Object.assign(newFetch, { close() {} });
  }

  private static getRequestToken(): string {
    const token = Deno.env.get("ACTIONS_ID_TOKEN_REQUEST_TOKEN");
    if (!token) {
      throw new Error(
        "Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable",
      );
    }
    return token;
  }

  private static getIDTokenUrl(): string {
    const runtimeUrl = Deno.env.get("ACTIONS_ID_TOKEN_REQUEST_URL");
    if (!runtimeUrl) {
      throw new Error(
        "Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable",
      );
    }
    return runtimeUrl;
  }

  private static async getCall(id_token_url: string): Promise<string> {
    const httpclient = OidcClient.createHttpClient();

    let res;
    try {
      res = await (await httpclient(id_token_url)).json() as TokenResponse;
    } catch (error) {
      throw new Error(
        `Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`,
      );
    }

    const id_token = res?.value;
    if (!id_token) {
      throw new Error("Response json body do not have ID Token field");
    }
    return id_token;
  }

  static async getIDToken(audience?: string): Promise<string> {
    try {
      // New ID Token is requested from action service
      let id_token_url: string = OidcClient.getIDTokenUrl();
      if (audience) {
        const encodedAudience = encodeURIComponent(audience);
        id_token_url = `${id_token_url}&audience=${encodedAudience}`;
      }

      debug(`ID token url is ${id_token_url}`);

      const id_token = await OidcClient.getCall(id_token_url);
      setSecret(id_token);
      return id_token;
    } catch (error) {
      throw new Error(`Error message: ${error.message}`);
    }
  }
}
