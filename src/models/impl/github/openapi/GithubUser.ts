import { UserData } from "../../../User.ts";
import { GithubModelManager } from "../base/GithubModel.ts";
import { GithubUserBase } from "../base/GithubUserBase.ts";

import { GhSimpleUser } from "./_types.ts";

export class GithubUser extends GithubUserBase {
  constructor(manager: GithubModelManager, public original: GhSimpleUser) {
    super(manager, convertApiUser(manager, original));
  }
}

export function convertApiUser(
  _manager: GithubModelManager,
  data: GhSimpleUser,
): UserData {
  return {
    name: data.login,
    nickname: data.name ?? undefined,
    email: data.email,
  };
}
