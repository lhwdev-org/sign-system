import { HttpClient } from "../../../http-client/index.ts";
import { createHttpClient } from "./utils.ts";
import * as core from "../../core/core.ts";

/**
 * Used for managing http clients during either upload or download
 */
export class HttpManager {
  private clients: HttpClient[];
  private userAgent: string;

  constructor(clientCount: number, userAgent: string) {
    if (clientCount < 1) {
      throw new Error("There must be at least one client");
    }
    this.userAgent = userAgent;
    this.clients = new Array(clientCount).fill(createHttpClient(userAgent));
  }

  getClient(index: number): HttpClient {
    return this.clients[index];
  }

  // client disposal is necessary if a keep-alive connection is used to properly close the connection
  // for more information see: https://github.com/actions/http-client/blob/04e5ad73cd3fd1f5610a32116b0759eddf6570d2/index.ts#L292
  disposeAndReplaceClient(index: number): void {
    this.clients[index].close();
    const client = createHttpClient(this.userAgent);
    if (core.isDebug()) {
      this.clients[index] = Object.assign(
        (input: string | Request, init?: RequestInit) => {
          console.log(
            input.toString(),
            Deno.inspect(init, { colors: true, compact: true, depth: 2 }),
          );
          return client(input, init);
        },
        { close: client.close },
      );
    } else {
      this.clients[index] = client;
    }
  }

  disposeAndReplaceAllClients(): void {
    for (const [index] of this.clients.entries()) {
      this.disposeAndReplaceClient(index);
    }
  }
}
