import { useUser } from '@/hooks/useUser';
import { commentToList } from '@/mappers/comment.mapper';
import CommentsForm from './CommentsForm';
import CommentsList from './CommentsList';
import { useComments } from '@/hooks/useComments';

export default function CommentsSection({ accommodationId }: { accommodationId: string }) {
  const { user } = useUser();
  const { comments, createComment } = useComments(accommodationId);

  const canComment = !!user;

  const listComments = comments.map(commentToList);

  return (
    <section>
      <h2 className="text-2xl">Avaliações ({comments.length})</h2>

      {canComment && <CommentsForm onSubmit={createComment} />}

      <CommentsList comments={listComments} />
    </section>
  );
}
