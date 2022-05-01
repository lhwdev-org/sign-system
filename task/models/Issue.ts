import { User } from "./User.ts";

// issues

export interface IssueUpdateData {
  title: string;
  body: string;

  labels: Label[];

  isOpen: boolean;
}

export interface Issue extends IssueUpdateData {
  number: number;
  user: User;

  update(data?: Partial<IssueUpdateData>): Promise<void>;

  open(): Promise<boolean>;
  close(): Promise<boolean>;

  addComment(body: string): Promise<IssueComment>;
}

// extras

export interface Label {
  name: string;
  description: string | null;
}

// comments

export interface IssueCommentUpdateData {
  body: string;
}

export interface IssueComment extends IssueCommentUpdateData {
  user: User;

  update(data: Partial<IssueCommentUpdateData>): Promise<void>;
}
