import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { useForm } from "../hooks/useForm";
import { useState } from "react";
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

const formTemplate = {
  name: "",
  emai: "",
  review: "",
  comment: "",
};

function CadastroAcomodacoes() {
  const [data, setData] = useState(formTemplate);

  const updateFiedlHandler = (key, value) => {
    setData((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const formComponents = [
    <Step1 updateFiedlHandler={updateFiedlHandler} />,
    <Step2 data={data} updateFiedlHandler={updateFiedlHandler} />,
    <Step3 data={data} updateFiedlHandler={updateFiedlHandler} />,
    <Step4 data={data} updateFiedlHandler={updateFiedlHandler} />,
    <Step5 data={data} updateFiedlHandler={updateFiedlHandler} />,
    <Step6 data={data} updateFiedlHandler={updateFiedlHandler} />,
    <Step7 data={data} updateFiedlHandler={updateFiedlHandler} />,
    <Step8 data={data} updateFiedlHandler={updateFiedlHandler} />,
    <Step9 data={data} updateFiedlHandler={updateFiedlHandler} />,
  ];

  const { currentStep, currentComponent, changeStep, isLastStep, isFirstStep } =
    useForm(formComponents);

  return (
    <form
      id="description-form"
      onSubmit={(e) => changeStep(currentStep + 1, e)}
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
            <button className="btn-painel">finalizar</button>
          </div>
        )}
      </div>
    </form>
  );
}

export default CadastroAcomodacoes;
