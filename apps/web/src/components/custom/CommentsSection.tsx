import { useEffect, useState } from 'react';
import { IoStarSharp } from 'react-icons/io5';
import { useUser } from '@/hooks/useUser';
import CommentsForm from './CommentsForm';
import CommentsList from './CommentsList';
import { useComments } from '@/hooks/useComments';
import { Comment } from '@/types';

export default function CommentsSection({
  accommodationId,
  averageRating,
}: {
  accommodationId: string;
  averageRating: number;
}) {
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
      <div className="flex justify-between">
        <h2 className="text-2xl">Avaliações ({enrichedComments.length})</h2>
        <div className="flex gap-2 justify-between p-2">
          <span>
            <IoStarSharp className="text-yellow-400 text-2xl" />
          </span>
          <p className="font-bold text-xl">{averageRating}</p>
        </div>
      </div>
      {canComment && <CommentsForm onSubmit={createComment} />}

      <CommentsList comments={enrichedComments} />
    </section>
  );
}
