import {
  Issue,
  IssueComment,
  IssueCommentUpdateData,
  IssueUpdateData,
  Label,
} from "../../issue.ts";
import { User } from "../../User.ts";

import { GhIssue, GhIssueComment } from "./_types.ts";
import { GithubModel, GithubModelManager } from "./GithubModel.ts";
import { GithubUser } from "./GithubUser.ts";
import { GithubRepository } from "./GithubRepository.ts";

export class GithubIssue extends GithubModel implements Issue {
  number!: number;
  user?: User;

  title!: string;
  body?: string;

  labels!: Label[];
  isOpen!: boolean;

  private baseParameter: { owner: string; repo: string; issue_number: number };

  constructor(
    public original: GhIssue,
    public repository: GithubRepository,
  ) {
    super();

    this.baseParameter = {
      owner: this.repository.original.owner.login,
      repo: this.repository.original.name,
      issue_number: original.number,
    };

    this.updateFrom(original);
    if (original.user) this.user = new GithubUser(this.manager, original.user);
  }

  public override get manager(): GithubModelManager {
    return this.repository.manager;
  }

  updateFrom(data: GhIssue) {
    this.title = data.title;
    this.body = data.body ?? this.body;

    const labels = [];
    for (const label of data.labels) {
      if (typeof label === "object") labels.push(label as Label);
      else throw Error("I didn't expect this");
    }
    this.labels = labels;

    this.isOpen = data.state == "open";
  }

  async update(data?: Partial<IssueUpdateData>): Promise<void> {
    if (!data) {
      const result = await this.octokit.issues.get(this.baseParameter);
      this.updateFrom(result.data);
      return;
    }

    const result = await this.octokit.issues.update({
      ...this.baseParameter,
      title: data.title,
      body: data.body,
      labels: data.labels,
      state: data.isOpen === undefined
        ? undefined
        : (data.isOpen ? "open" : "closed"),
    });

    this.updateFrom(result.data);
  }

  async open(): Promise<boolean> {
    await this.update({ isOpen: true });
    return this.isOpen == true;
  }

  async close(): Promise<boolean> {
    await this.update({ isOpen: false });
    return this.isOpen == false;
  }

  async addComment(body: string): Promise<IssueComment> {
    const result = await this.octokit.issues.createComment({
      ...this.baseParameter,
      body,
    });
    const comment = new GithubIssueComment(result.data, this);
    if (!comment.user) comment.user = await this.manager.me();
    comment.updateFrom(result.data);
    return comment;
  }
}

export class GithubIssueComment extends GithubModel implements IssueComment {
  user?: GithubUser;
  body!: string;

  private baseParameter!: { owner: string; repo: string; comment_id: number };

  constructor(public original: GhIssueComment, public issue: GithubIssue) {
    super();

    if (original.user) this.user = new GithubUser(this.manager, original.user);
    this.body = original.body!;
  }

  public get manager(): GithubModelManager {
    return this.issue.manager;
  }

  updateFrom(data: GhIssueComment) {
    this.body = data.body ?? this.body;
  }

  async update(
    data?: Partial<IssueCommentUpdateData> & { body: string },
  ): Promise<void> {
    if (!data) {
      const result = await this.octokit.issues.getComment(this.baseParameter);
      this.updateFrom(result.data);
      return;
    }

    const result = await this.octokit.issues.updateComment({
      ...this.baseParameter,
      ...data,
    });
    this.updateFrom(result.data);
  }
}
