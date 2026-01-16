import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CiCamera } from 'react-icons/ci';
import { FiImage } from 'react-icons/fi';

const Step6 = ({ data, updateFieldHandler }) => {
  const [photos, setPhotos] = useState([]);
  const [mainCoverImageIndex, setMainCoverImageIndex] = useState(null);

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

  useEffect(() => {
    // Verificando se existe internal_images em data e carregando as imagens
    if (data?.internal_images?.length) {
      const imagesWithPreview = data.internal_images.map(image => ({
        ...image,
        preview: image.preview || URL.createObjectURL(image), // Carregar o preview caso não exista
      }));
      setPhotos(imagesWithPreview);

      // Verificando se main_cover_image está presente e definindo a imagem principal
      if (data.main_cover_image !== undefined) {
        setMainCoverImageIndex(data.main_cover_image);
      }
    }
  }, [data]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
    disabled: photos.length >= 20,
  });

  return (
    <div>
      <h2>Adicione fotos de sua acomodação (min. 5 imagens)</h2>
      <p>Você pode selecionar mais imagens posteriormente</p>
      <h3>Selecione imagens</h3>
      <div {...getRootProps()}>
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

      <div>
        <h3>Imagens escolhidas</h3>
        <div>
          {photos.map((photo, index) => (
            <div key={index}>
              <FiImage size={24} color="#f97316" />
              <img
                src={photo.preview}
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

      <button onClick={clearPhotos} disabled={photos.length === 0}>
        Limpar Imagens
      </button>
    </div>
  );
};

export default Step6;
