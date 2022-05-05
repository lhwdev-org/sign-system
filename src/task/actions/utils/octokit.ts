import { GithubModelManager } from "../../../models/impl/github/base/GithubModel.ts";
import { octokitOf } from "./octokit-init.ts";

const octokit = octokitOf();
const manager = new GithubModelManager(octokit.rest);
export default manager;
