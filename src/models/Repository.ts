import { Issue } from "./Issue.ts";
import { User } from "./User.ts";

export interface RepositoryData {
  name: string;
  owner: User;
}

export interface Repository extends RepositoryData {
  getIssues(): AsyncIterable<Issue>;
}
