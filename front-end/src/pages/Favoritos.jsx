import "./Favoritos.css";
import CardFavoritos from "../components/CardFavoritos";
import useFavorite from "../hooks/useFavorite";

const Favoritos = () => {
  const { allFavorites } = useFavorite();

  const favoriteAccommodations = allFavorites
    ?.filter((item) => item.user_favorite_property === localStorage.id_user)
    .map((item) => item.accommodation);

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
