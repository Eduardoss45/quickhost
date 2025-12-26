import { useState, useEffect } from "react";
import axios from "axios";

const useCadastro = () => {
  const [formData, setFormData] = useState({
    username: "",
    birth_date: "",
    phone_number: "",
    email: "",
    cpf: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_USER_DATA_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setSuccess(true);
    } catch (error) {
      console.error(error.response.data);
      setError(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (success || error) {
      timer = setTimeout(() => {
        success ? setSuccess(false) : setError(null);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  return { formData, loading, error, success, handleChange, handleSubmit };
};

export default useCadastro;
