import { isPlainObject } from "../util/is-plain-object.ts";
import { RequestError } from "../request-error/index.ts";
import { EndpointInterface } from "../types/index.ts";

export default function fetchWrapper(
  requestOptions: ReturnType<EndpointInterface> & {
    redirect?: "error" | "follow" | "manual";
  },
) {
  const log = requestOptions.request?.log ?? console;

  if (
    isPlainObject(requestOptions.body) ||
    Array.isArray(requestOptions.body)
  ) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  const headers: Record<string, string> = {};
  let status: number;
  let url: string;

  const customFetch: typeof fetch = (requestOptions.request?.client) || fetch;

  return customFetch(
    requestOptions.url,
    Object.assign(
      {
        method: requestOptions.method,
        body: requestOptions.body,
        headers: requestOptions.headers,
        redirect: requestOptions.redirect,
      },
      requestOptions.request,
    ),
  )
    .then(async (response) => {
      url = response.url;
      status = response.status;

      for (const keyAndValue of response.headers) {
        headers[keyAndValue[0]] = keyAndValue[1];
      }

      if ("deprecation" in headers) {
        const matches = headers.link &&
          headers.link.match(/<([^>]+)>; rel="deprecation"/);
        const deprecationLink = matches && matches.pop();
        log.warn(
          `[@octokit/request] "${requestOptions.method} ${requestOptions.url}" is deprecated. It is scheduled to be removed on ${headers.sunset}${
            deprecationLink ? `. See ${deprecationLink}` : ""
          }`,
        );
      }

      if (status === 204 || status === 205) {
        return;
      }

      // GitHub API returns 200 for HEAD requests
      if (requestOptions.method === "HEAD") {
        if (status < 400) {
          return;
        }

        throw new RequestError(response.statusText, status, {
          response: {
            url,
            status,
            headers,
            data: undefined,
          },
          request: requestOptions,
        });
      }

      if (status === 304) {
        throw new RequestError("Not modified", status, {
          response: {
            url,
            status,
            headers,
            data: await getResponseData(response),
          },
          request: requestOptions,
        });
      }

      if (status >= 400) {
        const data = await getResponseData(response);

        const error = new RequestError(toErrorMessage(data), status, {
          response: {
            url,
            status,
            headers,
            data,
          },
          request: requestOptions,
        });

        throw error;
      }

      return getResponseData(response);
    })
    .then((data) => {
      return {
        status,
        url,
        headers,
        data,
      };
    })
    .catch((error) => {
      if (error instanceof RequestError) throw error;

      throw new RequestError(error.message, 500, {
        request: requestOptions,
      });
    });
}

async function getResponseData(response: Response) {
  const contentType = response.headers.get("content-type");
  if (/application\/json/.test(contentType!)) {
    return await response.json();
  }

  if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
    return await response.text();
  }

  return response.body;
}

// deno-lint-ignore no-explicit-any
function toErrorMessage(data: any) {
  if (typeof data === "string") return data;

  // istanbul ignore else - just in case
  if ("message" in data) {
    if (Array.isArray(data.errors)) {
      return `${data.message}: ${data.errors.map(JSON.stringify).join(", ")}`;
    }

    return data.message;
  }

  // istanbul ignore next - just in case
  return `Unknown error: ${JSON.stringify(data)}`;
}
