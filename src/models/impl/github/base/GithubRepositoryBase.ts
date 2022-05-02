import { Repository, RepositoryData } from "../../../Repository.ts";
import { User } from "../../../User.ts";
import { Issue } from "../../../Issue.ts";

import { GithubModel, GithubModelManager } from "./GithubModel.ts";
import { GithubIssue } from "../openapi/GithubIssue.ts";

export class GithubRepositoryBase extends GithubModel implements Repository {
  name: string;
  owner: User;

  constructor(
    private _manager: GithubModelManager,
    public data: RepositoryData,
  ) {
    super();

    this.name = data.name;
    this.owner = data.owner;
  }

  public get manager(): GithubModelManager {
    return this._manager;
  }

  async *getIssues(): AsyncIterable<Issue> {
    const iterator = this._manager.octokit.paginate.iterator(
      this.rest.issues.listForRepo,
      {
        owner: this.owner.name,
        repo: this.name,
      },
    );

    for await (const item of iterator) {
      const issues = item.data;
      for (const issue of issues) {
        yield (new GithubIssue(this, issue));
      }
    }
  }
}
