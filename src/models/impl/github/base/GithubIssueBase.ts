import {
  Issue,
  IssueComment,
  IssueCommentData,
  IssueCommentUpdateData,
  IssueData,
  IssueUpdateData,
  Label,
} from "../../../Issue.ts";
import { User } from "../../../User.ts";
import {
  convertApiIssue,
  convertApiIssueComment,
  GithubIssueComment,
} from "../openapi/GithubIssue.ts";
import { GhIssue, GhIssueComment } from "../openapi/_types.ts";

import { GithubModel, GithubModelManager } from "./GithubModel.ts";
import { GithubRepositoryBase } from "./GithubRepositoryBase.ts";

export abstract class GithubIssueBase extends GithubModel implements Issue {
  number!: number;
  user?: User;

  title!: string;
  body?: string;

  labels!: Label[];
  isOpen!: boolean;

  private baseParameter: { owner: string; repo: string; issue_number: number };

  constructor(
    public repository: GithubRepositoryBase,
    data: IssueData,
  ) {
    super();

    this.baseParameter = {
      owner: repository.owner.name,
      repo: repository.name,
      issue_number: data.number,
    };

    this.updateFrom(data);
  }

  public override get manager(): GithubModelManager {
    return this.repository.manager;
  }

  updateFrom(data: IssueData) {
    this.number = data.number;
    this.user = data.user;
    this.title = data.title;
    this.body = data.body;
    this.labels = data.labels;
    this.isOpen = data.isOpen;
  }

  updateFromOpenapi(data: GhIssue) {
    this.updateFrom(convertApiIssue(this.repository, data));
  }

  async update(data?: Partial<IssueUpdateData>): Promise<void> {
    if (!data) {
      const result = await this.rest.issues.get(this.baseParameter);
      this.updateFromOpenapi(result.data);
      return;
    }

    const result = await this.rest.issues.update({
      ...this.baseParameter,
      title: data.title,
      body: data.body,
      labels: data.labels,
      state: data.isOpen === undefined
        ? undefined
        : (data.isOpen ? "open" : "closed"),
    });

    this.updateFromOpenapi(result.data);
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
    const result = await this.rest.issues.createComment({
      ...this.baseParameter,
      body,
    });
    const comment = new GithubIssueComment(this, result.data);
    if (!comment.user) comment.user = await this.manager.me();
    comment.updateFromOpenapi(result.data);
    return comment;
  }
}

export class GithubIssueCommentBase extends GithubModel
  implements IssueComment {
  id!: number;
  user!: User;
  body!: string;

  private baseParameter!: { owner: string; repo: string; comment_id: number };

  constructor(public issue: GithubIssueBase, data: IssueCommentData) {
    super();

    this.baseParameter = {
      owner: issue.repository.owner.name,
      repo: issue.repository.name,
      comment_id: data.id,
    };

    this.updateFrom;
  }

  public get manager(): GithubModelManager {
    return this.issue.manager;
  }

  updateFrom(data: IssueCommentData) {
    this.id = data.id;
    this.user = data.user;
    this.body = data.body;
  }

  updateFromOpenapi(data: GhIssueComment) {
    this.updateFrom(convertApiIssueComment(this.issue, data));
  }

  /* updateFrom(data: GhIssueComment) {
    this.body = data.body ?? this.body;
  } */

  async update(
    data?: Partial<IssueCommentUpdateData> & { body: string },
  ): Promise<void> {
    if (!data) {
      const result = await this.rest.issues.getComment(this.baseParameter);
      this.updateFromOpenapi(result.data);
      return;
    }

    const result = await this.rest.issues.updateComment({
      ...this.baseParameter,
      ...data,
    });
    this.updateFromOpenapi(result.data);
  }
}
