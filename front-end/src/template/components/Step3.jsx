import React, { useState, useEffect } from "react";
import { MdBedroomParent } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import "./css/Step3.css";

const Step3 = ({ data, updateFieldHandler }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(data.space_type || null);
  }, [data.space_type]);

  const handleSelection = (option) => {
    setSelectedOption(option);
    updateFieldHandler({
      target: { name: "space_type", value: option },
    });
  };

  return (
    <div className="step-third">
      <h2>Selecione o tipo de espaço</h2>
      <div>
        <div
          className={`step-option ${
            selectedOption === "full_space" ? "active" : ""
          }`}
          onClick={() => handleSelection("full_space")}
        >
          <h2>Espaço inteiro</h2>
          <div className="step-third-opt">
            <p>Uma acomodação completa para seus hóspedes</p>
            <span>
              <FaHouse />
            </span>
          </div>
        </div>
        <div
          className={`step-option ${
            selectedOption === "limited_space" ? "active" : ""
          }`}
          onClick={() => handleSelection("limited_space")}
        >
          <h2>Quarto</h2>
          <div className="step-third-opt">
            <p>Direito a um quarto exclusivo e acesso a áreas compartilhadas</p>
            <span>
              <MdBedroomParent />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
