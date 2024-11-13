import { useState } from "react";
import axios from "axios";

const useCadastroAcomodacoes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const id_user = localStorage.getItem("id_user");
  const token = localStorage.getItem("token");

  // const transformInternalImages = async (images) => {
  //   return Promise.all(
  //     images.map(async (image) => {
  //       const response = await fetch(image[1]);
  //       console.log(`Blob para ${image[0]}:`, response);
  //       const blob = await response.blob();
  //       return new File([blob], image[0], { type: blob.type });
  //     })
  //   );
  // };

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
      const updatedFormData = new FormData();

      const images = Array.isArray(formData.internal_images)
        ? formData.internal_images
        : Array.from(formData.internal_images || []);

      Object.keys(formData).forEach((key) => {
        if (key === "internal_images") {
          images.forEach((file) => {
            updatedFormData.append("internal_images", file);
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

      const apiUrl = `${
        import.meta.env.VITE_BASE_URL
      }${import.meta.env.VITE_ACCOMMODATION_CREATE_URL.replace(
        "{id_user}",
        id_user
      )}`;

      console.log(`Enviando dados para: ${updatedFormData}`);

      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }${import.meta.env.VITE_ACCOMMODATION_CREATE_URL.replace(
          "<uuid:id_user>",
          id_user
        )}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Resposta do servidor:", response.data);
      setSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      if (error.response) {
        console.error("Detalhes do erro:", error.response.data);
        setError(error.response.data.detail);
      } else {
        setError(error.message);
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
