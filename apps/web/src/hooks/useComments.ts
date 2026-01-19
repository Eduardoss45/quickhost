import { useCallback, useEffect, useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Comment } from '@/types';

interface UseCommentsOptions {
  page?: number;
  size?: number;
}

export function useComments(
  accommodationId?: string,
  options: UseCommentsOptions = { page: 1, size: 10 }
) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchComments = useCallback(async () => {
    if (!accommodationId) return;

    setLoading(true);
    try {
      const res = await api.get<Comment[]>(`/api/accommodations/${accommodationId}/comments`, {
        params: {
          page: options.page,
          size: options.size,
        },
      });

      setComments(res.data);
      setHasMore(res.data.length === options.size);
    } catch {
      toast.error('Erro ao carregar comentários');
    } finally {
      setLoading(false);
    }
  }, [accommodationId, options.page, options.size]);

  const createComment = useCallback(
    async (payload: { content: string; rating: number }) => {
      if (!accommodationId) return;

      setLoading(true);
      try {
        const res = await api.post<Comment>(
          `/api/accommodations/${accommodationId}/comments`,
          payload
        );

        setComments(prev => [res.data, ...prev]);
        toast.success('Comentário enviado');
      } catch (e: any) {
        toast.error(e.response?.data?.message ?? 'Erro ao enviar comentário');
      } finally {
        setLoading(false);
      }
    },
    [accommodationId]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    hasMore,
    fetchComments,
    createComment,
  };
}
