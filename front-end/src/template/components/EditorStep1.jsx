import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CiCamera } from "react-icons/ci";
import { FiImage } from "react-icons/fi";
import "./css/EditorStep1.css";

const Step6And7 = ({ updateFieldHandler }) => {
  const [photos, setPhotos] = useState([]);
  const [mainCoverImageIndex, setMainCoverImageIndex] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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
    setPhotos([]);
    if (typeof updateFieldHandler === "function") {
      updateFieldHandler({
        target: {
          name: "internal_images",
          value: [],
        },
        target: {
          name: "main_cover_image",
          value: undefined,
        },
      });
    }
  };

  const handleImageClick = (index) => {
    setMainCoverImageIndex(index);
    if (typeof updateFieldHandler === "function") {
      updateFieldHandler({
        target: {
          name: "main_cover_image",
          value: index,
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
    <div className="editor-step1">
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
              <FiImage size={24} color="#f97316" className="image-icon" />
              <img
                src={photo.preview}
                alt={`Preview ${index + 1}`}
                onClick={() => handleImageClick(index)}
                style={{
                  border:
                    mainCoverImageIndex === index
                      ? "3px solid #f97316"
                      : "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={clearPhotos}
        disabled={photos.length === 0}
        className="editor-step1-button"
      >
        Limpar Imagens
      </button>
      <h3>Nome da Acomodação</h3>
      <div className="editor-step1-title">
        <input
          type="text"
          placeholder="Digite o nome da acomodação"
          value={title}
          onChange={handleTitleChange}
        />
        <span className="cont-letras">{title.length}/32</span>
      </div>
      <h3>Descrição da Acomodação</h3>
      <div className="editor-step1-description">
        <textarea
          placeholder="Digite aqui sua descrição"
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>
        <span className="cont-letras">{description.length}/400</span>
      </div>
    </div>
  );
};

export default Step6And7;