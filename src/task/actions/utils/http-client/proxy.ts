export function getProxyUrl(reqUrl: URL): URL | undefined {
  const usingSsl = reqUrl.protocol === "https:";

  let proxyUrl: URL | undefined;
  if (checkBypass(reqUrl)) {
    return proxyUrl;
  }

  let proxyVar: string | undefined;
  if (usingSsl) {
    proxyVar = Deno.env.get("https_proxy") || Deno.env.get("HTTPS_PROXY");
  } else {
    proxyVar = Deno.env.get("http_proxy") || Deno.env.get("HTTP_PROXY");
  }

  if (proxyVar) {
    proxyUrl = new URL(proxyVar);
  }

  return proxyUrl;
}

export function checkBypass(reqUrl: URL): boolean {
  if (!reqUrl.hostname) {
    return false;
  }

  const noProxy = Deno.env.get("no_proxy") || Deno.env.get("NO_PROXY") || "";
  if (!noProxy) {
    return false;
  }

  // Determine the request port
  let reqPort: number;
  if (reqUrl.port) {
    reqPort = Number(reqUrl.port);
  } else if (reqUrl.protocol === "http:") {
    reqPort = 80;
  } else if (reqUrl.protocol === "https:") {
    reqPort = 443;
  } else {
    return false;
  }

  // Format the request hostname and hostname with port
  const upperReqHosts = [reqUrl.hostname.toUpperCase()];
  if (typeof reqPort === "number") {
    upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
  }

  // Compare request host against noproxy
  for (
    const upperNoProxyItem of noProxy
      .split(",")
      .map((x) => x.trim().toUpperCase())
      .filter((x) => x)
  ) {
    if (upperReqHosts.some((x) => x === upperNoProxyItem)) {
      return true;
    }
  }

  return false;
}
