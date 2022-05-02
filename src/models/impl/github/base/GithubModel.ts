import { Octokit } from "@octokit/core";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { paginateRest } from "@octokit/plugin-paginate-rest";

import { GithubUser } from "../openapi/GithubUser.ts";

type Rest = ReturnType<typeof restEndpointMethods>["rest"];

type MyOctokit =
  & Octokit
  & ReturnType<typeof restEndpointMethods>
  & ReturnType<typeof paginateRest>;

export abstract class GithubModel {
  public abstract get manager(): GithubModelManager;

  public get rest(): Rest {
    return this.octokit.rest;
  }

  public get octokit(): MyOctokit {
    return this.manager.octokit;
  }
}

export class GithubModelManager {
  private meUser?: GithubUser;

  constructor(public octokit: MyOctokit) {}

  async me(forceReload?: boolean): Promise<GithubUser> {
    if (forceReload || !this.meUser) {
      const result = await this.octokit.rest.users.getAuthenticated();
      this.meUser = new GithubUser(this, result.data);
    }

    return this.meUser;
  }
}
