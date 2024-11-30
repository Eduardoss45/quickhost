import { useState, useEffect } from "react";
import axios from "axios";

const useComments = (id_review) => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.token;

  // Função GET: traz todos os comentários ou por ID de review
  const getComments = async (uuid = null) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}${
          uuid
            ? import.meta.env.VITE_COMMENTS_MANAGE_URL.replace(
                "<uuid:id_review>",
                uuid
              )
            : import.meta.env.VITE_COMMENTS_URL
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComentarios(response.data);
      console.log(response)
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função POST: cria um novo comentário
  const postComment = async (
    user_uuid,
    accommodation_uuid,
    comment,
    rating
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_COMMENTS_URL}`,
        {
          user_comment: user_uuid,
          rating: rating,
          comment: comment,
          accommodation: accommodation_uuid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setComentarios((prev) => [...prev, response.data]); // Adiciona o novo comentário à lista
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função PUT: atualiza um comentário existente
  const updateComment = async (review_uuid, newComment, newRating) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_COMMENTS_MANAGE_URL
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        {
          comment: newComment,
          rating: newRating,
        }
      );
      setComentarios((prev) =>
        prev.map((item) =>
          item.uuid === review_uuid ? { ...item, ...response.data } : item
        )
      );
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  // Função DELETE: remove um comentário existente
  const deleteComment = async (review_uuid) => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_COMMENTS_MANAGE_URL
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComentarios((prev) =>
        prev.filter((item) => item.uuid !== review_uuid)
      ); // Remove o comentário deletado
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_review) {
      getComments(id_review); // Busca os comentários quando o ID da acomodação é fornecido
    }
  }, [id_review]);

  return {
    comentarios,
    loading,
    error,
    getComments,
    postComment,
    updateComment,
    deleteComment,
  };
};

export default useComments;
