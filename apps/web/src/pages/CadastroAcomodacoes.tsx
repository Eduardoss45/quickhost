import useCadastroAcomodacoes from "../hooks/useCadastroAcomodacoes";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "../hooks/useForm";
import { useState, useEffect, useRef } from "react";

import Step1 from "../template/components/Step1";
import Step2 from "../template/components/Step2";
import Step3 from "../template/components/Step3";
import Step4 from "../template/components/Step4";
import Step5 from "../template/components/Step5";
import Step6 from "../template/components/Step6";
import Step7 from "../template/components/Step7";
import Step8 from "../template/components/Step8";
import Step9 from "../template/components/Step9";
import Step10 from "../template/components/Step10";

import Cabecalho1 from "../template/layout/Cabecalho1";
import Cabecalho2 from "../template/layout/Cabecalho2";
import Cabecalho3 from "../template/layout/Cabecalho3";
import Cabecalho4 from "../template/layout/Cabecalho4";
import Cabecalho5 from "../template/layout/Cabecalho5";
import Cabecalho6 from "../template/layout/Cabecalho6";
import Cabecalho7 from "../template/layout/Cabecalho7";
import Cabecalho8 from "../template/layout/Cabecalho8";
import Cabecalho9 from "../template/layout/Cabecalho9";
import Cabecalho10 from "../template/layout/Cabecalho10";

import "./CadastroAcomodacoes.css";

const formTemplate = {};
const formBankTemplate = {};

function CadastroAcomodacoes() {
  const [formData, setFormData] = useState(formTemplate);
  const [formBank, setFormBank] = useState(formBankTemplate);
  const { loading, error, success, handleSubmit } = useCadastroAcomodacoes();
  const navigate = useNavigate();
  const location = useLocation();
  const isNovaAcomodacao = location.pathname === "/acomodacoes/nova";

  useEffect(() => {
    console.log("FormData atualizado:", formData);
    console.log("FormBank atualizado:", formBank);
  }, [formData]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

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

  const updateFieldBankHandler = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormBank((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      setFormBank((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const formCabecalhos = [
    <Cabecalho1 />,
    <Cabecalho2 />,
    <Cabecalho3 />,
    <Cabecalho4 />,
    <Cabecalho5 />,
    <Cabecalho6 />,
    <Cabecalho7 />,
    <Cabecalho8 />,
    <Cabecalho9 />,
    <Cabecalho10 />,
  ];

  const formComponents = [
    <Step1 />,
    <Step2 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step3 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step4 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step5 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step6 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step7 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step8 data={formData} updateFieldHandler={updateFieldHandler} />,
    <Step9
      data={formData}
      bank={formBank}
      updateFieldHandler={updateFieldHandler}
      updateFieldBankHandler={updateFieldBankHandler}
    />,
    <Step10 loading={loading} success={success} error={error} />,
  ];

  const {
    currentStep,
    currentCabecalho,
    currentComponent,
    changeStep,
    isLastStep,
  } = useForm(formCabecalhos, formComponents);

  const formRef = useRef();

  const handleExternalSubmit = () => {
    formRef.current.requestSubmit();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isLastStep) {
      formData.creator = localStorage.id_user;
      handleSubmit(formData);
    } else {
      changeStep(currentStep + 1);
    }
  };

  const handleExit = (e) => {
    e.preventDefault();
    navigate("/hospedar");
  };

  return (
    <>
      <form
        ref={formRef}
        className="description-form"
        onSubmit={handleFormSubmit}
        encType="multipart/form-data"
        onKeyDown={handleKeyDown}
      >
        <div>
          <>{currentCabecalho}</>
          <>{currentComponent}</>
          <div>
            {currentStep === 0 && (
              <button
                className="avancar-button"
                onClick={() => {
                  changeStep(currentStep + 1);
                  navigate("/acomodacoes/nova");
                }}
              >
                Vamos lá!
              </button>
            )}
          </div>
        </div>
      </form>
      {isNovaAcomodacao && (
        <div
          className={` ${
            currentStep >= 2
              ? "barra-navegacao-cadastro-acomodacao"
              : "barra-navegacao-cadastro-acomodacao-end"
          }`}
        >
          <div>
            {currentStep >= 2 && (
              <div>
                <button
                  className="voltar-button"
                  onClick={() => changeStep(currentStep - 1)}
                >
                  Retornar
                </button>
              </div>
            )}
            {currentStep !== 9 && (
              <div>
                <button
                  className="avancar-button"
                  onClick={() => changeStep(currentStep + 1)}
                >
                  Próximo
                </button>
              </div>
            )}
            {isLastStep && (
              <div>
                <button
                  className="finalizar-button"
                  onClick={!success ? handleExternalSubmit : handleExit}
                >
                  {`${!success ? "Finalizar" : "Sair"}`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CadastroAcomodacoes;
