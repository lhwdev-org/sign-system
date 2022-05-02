/**
 * Entrypoint(Github Actions)
 * Entrypoint for `.github/workflows/handle-request.yml`:publish.
 *
 * ## Requirements
 * Arguments:
 * - filePath: root path for checkout repositories containing this script.
 * - githubToken: token for this actions workflow.
 * Contexts:
 * - payload: issues(https://docs.github.com/en/developers/webhooks-and-events/webhooks/webhook-events-and-payloads#issues)
 */
import {
  IssuesOpenedEvent,
  IssuesReopenedEvent,
} from "@octokit/webhooks-types";

import { warning } from "../utils/core/core.ts";
import { context } from "../utils/github/github.ts";
import { initOctokit } from "../utils/octokit-init.ts";

const [filePath, githubToken] = Deno.args;
initOctokit(githubToken);

const payload = context.payload as (IssuesOpenedEvent | IssuesReopenedEvent);

// checked from workflow yaml, but check once more
if (!payload.issue.labels?.find((label) => label.name === "sign-request")) {
  warning("This issue do not have 'sign-request' label");
  Deno.exit(0);
}

(await import("./main.ts")).default(payload, filePath);
