import { useState } from "react";
import axios from "axios";

const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("token");

  const bookAccommodation = async (bookingData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_BOOKINGS_URL}`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Reserva enviada com sucesso:", response.data);
      setSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return { bookAccommodation, loading, error, success };
};

export default useBooking;
