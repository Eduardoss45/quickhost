import { useState } from "react";
import axios from "axios";

const useLogin = (handleAuthenticated) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (email, password) => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TOKEN_URL}`,
        { email, password }
      );

      console.log(response);

      storeTokens(response.data.tokens);

      const msg = response.data.message;
      setSuccessMessage(msg);

      if (handleAuthenticated) handleAuthenticated();

      return true;
    } catch (error) {
      const err = error.response?.data?.error || "Erro desconhecido";
      setErrorMessage(err);

      return false;
    } finally {
      setLoading(false);
    }
  };
  const storeTokens = (tokens) => {
    localStorage.setItem("token", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    localStorage.setItem("id_user", tokens.user.id_user);
    localStorage.setItem("isAuthenticated", tokens.user.authenticated);
  };

  return {
    handleLogin,
    errorMessage,
    successMessage,
    loading,
  };
};

export default useLogin;
