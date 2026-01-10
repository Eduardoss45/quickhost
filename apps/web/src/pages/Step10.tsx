import React from 'react';
import { Link } from 'react-router-dom';
import './css/Step10.css';

const Step10 = ({ loading, success, error }) => {
  const errorOriginalList = [
    'cleaning_fee',
    'consecutive_days_limit',
    'main_cover_image',
    'internal_images',
    'category',
    'room_count',
    'bed_count',
    'bathroom_count',
    'guest_capacity',
    'space_type',
    'address',
    'city',
    'neighborhood',
    'postal_code',
    'uf',
    'wifi',
    'tv',
    'kitchen',
    'washing_machine',
    'parking_included',
    'air_conditioning',
    'pool',
    'jacuzzi',
    'grill',
    'private_gym',
    'beach_access',
    'smoke_detector',
    'fire_extinguisher',
    'first_aid_kit',
    'outdoor_camera',
    'title',
    'description',
    'price_per_night',
  ];

  const translatedErrorList = [
    'Taxa de limpeza',
    'Limite de dias consecutivos',
    'Imagem principal de capa',
    'Imagens internas',
    'Categoria',
    'Quantidade de quartos',
    'Quantidade de camas',
    'Quantidade de banheiros',
    'Capacidade de hóspedes',
    'Tipo de espaço',
    'Endereço',
    'Cidade',
    'Bairro',
    'Código postal',
    'Unidade Federativa (ou estado)',
    'Wifi',
    'Tv',
    'Cozinha',
    'Máquina de lavar',
    'Estacionamento incluído',
    'Ar condicionado',
    'Piscina',
    'Jacuzzi',
    'Churrasqueira',
    'Academia privada',
    'Acesso a praia',
    'Detector de fumaça',
    'Extintor de incêndio',
    'Kit de primeiros socorros',
    'Câmera externa',
    'Título',
    'Descrição',
    'Preço por noite',
  ];

  const translateErrorKey = key => {
    const index = errorOriginalList.indexOf(key);
    return index !== -1 ? translatedErrorList[index] : key;
  };

  return (
    <div>
      {loading && <h2>Carregando...</h2>}
      {!loading &&
        !error &&
        (success ? (
          <>
            <h2>Sucesso!</h2>
            <p>
              Seu anúncio foi publicado com sucesso. Agora ele está disponível para locação no nosso
              sistema.
            </p>
            <Link to="/">
              <button>Sair</button>
            </Link>
          </>
        ) : (
          <>
            <h2>Quase lá!</h2>
            <p>
              Seu anúncio está prestes a ser publicado. Certifique-se de que não há falta de
              informações obrigatórias.
            </p>
          </>
        ))}
      {!loading && error && (
        <>
          <h2>Erro!</h2>
          <p>Antes de publicar, verifique os dados da locação e tente novamente.</p>
        </>
      )}
      {error && (
        <ul>
          {Object.keys(error).map(
            key =>
              Array.isArray(error[key]) &&
              error[key].map((erro, index) => (
                <li key={index}>
                  <strong>{translateErrorKey(key)}</strong>
                  <p>{erro}</p>
                </li>
              ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Step10;
