import { useState } from "react";
import axios from "axios";

const useEditAcomodacao = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const id_user = localStorage.getItem("id_user");
  const token = localStorage.getItem("token");

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

  const handleSubmit = async (formData, accommodationData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedFormData = new FormData();

      const images = Array.isArray(formData.internal_images)
        ? formData.internal_images
        : Array.from(formData.internal_images || []);

      // Object.keys(formData).forEach((key) => {
      //   if (key === "internal_images") {
      //     images.forEach((file) => {
      //       updatedFormData.append("internal_images", file);
      //     });
      //   } else {
      //     updatedFormData.append(key, formData[key]);
      //   }
      // });

      console.log(`Enviando dados para: ${updatedFormData}`);

      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }${import.meta.env.VITE_ACCOMMODATION_URL.replace(
          "<uuid:id_accommodation>",
          accommodationData
        )}`,
        updatedFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setSuccess(true);
    } catch (error) {
      console.error("Erro ao enviar os dados:", error);
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Erro desconhecido");
      }
    } finally {
      setLoading(false);
      console.log("Carregamento finalizado, loading:", loading);
    }
  };

  const handleDelete = async (accommodationData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    console.log(accommodationData);

    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_BASE_URL
        }${import.meta.env.VITE_ACCOMMODATION_URL.replace(
          "<uuid:id_accommodation>",
          accommodationData
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess(true);
      console.log("Acomodação deletada com sucesso");
    } catch (error) {
      console.error("Erro ao deletar acomodação", error);
      if (error.response) {
        setError(error.response.data.detail);
      } else {
        setError("Erro desconhecido");
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
    handleDelete,
  };
};

export default useEditAcomodacao;
