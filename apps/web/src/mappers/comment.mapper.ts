// mappers/comment.mapper.ts
import { Comment, CommentList } from '@/types';

export function commentToList(comment: Comment): CommentList {
  return {
    id: comment.id,
    content: comment.content,
    rating: 0,
    created_at: comment.createdAt,
    user: {
      id: comment.authorId,
      username: comment.authorName,
      profile_picture_url: null,
    },
  };
}
