import { CiLocationOn } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { LiaPenSolid } from 'react-icons/lia';
import { Link } from 'react-router-dom';
import useDetalhes from '../hooks/useDetalhes.jsx';

import './css/CardHospedagens.css';

const CardHospedagens = ({ accommodationData }) => {
  const { userData } = useDetalhes(accommodationData?.creator);

  return (
    <div className="card-hospedagem" id={accommodationData?.id_accommodation}>
      <img
        src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData?.main_cover_image}`}
        alt={accommodationData?.title || 'Imagem da acomodação'}
      />
      <div className="card-hospedagem-content">
        <h2>{accommodationData?.title}</h2>
        <p>{userData?.username || 'Nome do Criador Indisponível'}</p>
        <p>
          <strong>R$ {accommodationData?.price}</strong> por noite
        </p>
      </div>
      <div className="card-hospedagem-linha"></div>
      <div className="card-hospedagem-location">
        <span>
          <CiLocationOn />
        </span>
        <span>{accommodationData?.city || 'Cidade Indisponível'}</span>
      </div>
      <div className="card-hospedagem-linha"></div>
      <div className="card-hospedagem-ver">
        <Link to={`/hospedar/${accommodationData?.id_accommodation}`}>
          <button>
            <span>
              <IoEyeOutline />
            </span>
            Ver informações
          </button>
        </Link>
      </div>
      <div className="card-hospedagem-editar">
        <Link to={`/editor/${accommodationData?.id_accommodation}`}>
          <button>
            <span>
              <LiaPenSolid />
            </span>
            Editar Anúncio
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CardHospedagens;
