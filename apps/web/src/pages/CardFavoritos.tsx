import { CiLocationOn } from 'react-icons/ci';
import useDetalhes from '../hooks/useDetalhes.jsx';
import useAccommodation from '../hooks/useAccommodation.js';
import useFavorite from '../hooks/useFavorite.js';
import { PiTrashSimple } from 'react-icons/pi';

CardFavoritos.css';

const CardFavoritos = ({ dados }) => {
  const { accommodationData } = useAccommodation(dados);
  const creatorData = useDetalhes(accommodationData?.creator) || null;
  const { userData: name } = creatorData || {};
  const { isFavorite, toggleFavorite } = useFavorite(dados);
  const handleFavoriteClick = () => {
    toggleFavorite();
    window.location.reload();
  };

  const imageUrl =
    `${import.meta.env.VITE_API_BASE_URL}${accommodationData?.main_cover_image}` || null;

  return (
    <div >
      <img src={imageUrl} alt={accommodationData?.title || 'Imagem da acomodação'} />
      <div >
        <h2>{accommodationData?.title}</h2>
        <p>{name?.username || 'Nome do Criador Indisponível'}</p>
        <p>
          <strong>R$ {accommodationData?.price}</strong> por noite
        </p>
      </div>
      <div ></div>
      <div >
        <span>
          <CiLocationOn />
        </span>
        <span>{accommodationData?.city || 'Cidade Indisponível'}</span>
      </div>
      <div ></div>
      <div >
        <button onClick={handleFavoriteClick}>
          <span>
            <PiTrashSimple />
          </span>
          Remover
        </button>
      </div>
    </div>
  );
};

export default CardFavoritos;
