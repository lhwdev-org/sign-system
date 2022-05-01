import { getOctokit } from "./github/github.ts";

let octokit: ReturnType<typeof getOctokit>;

export function octokitOf(): ReturnType<typeof getOctokit> {
  return octokit!;
}

export function initOctokit(
  token: string,
): ReturnType<typeof getOctokit> {
  if (octokit) return octokit;
  octokit = getOctokit(token);
  return octokit;
}
