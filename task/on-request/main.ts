import { Issue, Repository, User } from "../models/models.ts";

import octokit from "../actions/utils/octokit.ts";

export default function onHandleRequest(
  repository: Repository,
  issue: Issue,
  sender: User,
  filePath: string,
) {
}
