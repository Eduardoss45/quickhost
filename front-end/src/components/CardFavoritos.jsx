import { CiLocationOn } from "react-icons/ci";
import useDetalhes from "../hooks/useDetalhes.jsx";
import { PiTrashSimple } from "react-icons/pi";

import "./CardFavoritos.css";

const CardFavoritos = ({
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
    <div className="card-favoritos" onClick={onClick}>
      <img src={imageUrl} alt={title || "Imagem da acomodação"} />
      <div className="card-favoritos-content">
        <h2>{title}</h2>
        <p>{name?.username || "Nome do Criador Indisponível"}</p>
        <p>
          <strong>R$ {price_per_night}</strong> por noite
        </p>
      </div>
      <div className="card-favoritos-linha"></div>
      <div className="card-favoritos-location">
        <span>
          <CiLocationOn />
        </span>
        <span>{city || "Cidade Indisponível"}</span>
      </div>
      <div className="card-favoritos-linha"></div>
      <div className="card-favoritos-remover">
        <button>
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
