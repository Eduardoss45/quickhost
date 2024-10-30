import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useForm } from "../hooks/useForm";
import useCadastroAcomodacoes from "../hooks/useCadastroAcomodacoes";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import Step3 from "../components/Step3";
import Step4 from "../components/Step4";
import Step5 from "../components/Step5";
import Step6 from "../components/Step6";
import Step7 from "../components/Step7";
import Step8 from "../components/Step8";
import Step9 from "../components/Step9";

import "./CadastroAcomodacoes.css";

const formTemplate = {};

function CadastroAcomodacoes() {
  const [formData, setFormData] = useState(formTemplate);
  const { loading, error, success, handleSubmit } = useCadastroAcomodacoes();

  useEffect(() => {
    console.log("FormData atualizado:", formData);
  }, [formData]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Função para atualizar os dados do formulário
  const updateFieldHandler = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const formComponents = [
    <Step1 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step2 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step3 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step4 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step5 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step6 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step7 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step8 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step9 data={formData} updateFieldHandler={updateFieldHandler} />,
  ];

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useForm(formComponents);

  const validateForm = () => {
    const requiredFields = [];

    for (const field of requiredFields) {
      const value = formData[field];
      if (!value) {
        console.warn(`Campo obrigatório não preenchido: ${field}`);
        return false;
      }
    }
    return true;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isLastStep) {
      if (validateForm()) {
        handleSubmit(formData);
      } else {
        alert("Por favor, preencha todos os campos obrigatórios.");
      }
    } else {
      changeStep(currentStep + 1);
    }
  };

  return (
    <form
      id="description-form"
      onSubmit={handleFormSubmit}
      encType="multipart/form-data"
      onKeyDown={handleKeyDown}
    >
      <div className="description-bar">
        <Link to="/hospedar/anuncio">
          <div className="box-button">
            <button className="btn-painel">sair</button>
          </div>
        </Link>
      </div>
      <>{currentComponent}</>
      <div className="description-bar">
        {!isFirstStep && (
          <button type="button" onClick={() => changeStep(currentStep - 1)}>
            <span>
              <FaArrowLeftLong />
            </span>
          </button>
        )}
        {!isLastStep ? (
          <button type="submit">
            <span>
              <FaArrowRightLong />
            </span>
          </button>
        ) : (
          <div className="box-button">
            <button className="btn-painel" type="submit">
              finalizar
            </button>
          </div>
        )}
      </div>
      {loading && <p>Aguarde...</p>}
      {error && <p className="error message">Erro: {error}</p>}
      {success && (
        <p className="success message">Acomodação cadastrada com sucesso!</p>
      )}
    </form>
  );
}

export default CadastroAcomodacoes;
