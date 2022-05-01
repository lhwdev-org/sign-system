import { User } from "./User.ts";

export interface Repository {
  name: string;
  owner: User;
}
