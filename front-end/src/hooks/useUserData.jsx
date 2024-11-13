import { useState, useEffect } from "react";
import axios from "axios";

const useUserData = (creator) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [id_user, setid_user] = useState(
    creator || localStorage.getItem("id_user")
  ); // Armazenando o ID do usuário

  const token = localStorage.getItem("token");
  console.log("Token:", token);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id_user) {
        setError(new Error("User ID is required"));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}${
            import.meta.env.VITE_USER_DATA_URL
          }${id_user}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
        console.log("Dados do usuário:", response.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError(
          error.response?.data.detail ||
            "An error occurred while fetching user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id_user, token]);

  return { userData, loading, error };
};

export default useUserData;
