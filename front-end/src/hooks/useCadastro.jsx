import React, { useState } from "react";
import axios from "axios";

function useCadastro(url) {
  const [formData, setFormData] = useState({
    username: "",
    birth_date: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(`Campo ${name} atualizado:`, value); // Log do campo atualizado
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log("Dados enviados:", formData); // Log dos dados enviados
    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Resposta do servidor:", response.data); // Log da resposta do servidor
      setSuccess(true);
    } catch (error) {
      console.error("Erro ao cadastrar o usuário:", error); // Log do erro
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    let timer;
    if (success) {
      console.log("Cadastro realizado com sucesso!"); // Log de sucesso
      timer = setTimeout(() => {
        setSuccess(false);
      }, 10000);
    } else if (error) {
      console.log("Erro ao tentar cadastrar o usuário."); // Log de erro
      timer = setTimeout(() => {
        setError(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [success, error]); // Adicionei error aqui para garantir que seja monitorado

  return { formData, loading, error, success, handleChange, handleSubmit };
}

export default useCadastro;
