import { Comment } from '../types';

export type CreateCommentCommand = Comment & {
  accommodationId: string;
  authorId: string;
  authorName: string;
};
