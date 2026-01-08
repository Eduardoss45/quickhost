import { useState, useEffect } from 'react';
import axios from 'axios';

const useComments = id_review => {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.token;

  const getComments = async (uuid = null) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${
          uuid
            ? import.meta.env.VITE_COMMENTS_MANAGE_URL.replace('<uuid:id_review>', uuid)
            : import.meta.env.VITE_COMMENTS_URL
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComentarios(response.data);
      console.log(response);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (user_uuid, accommodation_uuid, comment, rating) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_COMMENTS_URL}`,
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
      setComentarios(prev => [...prev, response.data]);
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (review_uuid, newComment, newRating) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_COMMENTS_MANAGE_URL}`,
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
      setComentarios(prev =>
        prev.map(item => (item.uuid === review_uuid ? { ...item, ...response.data } : item))
      );
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async review_uuid => {
    setLoading(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_COMMENTS_MANAGE_URL}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComentarios(prev => prev.filter(item => item.uuid !== review_uuid));
    } catch (err) {
      setError(err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_review) {
      getComments(id_review);
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
