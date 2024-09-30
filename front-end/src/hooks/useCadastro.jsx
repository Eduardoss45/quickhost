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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      timer = setTimeout(() => {
        setSuccess(false);
      }, 10000);
    } else if (error) {
      timer = setTimeout(() => {
        setError(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [success, error]); // Adicionei error aqui para garantir que seja monitorado

  return { formData, loading, error, success, handleChange, handleSubmit };
}

export default useCadastro;
