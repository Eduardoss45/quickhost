import React, { useState } from "react";
import { FaCamera } from "react-icons/fa";
import "./Step6.css";

const Step6 = ({ updateFieldHandler }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [photos, setPhotos] = useState([]);

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
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      setPhotos((prevPhotos) => {
        const newPhotos = [
          ...prevPhotos,
          ...imageFiles.map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
          })),
        ];

        // Chamada com verificação para evitar erros
        if (typeof updateFieldHandler === "function") {
          updateFieldHandler({
            target: { name: "internal_images", value: newPhotos },
          });
        }

        return newPhotos;
      });
    }
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
      {photos.length > 0 && (
        <div className="uploaded-photos">
          <h3>Fotos adicionadas:</h3>
          <ul>
            {photos.map((photo, index) => (
              <li key={index}>{photo.name}</li>
            ))}
          </ul>
        </div>
      )}
      {photos.length < 5 && (
        <p style={{ color: "red" }}>
          Você precisa adicionar pelo menos 5 fotos para prosseguir.
        </p>
      )}
    </div>
  );
};

export default Step6;
