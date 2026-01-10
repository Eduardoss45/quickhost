import React from 'react';
import useDetalhes from '../hooks/useDetalhes.jsx';
import { IoStarSharp } from 'react-icons/io5';

const Avaliacao = ({ comentario }) => {
  const { userData } = useDetalhes(comentario?.user_comment || null);

  return (
    <div>
      <div>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${userData?.profile_picture || ''}`}
          alt={`Foto de perfil de ${userData?.username || 'Nome indisponivel'}`}
        />
        <div>
          <h4>{userData?.username || 'Nome indisponivel'}</h4>
          <div>
            <div>
              {[...Array(5)].map((_, index) => (
                <IoStarSharp
                  key={index}
                  
                />
              ))}
            </div>
            <p>{new Date(comentario.created_at).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
      <p>{comentario.comment}</p>
    </div>
  );
};

const AvaliacoesList = ({ comentarios }) => {
  if (!Array.isArray(comentarios) || comentarios.length === 0) {
    return <p>Nenhuma avaliação disponível.</p>;
  }

  return (
    <div>
      {comentarios.map(comentario => (
        <Avaliacao key={comentario.id_review} comentario={comentario} />
      ))}
    </div>
  );
};

export default AvaliacoesList;
