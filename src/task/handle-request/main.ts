import { Issue, Repository, User } from "../../models/models.ts";

export default async function onHandleRequest(
  repository: Repository,
  issue: Issue,
  sender: User,
  filePath: string,
) {
}
