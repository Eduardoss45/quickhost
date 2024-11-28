import { CiLocationOn } from "react-icons/ci";
import useDetalhes from "../hooks/useDetalhes.jsx";
import useAccommodation from "../hooks/useAccommodation.jsx";
import useFavorite from "../hooks/useFavorite.jsx";
import { PiTrashSimple } from "react-icons/pi";

import "./CardFavoritos.css";

const CardFavoritos = ({ dados }) => {
  console.log(dados);
  const { accommodationData } = useAccommodation(dados);
  console.log(accommodationData);
  const creatorData = useDetalhes(accommodationData?.creator) || null;
  const { userData: name } = creatorData || {};
  const { isFavorite, toggleFavorite } = useFavorite(dados); // Remove local state for isFavorite
  const handleFavoriteClick = () => {
    toggleFavorite(); // Just toggle favorite via hook
    window.location.reload();
  };

  const imageUrl =
    `${import.meta.env.VITE_BASE_URL}${accommodationData?.main_cover_image}` ||
    null;

  return (
    <div className="card-favoritos">
      <img
        src={imageUrl}
        alt={accommodationData?.title || "Imagem da acomodação"}
      />
      <div className="card-favoritos-content">
        <h2>{accommodationData?.title}</h2>
        <p>{name?.username || "Nome do Criador Indisponível"}</p>
        <p>
          <strong>R$ {accommodationData?.final_price}</strong> por noite
        </p>
      </div>
      <div className="card-favoritos-linha"></div>
      <div className="card-favoritos-location">
        <span>
          <CiLocationOn />
        </span>
        <span>{accommodationData?.city || "Cidade Indisponível"}</span>
      </div>
      <div className="card-favoritos-linha"></div>
      <div className="card-favoritos-remover">
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
