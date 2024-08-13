import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./Step6.css";

const Step6 = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    console.log(files);
    // Aqui você pode processar os arquivos arrastados
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    console.log(files);
    // Aqui você pode processar os arquivos selecionados
  };

  return (
    <div id="step-six">
      <h2>Adicione fotos de sua acomodação</h2>
      <p>Será necessário no mínimo 5 fotos para avançar.</p>
      <div
        className={`photo-upload-container ${isDragging ? "dragging" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div>
          <span id="step-six-icon">
            <FaCamera />
          </span>
          <input
            type="file"
            id="file-input"
            className="file-input"
            onChange={handleFileChange}
            multiple
          />
          <label htmlFor="file-input">
            <span id="step-six-button">Adicionar fotos</span>
          </label>
        </div>
      </div>
      <p>Você poderá adicionar mais imagens posteriormente.</p>
    </div>
  );
};

export default Step6;
