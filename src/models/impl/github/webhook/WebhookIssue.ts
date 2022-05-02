import {
  Issue as GhIssue,
  IssueComment as GhIssueComment,
} from "@octokit/webhooks-types";

import { IssueCommentData, IssueData, Label } from "../../../Issue.ts";
import {
  GithubIssueBase,
  GithubIssueCommentBase,
} from "../base/GithubIssueBase.ts";
import { GithubRepositoryBase } from "../base/GithubRepositoryBase.ts";

import { WebhookUser } from "./WebhookUser.ts";

// Issue

export class WebhookIssue extends GithubIssueBase {
  constructor(repository: GithubRepositoryBase, public original: GhIssue) {
    super(repository, convertWebhookIssue(repository, original));
  }
}

export function convertWebhookIssue(
  repository: GithubRepositoryBase,
  data: GhIssue,
): IssueData {
  const labels = [];
  if (data.labels) {
    for (const label of data.labels) {
      if (typeof label === "object") labels.push(label as Label);
      else throw Error("I didn't expect this");
    }
  }
  return {
    title: data.title,
    number: data.number,
    user: new WebhookUser(repository.manager, data.user!),
    body: data.body ?? undefined,
    labels: labels,
    isOpen: data.state == "open",
  };
}

// Issue Comment

export class WebhookIssueComment extends GithubIssueCommentBase {
  constructor(issue: GithubIssueBase, public original: GhIssueComment) {
    super(issue, convertWebhookIssueComment(issue, original));
  }
}

export function convertWebhookIssueComment(
  issue: GithubIssueBase,
  data: GhIssueComment,
): IssueCommentData {
  return {
    id: data.id,
    user: new WebhookUser(issue.manager, data.user!),
    body: data.body!,
  };
}
