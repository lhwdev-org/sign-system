import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { GithubUser } from "./GithubUser.ts";

type Rest = ReturnType<typeof restEndpointMethods>["rest"];

export abstract class GithubModel {
  public abstract get manager(): GithubModelManager;

  public get octokit(): Rest {
    return this.manager.octokit;
  }
}

export class GithubModelManager {
  private meUser?: GithubUser;

  constructor(public octokit: Rest) {}

  async me(forceReload?: boolean): Promise<GithubUser> {
    if (forceReload || !this.meUser) {
      const result = await this.octokit.users.getAuthenticated();
      this.meUser = new GithubUser(this, result.data);
    }

    return this.meUser;
  }
}
