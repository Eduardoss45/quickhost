import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import CommentsForm from './CommentsForm';
import CommentsList from './CommentsList';
import { useComments } from '@/hooks/useComments';
import { Comment } from '@/types';

export default function CommentsSection({ accommodationId }: { accommodationId: string }) {
  const { getPublicUser, user } = useUser();
  const { comments, createComment } = useComments(accommodationId);

  const [enrichedComments, setEnrichedComments] = useState<Comment[]>([]);

  const canComment = !!user;

  useEffect(() => {
    async function enrich() {
      const result = await Promise.all(
        comments.map(async comment => {
          if (comment.user) return comment;

          const publicUser = await getPublicUser(comment.authorId);

          return {
            ...comment,
            user: publicUser,
          };
        })
      );

      setEnrichedComments(result);
    }

    if (comments.length > 0) {
      enrich();
    } else {
      setEnrichedComments([]);
    }
  }, [comments, getPublicUser]);

  return (
    <section>
      <h2 className="text-2xl">Avaliações ({enrichedComments.length})</h2>

      {canComment && <CommentsForm onSubmit={createComment} />}

      <CommentsList comments={enrichedComments} />
    </section>
  );
}
