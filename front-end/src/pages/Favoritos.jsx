import "./Favoritos.css";
import CardFavoritos from "../components/CardFavoritos";
import useFavorite from "../hooks/useFavorite";

const Favoritos = () => {
  const { allFavorites } = useFavorite();

  // Filtra os favoritos do usuário e obtém os IDs das acomodações
  const favoriteAccommodations = allFavorites
    ?.filter((item) => item.user_favorite_property === localStorage.id_user) // Filtra pelo ID do usuário
    .map((item) => item.accommodation); // Obtém apenas o ID da acomodação

  console.log("Acomodações favoritas:", favoriteAccommodations);
  return (
    <div className="pagina-favoritos">
      <h2>Favoritos</h2>
      <div>
        {favoriteAccommodations.length > 0 ? (
          favoriteAccommodations.map((item) => (
            <CardFavoritos key={item} dados={item} />
          ))
        ) : (
          <p>Você não possui acomodações favoritas!</p>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
