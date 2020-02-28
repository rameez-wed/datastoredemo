// @ts-check
import {initSchema} from '@aws-amplify/datastore';
import {schema} from './schema';

const PostStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
};

const {Post, Comment, Quote} = initSchema(schema);

export {Post, Comment, Quote, PostStatus};
