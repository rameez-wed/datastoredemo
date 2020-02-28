import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum PostStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum QuoteStatus {
  DRAFT = "DRAFT",
  FINALIZED = "FINALIZED",
  CUSTOMERREVIEWED = "CUSTOMERREVIEWED"
}

export declare class Post {
  readonly id: string;
  readonly title: string;
  readonly comments?: Comment[];
  readonly rating: number;
  readonly status: PostStatus | keyof typeof PostStatus;
  constructor(init: ModelInit<Post>);
  static copyOf(source: Post, mutator: (draft: MutableModel<Post>) => MutableModel<Post> | void): Post;
}

export declare class Comment {
  readonly id: string;
  readonly content?: string;
  readonly post?: Post;
  constructor(init: ModelInit<Comment>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}

export declare class Quote {
  readonly id: string;
  readonly quoteNumber?: number;
  readonly quoteName?: string;
  readonly status?: QuoteStatus | keyof typeof QuoteStatus;
  readonly expirationDate?: string;
  readonly customerPoNumber?: string;
  readonly description?: string;
  constructor(init: ModelInit<Quote>);
  static copyOf(source: Quote, mutator: (draft: MutableModel<Quote>) => MutableModel<Quote> | void): Quote;
}