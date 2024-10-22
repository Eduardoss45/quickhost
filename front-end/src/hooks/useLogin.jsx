import { useState } from "react";
import axios from "axios";

const useLogin = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // Estado para gerenciar o carregamento

  const handleLogin = async (email, password) => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true); // Inicia o carregamento

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_TOKEN_URL}`,
        { email, password }
      );

      // Armazenamento de tokens no localStorage
      storeTokens(response.data.tokens);

      setIsAuthenticated(true);
      const msg = response.data.message;
      setSuccessMessage(msg);
      return true;
    } catch (error) {
      const err = error.response?.data?.error || "Erro desconhecido";
      setErrorMessage(err);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const storeTokens = (tokens) => {
    localStorage.setItem("token", tokens.access);
    localStorage.setItem("refreshToken", tokens.refresh);
    localStorage.setItem("id_user", tokens.user.id_user);
  };

  return {
    handleLogin,
    errorMessage,
    successMessage,
    isAuthenticated,
    loading, // Inclui o estado de carregamento
  };
};

export default useLogin;
