import React, { useState } from "react";
import "./Step7.css";

const Step7 = ({ updateFieldHandler }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  return (
    <div id="step-seven">
      <h2>Hora de adicionar um título à sua acomodação</h2>
      <div id="step-seven-title">
        <input
          type="text"
          placeholder="Digite aqui seu título"
          value={title}
          onChange={handleTitleChange}
        />
        <span className="cont-letras">{title.length}/32</span>
      </div>
      <h2>Crie sua descrição</h2>
      <div id="step-seven-description">
        <textarea
          placeholder="Digite aqui sua descrição"
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>
        <span className="cont-letras">{description.length}/400</span>
      </div>
      <p>Você poderá fazer alterações depois.</p>
    </div>
  );
};

export default Step7;
