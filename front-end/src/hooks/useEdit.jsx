import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useEdit = (id_user, token) => {
  const [formData, setFormData] = useState({
    username: "",
    social_name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    emergency_contact: "",
    profile_picture: null, // Adicione o campo aqui para garantir que exista
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (!id_user || !token) {
      setError(new Error("User ID and Authorization token are required"));
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_USER_DATA_URL
        }${id_user}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData(response.data);
      setSuccess(true);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [id_user, token]);

  const editUser = async (updatedData) => {
    if (!id_user || !token) {
      setError(new Error("User ID and Authorization token are required"));
      return;
    }

    try {
      const dataToSend = hasFile(updatedData)
        ? prepareFormData(updatedData)
        : updatedData;

      const response = await axios.put(
        `${import.meta.env.VITE_QUICKHOST_BASE_URL}${
          import.meta.env.VITE_USER_DATA_URL
        }${id_user}/`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData(response.data);
      setSuccess(true);
      setError(null); // Reset error on success
    } catch (error) {
      handleError(error);
      setSuccess(false);
    }
  };

  // Handle errors and set appropriate state
  const handleError = (error) => {
    const errorMessage =
      error.response?.data?.detail || error.message || "An error occurred";
    setError(new Error(errorMessage));
  };

  // Check if there's a file in the data
  const hasFile = (data) =>
    Object.values(data).some((value) => value instanceof File);

  // Prepare FormData for file uploads
  const prepareFormData = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { id, value } = event.target;

    // Adicione uma verificação para garantir que id existe no estado
    if (id in formData) {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    } else {
      console.warn(`A chave "${id}" não existe no formData.`);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    formData,
    loading,
    error,
    success,
    fetchUserData,
    editUser,
    handleChange,
  };
};

export default useEdit;
