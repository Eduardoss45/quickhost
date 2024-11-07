import React, { useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import "./Step6.css";

const Step6 = ({ updateFieldHandler }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [photos, setPhotos] = useState([]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag Enter");
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag Leave");
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag Over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Files dropped");
    setIsDragging(false);
    const files = e.dataTransfer.files;
    processFiles(files);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    processFiles(files);
  };

  const processFiles = (files) => {
    if (typeof updateFieldHandler === "function") {
      updateFieldHandler({
        target: {
          name: "internal_images",
          value: files,
        },
      });
    }
    createImagePreviewArray(files);
  };

  const createImagePreviewArray = (files) => {
    const newPhotos = [];
    for (let i = 0; i < files.length; i++) {
      newPhotos.push(files[i]);
    }
    setPhotos((prevPhotos) => {
      prevPhotos.forEach((photo) => URL.revokeObjectURL(photo));
      return [...prevPhotos, ...newPhotos];
    });
  };

  const clearPhotos = () => {
    setPhotos([]); // Limpa o estado de fotos
    if (typeof updateFieldHandler === "function") {
      updateFieldHandler({
        target: {
          name: "internal_images",
          value: [],
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo));
    };
  }, [photos]);

  return (
    <div id="step-six">
      <h2>Adicione fotos de sua acomodação</h2>
      <p>Será necessário no mínimo 5 fotos para avançar.</p>
      <div
        className={`box photo-upload-container ${isDragging ? "dragging" : ""}`}
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
            name="internal_images"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            disabled={photos.length >= 20}
          />
          <label htmlFor="file-input">
            <span id="step-six-button">Adicionar fotos</span>
          </label>
        </div>
      </div>
      <p>Você poderá adicionar mais imagens posteriormente.</p>
      {photos.length < 5 ? (
        <p style={{ color: "red" }}>
          Você precisa adicionar pelo menos 5 fotos para prosseguir.
        </p>
      ) : (
        <p>{photos.length}/20</p>
      )}
      <button
        onClick={clearPhotos}
        disabled={photos.length === 0}
        id="step-six-button"
      >
        Limpar Imagens
      </button>
    </div>
  );
};

export default Step6;
