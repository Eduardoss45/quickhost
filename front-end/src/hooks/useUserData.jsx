import { useState, useEffect } from "react";
import axios from "axios";

function useUserData(id_user, token) {
  const [data, setData] = useState(null); // Inicialmente null, pois estamos buscando dados de um usuário específico
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id_user) {
        setError(new Error("User ID is required"));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/user/${id_user}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_user, token]); // Dependências do hook para refetch ao mudar id_user ou token

  return { data, loading, error };
}

export default useUserData;
