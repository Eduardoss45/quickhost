import { useState, useEffect } from "react";
import axios from "axios";

const useAccommodation = (uuid) => {
  const [accommodationData, setAccommodationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!uuid) {
      console.log(uuid);
      return;
    }

    const fetchAccommodationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }${import.meta.env.VITE_ACCOMMODATION_URL.replace(
            "<uuid:id_accommodation>",
            uuid
          )}`
        );
        setAccommodationData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados da acomodação:", error);
        setError("Erro ao carregar dados da acomodação.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodationData();
  }, [uuid]);

  return { accommodationData, loading, error };
};

export default useAccommodation;
