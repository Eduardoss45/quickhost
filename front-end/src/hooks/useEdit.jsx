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
    profile_picture: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

      // Define cada campo individualmente
      const userData = response.data;
      setFormData((prevData) => ({
        ...prevData,
        username: userData.username || "",
        social_name: userData.social_name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        birth_date: userData.birth_date || "",
        emergency_contact: userData.emergency_contact || "",
      }));
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

      // Configure para exibir os dados enviados para o servidor
      console.log("Dados enviados para o servidor:");

      if (dataToSend instanceof FormData) {
        // Itera sobre as entradas do FormData e exibe no console
        for (const [key, value] of dataToSend.entries()) {
          console.log(`${key}: ${value}`);
        }
      } else {
        console.log(dataToSend); // Caso não seja FormData
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_USER_DATA_URL
        }${id_user}/`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFormData(response.data);
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.log(error);
      handleError(error);
      setSuccess(false);
    }
  };

  const handleError = (error) => {
    const errorMessage =
      error.response?.data?.detail || error.message || "An error occurred";
    setError(new Error(errorMessage));
  };

  const hasFile = (data) =>
    Object.values(data).some((value) => value instanceof File);

  const prepareFormData = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;

    if (id in formData) {
      if (id === "profile_picture" && isValidURL(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [id]: null,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      }
    } else {
      console.warn(`A chave "${id}" não existe no formData.`);
    }
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (e) {
      return false;
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
