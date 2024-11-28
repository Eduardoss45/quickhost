import { useState } from "react";
import axios from "axios";

const useCancelarReservas = (id_booking) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const token = localStorage.getItem("token");

  console.log(id_booking);

  const handleDeleteReserva = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BASE_URL
        }${import.meta.env.VITE_BOOKINGS_MANAGE_URL.replace(
          "<uuid:id_booking>",
          id_booking
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteReserva,
    loading,
    error,
    success,
  };
};

export default useCancelarReservas;
