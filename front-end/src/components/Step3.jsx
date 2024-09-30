// Step3.jsx
import React, { useState, useEffect } from "react";
import { MdBedroomParent } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import "./Step3.css";

const Step3 = ({ data, updateFieldHandler }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(data.type_of_space || null); // Define o estado inicial
  }, [data.type_of_space]);

  const handleSelection = (option) => {
    setSelectedOption(option);
    updateFieldHandler({
      target: { name: "type_of_space", value: option }, // Simula o evento
    });
  };

  return (
    <div id="step-third">
      <h1>Que tipo de espaço você fornecerá ao seu hóspede?</h1>
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
