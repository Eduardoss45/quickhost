import React, { useState } from "react";
import "./css/Step7.css";

const Step7 = ({ updateFieldHandler }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [consecutiveDaysLimit, setConsecutiveDaysLimit] = useState("1"); // Estado para o limite

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateFieldHandler({
      target: { name: "title", value: newTitle },
    });
  };

  const handleDescriptionChange = (e) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateFieldHandler({
      target: { name: "description", value: newDescription },
    });
  };

  const handleDaysLimitChange = (e) => {
    const selectedValue = e.target.value;
    const newLimit =
      selectedValue === "indeterminado" ? -1 : parseInt(selectedValue, 10);
    setConsecutiveDaysLimit(selectedValue);
    updateFieldHandler({
      target: { name: "consecutive_days_limit", value: newLimit },
    });
  };

  return (
    <div className="step-seven">
      <h2>Descreva sua acomodação</h2>

      <h3>Título</h3>
      <div className="step-seven-title">
        <input
          type="text"
          placeholder="Digite o nome da acomodação"
          value={title}
          onChange={handleTitleChange}
        />
        <span className="cont-letras">{title.length}/32</span>
      </div>

      <h3>Descrição</h3>
      <div className="step-seven-description">
        <textarea
          placeholder="Digite aqui sua descrição"
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>
        <span className="cont-letras">{description.length}/400</span>
      </div>

      <h3>Indique o número máximo de dias consecutivos em uma reserva</h3>
      <div>
        <select value={consecutiveDaysLimit} onChange={handleDaysLimitChange}>
          {[...Array(10).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              {num + 1}
            </option>
          ))}
          <option value="indeterminado">Indeterminado</option>
        </select>
      </div>
    </div>
  );
};

export default Step7;