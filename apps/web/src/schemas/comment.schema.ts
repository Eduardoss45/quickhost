import { z } from 'zod';

export const commentSchema = z.object({
  content: z.string().min(1, 'O comentário é obrigatório').trim(),
  rating: z.number().min(1, 'Selecione uma nota').max(5),
});

export type CommentFormData = z.infer<typeof commentSchema>;
