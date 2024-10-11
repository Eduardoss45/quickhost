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
    const files = e.dataTransfer.files; // Mantém como FileList
    processFiles(files);
  };

  const handleFileChange = (e) => {
    const files = e.target.files; // Mantém como FileList
    processFiles(files);
  };

  const processFiles = (files) => {
    // Passa os arquivos diretamente para o updateFieldHandler
    if (typeof updateFieldHandler === "function") {
      console.log(files);
      updateFieldHandler({
        target: {
          name: "internal_images",
          value: files, // Passa o FileList diretamente
        },
      });
    }

    // Cria um array para exibir as prévias das imagens
    createImagePreviewArray(files);
  };

  const createImagePreviewArray = (files) => {
    const newPhotos = []; // Array para armazenar as imagens para exibição
    for (let i = 0; i < files.length; i++) {
      newPhotos.push(files[i]);
    }
    setPhotos((prevPhotos) => {
      // Revogando URLs antigas para liberar memória
      prevPhotos.forEach((photo) => URL.revokeObjectURL(photo));
      return [...prevPhotos, ...newPhotos]; // Atualiza o estado com os novos arquivos
    });
  };

  // Limpeza de objetos URL ao desmontar o componente
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
            accept="image/*" // Permite apenas arquivos de imagem
            disabled={photos.length >= 5} // Desabilita se já tiver 5 fotos
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
              <li key={index}>
                <img
                  src={URL.createObjectURL(photo)} // Usando `photo` diretamente para prévia
                  alt={photo.name} // O nome está diretamente acessível a partir do objeto File
                  style={{ width: "100px", height: "auto" }}
                />
                {photo.name} {/* Exibe o nome do arquivo */}
              </li>
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
