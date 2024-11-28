import { useState, useEffect } from "react";
import axios from "axios";

const useFavorite = (accommodation) => {
  const [isFavorite, setIsFavorite] = useState(false); // Estado para verificar se é favorito
  const [favoriteId, setFavoriteId] = useState(null); // Para armazenar o id do favorito
  const [allFavorites, setAllFavorites] = useState([]); // Para armazenar todos os favoritos
  const token = localStorage.token;

  // Função para obter todos os favoritos
  const checkFavorite = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FAVORITE_URL}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      setAllFavorites(data); // Armazena todos os favoritos no estado

      // Verifica se a acomodação específica está nos favoritos
      const favorite = data.find(
        (item) => item.accommodation === accommodation
      );

      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id_favorite_property); // Captura o ID do favorito
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error("Erro ao verificar favorito", error);
      setIsFavorite(false); // Em caso de erro, tratamos como não favorito
    }
  };

  // Função para adicionar ou remover favorito
  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite();
    } else {
      await addFavorite();
    }
  };

  // Função para adicionar o favorito
  const addFavorite = async () => {
    try {
      const dataToSend = {
        user_favorite_property: localStorage.id_user, // Substitua aqui pelo ID do usuário
        accommodation: accommodation, // O ID da acomodação
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}${import.meta.env.VITE_FAVORITE_URL}`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorite(true); // Atualiza o estado após a adição do favorito
      setFavoriteId(response.data.id_favorite_property); // Atualiza o ID localmente
      console.log("Acomodação adicionada aos favoritos", response.data);
      await checkFavorite(); // Sincroniza a lista após a alteração
    } catch (error) {
      console.error("Erro ao adicionar favorito", error);
    }
  };

  // Função para remover o favorito
  const removeFavorite = async () => {
    try {
      if (favoriteId) {
        await axios.delete(
          `${
            import.meta.env.VITE_BASE_URL
          }${import.meta.env.VITE_FAVORITE_MANAGER_URL.replace(
            "<uuid:id_favorite_property>",
            favoriteId
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavorite(false); // Atualiza o estado imediatamente após remover
        setFavoriteId(null); // Limpa o ID localmente
        console.log("Acomodação removida dos favoritos");
        await checkFavorite(); // Sincroniza a lista após a alteração
      }
    } catch (error) {
      console.error("Erro ao remover favorito", error);
    }
  };

  useEffect(() => {
    checkFavorite();
  }, [accommodation]); // Re-verifica quando a acomodação mudar

  return {
    isFavorite,
    toggleFavorite, // Função para alternar favorito
    allFavorites, // Retorna todos os favoritos
  };
};

export default useFavorite;
