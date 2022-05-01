import { User as GhUser } from "@octokit/webhooks-types";

import { User } from "../../User.ts";

export class GithubUser implements User {
  name: string;
  nickname?: string;
  email?: string | null;

  constructor(public original: GhUser) {
    this.name = original.login;
    this.nickname = original.name;
    this.email = original.email;
  }
}
