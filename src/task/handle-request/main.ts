import { Issue, Repository, User } from "../../models/models.ts";
import { create } from "../actions/utils/artifact/artifact-client.ts";

export default async function onHandleRequest(
  repository: Repository,
  issue: Issue,
  sender: User,
  filePath: string,
) {
}
