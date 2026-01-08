import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserData = () => {
  const email = localStorage.getItem('email');
  const password = localStorage.getItem('password');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id_user = localStorage.getItem('id_user');
  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchUserData = async () => {
      if (!id_user) {
        setError(new Error('User ID is required'));
        setLoading(false);
        return;
      }
      try {
        const params = {};
        if (email) params.email = email;
        if (password) params.password = password;

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_USER_DATA_URL}${id_user}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params,
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError(error.response?.data.detail || 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [id_user, token, email, password]);
  return { userData, loading, error };
};

export default useUserData;
