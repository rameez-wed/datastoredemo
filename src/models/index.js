// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PostStatus = {
  "ACTIVE": "ACTIVE",
  "INACTIVE": "INACTIVE"
};
const QuoteStatus = {
  "DRAFT": "DRAFT",
  "FINALIZED": "FINALIZED",
  "CUSTOMERREVIEWED": "CUSTOMERREVIEWED"
};

const { Post, Comment, Quote } = initSchema(schema);

export {
  Post,
  Comment,
  Quote,
  PostStatus,
  QuoteStatus
};