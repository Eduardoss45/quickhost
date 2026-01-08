import { useState, useEffect } from 'react';
import axios from 'axios';
const url = import.meta.env.VITE_API_BASE_URL;

const useData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(url + '/api/accommodations');
        setData(response.data);
      } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};

export default useData;
