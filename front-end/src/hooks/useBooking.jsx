import { useState, useEffect } from "react";
import axios from "axios";

const useBooking = (id_accommodation) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BOOKINGS_URL}`
        );
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id_accommodation) {
      fetchData();
    }
  });

  return { comentarios, loading, error };
};

export default useBooking;
