import { Issue, Repository, User } from "@octokit/webhooks-types";

export default function onHandleRequest(
  repository: Repository,
  issue: Issue,
  sender: User,
  filePath: string,
) {
}
