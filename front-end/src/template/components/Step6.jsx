import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CiCamera } from "react-icons/ci";
import { FiImage } from "react-icons/fi";
import "./css/Step6.css";

const Step6 = ({ updateFieldHandler }) => {
  const [photos, setPhotos] = useState([]);
  const [mainCoverImageIndex, setMainCoverImageIndex] = useState(null); // Armazenar o índice da imagem principal

  const onDrop = (acceptedFiles) => {
    if (photos.length + acceptedFiles.length <= 20) {
      processFiles(acceptedFiles);
    }
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
    const newPhotos = files.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setPhotos((prevPhotos) => {
      prevPhotos.forEach((photo) => URL.revokeObjectURL(photo.preview));
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
        target: {
          name: "main_cover_image",
          value: undefined, // Envia o índice como o valor para a chave main_cover_image
        },
      });
    }
  };

  const handleImageClick = (index) => {
    setMainCoverImageIndex(index); // Atualiza o índice da imagem principal
    if (typeof updateFieldHandler === "function") {
      updateFieldHandler({
        target: {
          name: "main_cover_image",
          value: index, // Envia o índice como o valor para a chave main_cover_image
        },
      });
    }
  };

  useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
    };
  }, [photos]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: true,
    disabled: photos.length >= 20,
  });

  return (
    <div className="step-six">
      <h2>Adicione fotos de sua acomodação (min. 5 imagens)</h2>
      <p>Você pode selecionar mais imagens posteriormente</p>
      <h3>Selecione imagens</h3>
      <div
        {...getRootProps()}
        className={`box photo-upload-container ${
          isDragActive ? "dragging" : ""
        }`}
      >
        <p>
          Selecione uma foto do seu computador ou arraste e solte uma sobre esta
          área.
        </p>
        <CiCamera size={70} />
        <input {...getInputProps()} />
        <span>
          {isDragActive
            ? "Solte as imagens aqui..."
            : "Selecionar do Computador"}
        </span>
      </div>

      {photos.length < 5 ? (
        <p style={{ color: "red" }}>
          Você precisa adicionar pelo menos 5 fotos para prosseguir.
        </p>
      ) : (
        <>
          <p>{photos.length}/20</p>
          <h2>Escolha uma para exibição como capa principal no site.</h2>
        </>
      )}

      <div className="preview-section">
        <h3>Imagens escolhidas</h3>
        <div className="image-gallery">
          {photos.map((photo, index) => (
            <div key={index} className="image-container">
              <img
                src={photo.preview}
                alt={`Preview ${index + 1}`}
                onClick={() => handleImageClick(index)} // Ao clicar na imagem, define como a imagem principal
                style={{
                  border:
                    mainCoverImageIndex === index
                      ? "3px solid #f97316"
                      : "none", // Destaca a imagem selecionada
                }}
              />
              <FiImage size={24} color="#f97316" className="image-icon" />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={clearPhotos}
        disabled={photos.length === 0}
        className="step-six-button"
      >
        Limpar Imagens
      </button>
    </div>
  );
};

export default Step6;
