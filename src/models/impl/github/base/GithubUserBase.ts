import { User, UserData } from "../../../User.ts";

import { GithubModel, GithubModelManager } from "./GithubModel.ts";

export class GithubUserBase extends GithubModel implements User {
  name: string;
  nickname?: string;
  email?: string | null;

  constructor(
    private _manager: GithubModelManager,
    public data: UserData,
  ) {
    super();

    this.name = data.name;
    this.nickname = data.nickname;
    this.email = data.email;
  }

  public override get manager() {
    return this._manager;
  }
}
