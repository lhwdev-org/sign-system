import { RepositoryData } from "../../../Repository.ts";
import { GithubModelManager } from "../base/GithubModel.ts";
import { GithubRepositoryBase } from "../base/GithubRepositoryBase.ts";

import { GithubUser } from "./GithubUser.ts";
import { GhRepository, GhSimpleUser } from "./_types.ts";

export class GithubRepository extends GithubRepositoryBase {
  constructor(manager: GithubModelManager, public original: GhRepository) {
    super(manager, convertApiRepository(manager, original));
  }
}

export function convertApiRepository(
  manager: GithubModelManager,
  data: GhRepository,
): RepositoryData {
  return {
    name: data.name,
    owner: new GithubUser(manager, data.owner as GhSimpleUser),
  };
}
