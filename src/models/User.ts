export interface UserData {
  name: string;
  nickname?: string;
  email?: string | null;
}

export interface User extends UserData {
}
