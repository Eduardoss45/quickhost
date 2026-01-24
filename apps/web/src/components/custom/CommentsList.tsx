import { IoStarSharp } from 'react-icons/io5';
import { Comment } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CommentsList({ comments }: { comments: Comment[] }) {
  if (!comments || comments.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum comentário ainda.</p>;
  }

  return (
    <ul className="space-y-4">
      {comments.map(comment => {
        const user = comment.user;

        const avatarUrl = user?.profile_picture_url
          ? `${API_BASE_URL}${user.profile_picture_url}`
          : null;

        const displayName = user?.social_name || user?.username || comment.authorName;

        return (
          <li key={comment.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="font-medium">{displayName}</span>
              </div>

              <div className="flex items-center gap-1">
                <IoStarSharp className="text-yellow-500" />
                <span className="text-sm">{comment.rating}</span>
              </div>
            </div>

            <p className="mt-3 text-sm">{comment.content}</p>

            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
