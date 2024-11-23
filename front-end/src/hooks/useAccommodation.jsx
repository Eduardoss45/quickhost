import { useState, useEffect } from "react";
import axios from "axios";

const useAccommodation = (uuid) => {
  const [accommodationData, setAccommodationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Só faz a requisição se o UUID for válido
    if (!uuid) {
      return; // Não faz nada se o UUID não estiver disponível
    }

    const fetchAccommodationData = async () => {
      setLoading(true); // Começa o carregamento
      setError(null); // Limpa qualquer erro anterior

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }${import.meta.env.VITE_ACCOMMODATION_URL.replace(
            "<uuid:id_accommodation>",
            uuid
          )}`
        );
        setAccommodationData(response.data); // Armazena os dados
      } catch (error) {
        console.error("Erro ao buscar dados da acomodação:", error);
        setError("Erro ao carregar dados da acomodação."); // Define a mensagem de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchAccommodationData();
  }, [uuid]); // Recarrega sempre que o uuid mudar ou for definido

  return { accommodationData, loading, error };
};

export default useAccommodation;
