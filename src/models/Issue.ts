import { User } from "./User.ts";

// issues

export interface IssueUpdateData {
  title: string;
  body?: string;

  labels: Label[];

  isOpen: boolean;
}

export interface IssueData extends IssueUpdateData {
  number: number;
  user?: User;
}

export interface Issue extends IssueData {
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

export interface IssueCommentData extends IssueCommentUpdateData {
  id: number;
  user: User;
}

export interface IssueComment extends IssueCommentData {
  update(
    data: Partial<IssueCommentUpdateData> & { body: string },
  ): Promise<void>;
}
