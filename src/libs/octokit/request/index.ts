import { endpoint } from "../endpoint/index.ts";

import { VERSION } from "./version.ts";
import withDefaults from "./with-defaults.ts";

export const request = withDefaults(endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} Deno/${Deno.version.deno}"`,
  },
});
