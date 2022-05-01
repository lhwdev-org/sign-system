import { Issue, Repository, User } from "@octokit/webhooks-types";

import octokit from "../actions/utils/octokit.ts";

export default function onHandleRequest(
  repository: Repository,
  issue: Issue,
  sender: User,
  filePath: string,
) {
  octokit.rest.issues.updateComment({});
}
