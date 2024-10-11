import { useState } from "react";
import axios from "axios";

const useCadastroAcomodacoes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const id_user = localStorage.getItem("id_user");
  const token = localStorage.getItem("token");

  const transformInternalImages = async (images) => {
    return Promise.all(
      images.map(async (image) => {
        const response = await fetch(image[1]); // Usar o URL gerado
        console.log(`Blob para ${image[0]}:`, response);
        const blob = await response.blob();
        return new File([blob], image[0], { type: blob.type });
      })
    );
  };

  const handleChange = (e, setFormData) => {
    console.log("Evento recebido:", e);

    if (e && e.target) {
      const { name, value, type, checked } = e.target;
      console.log(
        `Mudança no campo: ${name}, Novo valor: ${
          type === "checkbox" ? checked : value
        }`
      );
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (e && typeof e === "object" && e.name && e.value) {
      console.log(`Mudança direta no campo: ${e.name}, Novo valor: ${e.value}`);
      setFormData((prevData) => ({
        ...prevData,
        [e.name]: e.value,
      }));
    } else {
      console.warn(
        "Evento não possui target nem é um objeto com name/value:",
        e
      );
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Usar FormData para enviar os dados
      const updatedFormData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "internal_images") {
          // Adiciona cada arquivo de imagem ao FormData usando a chave "internal_images"
          formData.internal_images.forEach((file) => {
            updatedFormData.append("internal_images", file[1]); // Aqui usamos apenas file[1]
          });
        } else if (key === "bank_account") {
          Object.keys(formData.bank_account).forEach((bankKey) => {
            updatedFormData.append(
              `bank_account[${bankKey}]`,
              formData.bank_account[bankKey]
            );
          });
        } else {
          updatedFormData.append(key, formData[key]);
        }
      });

      updatedFormData.forEach((value, key) => {
        console.log(`Key: ${key}, Value: ${value}`, value);
      });

      console.log(
        `Enviando dados para: http://127.0.0.1:8000/user/accommodation/create/${id_user}/`
      );

      console.log("Dados enviados:", JSON.stringify(formData, null, 2));

      const response = await axios.post(
        `http://127.0.0.1:8000/user/accommodation/create/${id_user}/`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta do servidor:", response.data);
      setSuccess(true);
    } catch (err) {
      console.error("Erro ao enviar os dados:", err);
      if (err.response) {
        console.error("Detalhes do erro:", err.response.data);
        setError(err.response.data.detail);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
      console.log("Carregamento finalizado, loading:", loading);
    }
  };

  return {
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
  };
};

export default useCadastroAcomodacoes;
