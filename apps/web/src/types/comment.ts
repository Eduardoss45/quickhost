import { PublicUser } from './user';

export interface Comment {
  id: string;
  content: string;
  rating: number;
  authorId: string;
  authorName: string;
  createdAt: string;
  user?: PublicUser | null;
}
