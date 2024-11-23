import "./Favoritos.css";
import CardFavoritos from "../components/CardFavoritos";

const Favoritos = () => {
  return (
    <div className="pagina-favoritos">
      <h2>Favoritos</h2>
      <div>
        <CardFavoritos />
      </div>
    </div>
  );
};

export default Favoritos;
