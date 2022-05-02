import { IssueCommentData, IssueData, Label } from "../../../Issue.ts";
import {
  GithubIssueBase,
  GithubIssueCommentBase,
} from "../base/GithubIssueBase.ts";
import { GithubRepositoryBase } from "../base/GithubRepositoryBase.ts";

import { GithubUser } from "./GithubUser.ts";
import { GhIssue, GhIssueComment } from "./_types.ts";

// Issue

export class GithubIssue extends GithubIssueBase {
  constructor(repository: GithubRepositoryBase, public original: GhIssue) {
    super(repository, convertApiIssue(repository, original));
  }

  override updateFromOpenapi(data: GhIssue) {
    this.original = data;
    super.updateFromOpenapi(data);
  }
}

export function convertApiIssue(
  repository: GithubRepositoryBase,
  data: GhIssue,
): IssueData {
  const labels = [];
  for (const label of data.labels) {
    if (typeof label === "object") labels.push(label as Label);
    else throw Error("I didn't expect this");
  }
  return {
    title: data.title,
    number: data.number,
    user: new GithubUser(repository.manager, data.user!),
    body: data.body ?? undefined,
    labels: labels,
    isOpen: data.state == "open",
  };
}

// Issue Comment

export class GithubIssueComment extends GithubIssueCommentBase {
  constructor(issue: GithubIssueBase, public original: GhIssueComment) {
    super(issue, convertApiIssueComment(issue, original));
  }

  override updateFromOpenapi(data: GhIssueComment) {
    this.original = data;
    super.updateFromOpenapi(data);
  }
}

export function convertApiIssueComment(
  issue: GithubIssueBase,
  data: GhIssueComment,
): IssueCommentData {
  return {
    id: data.id,
    user: new GithubUser(issue.manager, data.user!),
    body: data.body!,
  };
}
