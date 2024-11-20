import { useState, useEffect } from "react";
import axios from "axios";

const useComents = (id_accommodation) => {
  const [comentarios, setComentarios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }${import.meta.env.VITE_COMNENTS_MANAGE_URL.replace(
            "<uuid:identifier>",
            id_accommodation
          )}`
        );
        setComentarios(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_accommodation) {
      fetchData();
    }
  }, [id_accommodation]); // Agora, a requisição será feita sempre que id_accommodation mudar

  return { comentarios, loading, error };
};

export default useComents;
