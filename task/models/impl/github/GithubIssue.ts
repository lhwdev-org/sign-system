import {
  Issue as GhIssue,
  Label as GhLabel,
  Repository as GhRepository,
} from "@octokit/webhooks-types";
import { components } from "@octokit/openapi-types";

import { Issue, IssueComment, IssueUpdateData, Label } from "../../issue.ts";
import { User } from "../../User.ts";

import octokit from "../../../actions/utils/octokit.ts";
import { GithubUser } from "./GithubUser.ts";

export class GithubIssue implements Issue {
  number!: number;
  user: User;

  title!: string;
  body!: string;

  labels!: Label[];
  isOpen!: boolean;

  private baseParameter!: { owner: string; repo: string; issue_number: number };

  constructor(public original: GhIssue, public repository: GhRepository) {
    this.updateFrom(original);
    this.user = new GithubUser(original.user);
  }

  updateFrom(data: GhIssue) {
    this.number = data.number;
    this.title = data.title;
    this.body = data.body ?? "";
    this.labels = data.labels ?? [];
    this.isOpen = data.state == "open";

    this.baseParameter = {
      owner: this.repository.owner.login,
      repo: this.repository.name,
      issue_number: data.number,
    };
  }

  updateFromResult(data: components["schemas"]["issue"]) {
    this.title = data.title;
    this.body = data.body ?? this.body;

    const labels = [];
    for (const label of data.labels) {
      if (typeof label === "object") labels.push(label as GhLabel);
      else throw Error("I didn't expect this");
    }
    this.labels = labels;

    this.isOpen = data.state == "open";
  }

  async update(data?: Partial<IssueUpdateData>): Promise<void> {
    if (!data) {
      const result = await octokit.rest.issues.get(this.baseParameter);
      this.updateFromResult(result.data);
      return;
    }

    const result = await octokit.rest.issues.update({
      ...this.baseParameter,
      title: data.title,
      body: data.body,
      labels: data.labels,
      state: data.isOpen === undefined
        ? undefined
        : (data.isOpen ? "open" : "closed"),
    });

    this.updateFromResult(result.data);
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
  }
}
