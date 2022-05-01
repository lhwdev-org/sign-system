import { Repository } from "../../Repository.ts";
import { User } from "../../User.ts";

import { GithubModel, GithubModelManager } from "./GithubModel.ts";
import { GhRepository } from "./_types.ts";
import { GithubUser } from "./GithubUser.ts";

export class GithubRepository extends GithubModel implements Repository {
  name: string;
  owner: User;

  constructor(
    private _manager: GithubModelManager,
    public original: GhRepository,
  ) {
    super();

    this.name = original.name;
    this.owner = new GithubUser(_manager, original.owner);
  }

  public get manager(): GithubModelManager {
    return this._manager;
  }
}
