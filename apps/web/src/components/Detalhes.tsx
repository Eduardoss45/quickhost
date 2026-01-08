import { CiLocationOn } from 'react-icons/ci';
import useDetalhes from '../hooks/useDetalhes.jsx';

import './css/Detalhes.css';

const Detalhes = ({ image, title, creator, price_per_night, city, onClick }) => {
  const creatorData = creator ? useDetalhes(creator) : null;
  const { userData: name } = creatorData || {};

  const imageUrl = image
    ? `${import.meta.env.VITE_API_BASE_URL}${image}`
    : 'url-to-default-image.jpg';

  return (
    <div className="anuncio" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div>
        <img src={imageUrl} alt={title || 'Imagem da acomodação'} />
      </div>
      <div>
        <div>
          <h2>{title}</h2>
          <p>{name?.username || 'Nome do Criador Indisponível'}</p>
          <p>
            <strong>R$ {price_per_night}</strong> por noite
          </p>
        </div>
      </div>
      <div className="anuncio-linha"></div>
      <div>
        <span>
          <CiLocationOn />
        </span>
        <span>{city || 'Cidade Indisponível'}</span>
      </div>
    </div>
  );
};

export default Detalhes;
