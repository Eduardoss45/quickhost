export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface CommentList {
  id: string;
  user: {
    id: string;
    username: string;
    profile_picture_url?: string | null;
  };
  content: string;
  rating: number;
  created_at: string;
}
