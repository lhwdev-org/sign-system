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

import { context } from "./utils/github/github.ts";
import { initOctokit } from "./utils/octokit.ts";
import onHandleRequest from "../on-request/main.ts";

const [filePath, githubToken] = Deno.args;
initOctokit(githubToken);

const payload = context.payload as (IssuesOpenedEvent | IssuesReopenedEvent);

onHandleRequest(payload.repository, payload.issue, payload.sender, filePath);
