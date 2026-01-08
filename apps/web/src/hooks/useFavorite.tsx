import { useState, useEffect } from 'react';
import axios from 'axios';

const useFavorite = accommodation => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [allFavorites, setAllFavorites] = useState([]);
  const token = localStorage.token;

  const checkFavorite = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_FAVORITE_URL}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = response.data;
      setAllFavorites(data);

      const favorite = data.find(item => item.accommodation === accommodation);

      if (favorite) {
        setIsFavorite(true);
        setFavoriteId(favorite.id_favorite_property);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    } catch (error) {
      console.error('Erro ao verificar favorito', error);
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite();
    } else {
      await addFavorite();
    }
  };

  const addFavorite = async () => {
    try {
      const dataToSend = {
        user_favorite_property: localStorage.id_user,
        accommodation: accommodation,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_FAVORITE_URL}`,
        dataToSend,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorite(true);
      setFavoriteId(response.data.id_favorite_property);
      console.log('Acomodação adicionada aos favoritos', response.data);
      await checkFavorite();
    } catch (error) {
      console.error('Erro ao adicionar favorito', error);
    }
  };

  const removeFavorite = async () => {
    try {
      if (favoriteId) {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_FAVORITE_MANAGER_URL.replace(
            '<uuid:id_favorite_property>',
            favoriteId
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavorite(false);
        setFavoriteId(null);
        console.log('Acomodação removida dos favoritos');
        await checkFavorite();
      }
    } catch (error) {
      console.error('Erro ao remover favorito', error);
    }
  };

  useEffect(() => {
    checkFavorite();
  }, [accommodation]);

  return {
    isFavorite,
    toggleFavorite,
    allFavorites,
  };
};

export default useFavorite;
