import { User } from "../../User.ts";

import { GhSimpleUser } from "./_types.ts";
import { GithubModel, GithubModelManager } from "./GithubModel.ts";

export class GithubUser extends GithubModel implements User {
  name: string;
  nickname?: string;
  email?: string | null;

  constructor(
    private _manager: GithubModelManager,
    public original: GhSimpleUser,
  ) {
    super();

    this.name = original.login;
    this.nickname = original.name ?? undefined;
    this.email = original.email;
  }

  public override get manager() {
    return this._manager;
  }
}
