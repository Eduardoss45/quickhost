import { useState, useEffect } from "react";
import axios from "axios";

const useFavorite = (initialFavorite, accommodation) => {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  // Função para verificar se a acomodação já é favorita
  const checkFavorite = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FAVORITE_URL}`,
        {
          params: { accommodation: accommodation },
        }
      );
      // Definimos o estado inicial com base na resposta da requisição
      setIsFavorite(response.data.favorite || false);
    } catch (error) {
      console.error("Erro ao verificar favorito", error);
      setIsFavorite(false); // Em caso de erro, tratamos como não favorito
    }
  };

  // Função que alterna o estado de favorito
  const toggleFavorite = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${
          import.meta.env.VITE_SET_FAVORITE_URL
        }`,
        {
          favorite: !isFavorite, // Alterna o estado de favorito
          accommodation: accommodation,
        }
      );
      setIsFavorite(!isFavorite); // Atualiza o estado local para refletir a mudança
    } catch (error) {
      console.error("Erro ao alterar favorito", error);
    }
  };

  // Verificar o favorito na primeira renderização ou quando a acomodação mudar
  useEffect(() => {
    checkFavorite();
  }, [accommodation]); // Se 'accommodation' mudar, re-verifica

  return {
    isFavorite,
    toggleFavorite,
  };
};

export default useFavorite;
