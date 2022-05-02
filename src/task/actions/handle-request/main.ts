import {
  IssuesOpenedEvent,
  IssuesReopenedEvent,
} from "@octokit/webhooks-types";

import { WebhookIssue } from "../../../models/impl/github/webhook/WebhookIssue.ts";
import { WebhookRepository } from "../../../models/impl/github/webhook/WebhookRepository.ts";
import { WebhookUser } from "../../../models/impl/github/webhook/WebhookUser.ts";

import onHandleRequest from "../../handle-request/main.ts";
import manager from "../utils/octokit.ts";

export default async function handleRequest(
  payload: IssuesOpenedEvent | IssuesReopenedEvent,
  filePath: string,
) {
  const repository = new WebhookRepository(manager, payload.repository);
  const issue = new WebhookIssue(repository, payload.issue);
  const sender = new WebhookUser(manager, payload.sender);

  await onHandleRequest(repository, issue, sender, filePath);
}
