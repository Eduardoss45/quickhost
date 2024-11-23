import { CiLocationOn } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { LiaPenSolid } from "react-icons/lia";
import useDetalhes from "../hooks/useDetalhes.jsx";

import "./CardHospedagens.css";

const CardHospedagens = ({
  image,
  title,
  creator,
  price_per_night,
  city,
  onClick,
}) => {
  const creatorData = creator ? useDetalhes(creator) : null;
  const { userData: name } = creatorData || {};

  const imageUrl = image
    ? `${import.meta.env.VITE_BASE_URL}${image}`
    : "url-to-default-image.jpg";

  return (
    <div className="card-hospedagem" onClick={onClick}>
      <img src={imageUrl} alt={title || "Imagem da acomodação"} />
      <div className="card-hospedagem-content">
        <h2>{title}</h2>
        <p>{name?.username || "Nome do Criador Indisponível"}</p>
        <p>
          <strong>R$ {price_per_night}</strong> por noite
        </p>
      </div>
      <div className="card-hospedagem-linha"></div>
      <div className="card-hospedagem-location">
        <span>
          <CiLocationOn />
        </span>
        <span>{city || "Cidade Indisponível"}</span>
      </div>
      <div className="card-hospedagem-linha"></div>
      <div className="card-hospedagem-ver">
        <button>
          <span>
            <IoEyeOutline />
          </span>
          Ver informações
        </button>
      </div>
      <div className="card-hospedagem-editar">
        <button>
          <span>
            <LiaPenSolid />
          </span>
          Editar Anúncio
        </button>
      </div>
    </div>
  );
};

export default CardHospedagens;
