import { useState, useEffect } from 'react';
import axios from 'axios';

const useDetalhes = uuid => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uuid) {
        setError(new Error('uuid is required'));
        setLoading(false);
        return;
      }
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_DETAILS_URL}`,
          { uuid }
        );

        if (response && response.data) {
          setUserData(response.data);
        } else {
          setError('No data found.');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);

        setError(error.response?.data?.detail || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uuid]);

  return { userData, loading, error };
};

export default useDetalhes;
