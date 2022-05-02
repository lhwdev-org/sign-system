import { components } from "@octokit/openapi-types";

type schemas = components["schemas"];

export type GhRepository = schemas["repository"];
export type GhIssue = schemas["issue"];
export type GhIssueComment = schemas["issue-comment"];
export type GhSimpleUser = schemas["simple-user"];
