import React from "react";
import useDetalhes from "../hooks/useDetalhes.jsx";
import { IoStarSharp } from "react-icons/io5";
import './css/Avaliacao.css';

const Avaliacao = ({ comentario }) => {
  const { userData } = useDetalhes(comentario?.user_comment || null);

  return (
    <div className="review-card">
      <div className="review-card-header">
        <img
          src={`${import.meta.env.VITE_BASE_URL}${
            userData?.profile_picture || ""
          }`}
          alt={`Foto de perfil de ${userData?.username || "Nome indisponivel"}`}
          className="profile-image"
        />
        <div>
          <h4 className="name">{userData?.username || "Nome indisponivel"}</h4>
          <div className="rating-date">
            <div className="rating">
              {[...Array(5)].map((_, index) => (
                <IoStarSharp
                  key={index}
                  className={`star ${
                    index < comentario.rating ? "" : "inactive"
                  }`}
                />
              ))}
            </div>
            <p className="date">
              {new Date(comentario.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>
      <p className="review-text">{comentario.comment}</p>
    </div>
  );
};

const AvaliacoesList = ({ comentarios }) => {
  if (!Array.isArray(comentarios) || comentarios.length === 0) {
    return <p className="no-reviews">Nenhuma avaliação disponível.</p>;
  }

  return (
    <div className="reviews-list">
      {comentarios.map((comentario) => (
        <Avaliacao key={comentario.id_review} comentario={comentario} />
      ))}
    </div>
  );
};

export default AvaliacoesList;
