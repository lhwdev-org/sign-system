import { User as GhUser } from "@octokit/webhooks-types";

import { UserData } from "../../../User.ts";
import { GithubModelManager } from "../base/GithubModel.ts";
import { GithubUserBase } from "../base/GithubUserBase.ts";

export class WebhookUser extends GithubUserBase {
  constructor(manager: GithubModelManager, public original: GhUser) {
    super(manager, convertWebhookUser(manager, original));
  }
}

export function convertWebhookUser(
  _manager: GithubModelManager,
  data: GhUser,
): UserData {
  return {
    name: data.login,
    nickname: data.name ?? undefined,
    email: data.email,
  };
}
