import { IoStarSharp } from 'react-icons/io5';
import { CommentList } from '@/types';

interface Props {
  comments: CommentList[];
}

export default function CommentsList({ comments }: Props) {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum comentário ainda.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map(comment => (
        <li key={comment.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {comment.user.profile_picture_url && (
                <img
                  src={comment.user.profile_picture_url}
                  alt={comment.user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="font-medium">{comment.user.username}</span>
            </div>

            <div className="flex items-center gap-1">
              <IoStarSharp className="text-yellow-500" />
              <span className="text-sm">{comment.rating}</span>
            </div>
          </div>

          <p className="mt-3 text-sm">{comment.content}</p>

          <span className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
}
