import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAccommodation = (initialId = null) => {
  const [selectedAccommodationId, setSelectedAccommodationId] =
    useState(initialId);
  const [accommodationData, setAccommodationData] = useState(null);
  const navigate = useNavigate();

  const selectAccommodation = (id_accommodation) => {
    setSelectedAccommodationId(id_accommodation);
  };

  useEffect(() => {
    if (selectedAccommodationId) {
      const fetchAccommodationData = async () => {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_BASE_URL
            }${import.meta.env.VITE_ACCOMMODATION_URL.replace(
              "<uuid:id_accommodation>",
              selectedAccommodationId
            )}`
          );
          setAccommodationData(response.data);
        } catch (error) {
          console.error("Erro ao buscar dados da acomodação:", error);
        }
      };

      fetchAccommodationData();
    }
  }, [selectedAccommodationId]);

  return { accommodationData, selectAccommodation };
};

export default useAccommodation;
