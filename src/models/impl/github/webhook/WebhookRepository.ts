import { Repository as GhRepository } from "@octokit/webhooks-types";

import { RepositoryData } from "../../../Repository.ts";
import { GithubModelManager } from "../base/GithubModel.ts";
import { GithubRepositoryBase } from "../base/GithubRepositoryBase.ts";

import { WebhookUser } from "./WebhookUser.ts";

export class WebhookRepository extends GithubRepositoryBase {
  constructor(manager: GithubModelManager, public original: GhRepository) {
    super(manager, convertWebhookRepository(manager, original));
  }
}

export function convertWebhookRepository(
  manager: GithubModelManager,
  data: GhRepository,
): RepositoryData {
  return {
    name: data.name,
    owner: new WebhookUser(manager, data.owner),
  };
}
