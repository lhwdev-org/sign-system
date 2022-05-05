import { auth } from "./auth.ts";
import { hook } from "./hook.ts";
import { StrategyInterface, Token, Authentication } from "./types.ts";

export type Types = {
  StrategyOptions: Token;
  AuthOptions: never;
  Authentication: Authentication;
};

export const createTokenAuth: StrategyInterface = function createTokenAuth(
  token: Token
) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error(
      "[@octokit/auth-token] Token passed to createTokenAuth is not a string"
    );
  }

  token = token.replace(/^(token|bearer) +/i, "");

  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token),
  });
};
