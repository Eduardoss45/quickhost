import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CiCamera } from 'react-icons/ci';
import { FiImage } from 'react-icons/fi';

const EditorStep1 = ({ data, updateFieldHandler, accommodationData }) => {
  const [photos, setPhotos] = useState([]);
  const [mainCoverImageIndex, setMainCoverImageIndex] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Carregar imagens existentes e configurar valores iniciais
  useEffect(() => {
    if (accommodationData?.internal_images?.length > 0) {
      const imagesWithPreview = accommodationData.internal_images.map(imageUrl => ({
        url: imageUrl,
        preview: imageUrl, // Usar o próprio URL como preview
      }));
      setPhotos(imagesWithPreview);

      // Configurar a imagem de capa principal, se disponível
      if (accommodationData.main_cover_image) {
        setMainCoverImageIndex(
          accommodationData.internal_images.findIndex(
            image => image === accommodationData.main_cover_image
          )
        );
      }
    }

    // Configurar título e descrição
    if (accommodationData?.title) setTitle(accommodationData.title);
    if (accommodationData?.description) setDescription(accommodationData.description);
  }, [accommodationData]);

  const onDrop = acceptedFiles => {
    if (photos.length + acceptedFiles.length <= 20) {
      processFiles(acceptedFiles);
    }
  };

  const processFiles = files => {
    if (typeof updateFieldHandler === 'function') {
      updateFieldHandler({
        target: {
          name: 'internal_images',
          value: files,
        },
      });
    }
    createImagePreviewArray(files);
  };

  const createImagePreviewArray = files => {
    const newPhotos = files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    setPhotos(prevPhotos => {
      prevPhotos.forEach(photo => URL.revokeObjectURL(photo.preview));
      return [...prevPhotos, ...newPhotos];
    });
  };

  const clearPhotos = () => {
    setPhotos([]);
    if (typeof updateFieldHandler === 'function') {
      updateFieldHandler({
        target: {
          name: 'internal_images',
          value: [],
        },
      });
      updateFieldHandler({
        target: {
          name: 'main_cover_image',
          value: undefined,
        },
      });
    }
  };

  const handleImageClick = index => {
    setMainCoverImageIndex(index);
    if (typeof updateFieldHandler === 'function') {
      updateFieldHandler({
        target: {
          name: 'main_cover_image',
          value: index,
        },
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
    disabled: photos.length >= 20,
  });

  const handleTitleChange = e => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    updateFieldHandler({
      target: { name: 'title', value: newTitle },
    });
  };

  const handleDescriptionChange = e => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    updateFieldHandler({
      target: { name: 'description', value: newDescription },
    });
  };

  return (
    <div>
      <h2>Adicione fotos de sua acomodação (mínimo 5 imagens)</h2>
      <p>Você pode selecionar mais imagens posteriormente</p>
      <h3>Selecione imagens</h3>
      <div
        {...getRootProps()}
        
      >
        <p>Selecione uma foto do seu computador ou arraste e solte uma sobre esta área.</p>
        <CiCamera size={70} />
        <input {...getInputProps()} />
        <span>{isDragActive ? 'Solte as imagens aqui...' : 'Selecionar do Computador'}</span>
      </div>

      {photos.length < 5 ? (
        <p style={{ color: 'red' }}>Você precisa adicionar pelo menos 5 fotos para prosseguir.</p>
      ) : (
        <>
          <p>{photos.length}/20</p>
          <h2>Escolha uma para exibição como capa principal no site.</h2>
        </>
      )}

      <div >
        <h3>Imagens escolhidas</h3>
        <div>
          {photos.map((photo, index) => (
            <div key={index} >
              <FiImage size={24} color="#f97316"  />
              <img
                src={photo.url ? `${import.meta.env.VITE_API_BASE_URL}${photo.url}` : photo.preview}
                alt={`Preview ${index + 1}`}
                onClick={() => handleImageClick(index)}
                style={{
                  border: mainCoverImageIndex === index ? '3px solid #f97316' : 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={clearPhotos} disabled={photos.length === 0} >
        Limpar Imagens
      </button>

      <h3>Nome da Acomodação</h3>
      <div>
        <input
          type="text"
          placeholder="Digite o nome da acomodação"
          value={title}
          onChange={handleTitleChange}
        />
        <span>{title.length}/32</span>
      </div>

      <h3>Descrição da Acomodação</h3>
      <div >
        <textarea
          placeholder="Digite aqui sua descrição"
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>
        <span>{description.length}/400</span>
      </div>
    </div>
  );
};

export default EditorStep1;
