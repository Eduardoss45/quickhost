import "./Detalhes.css";

const Detalhes = ({ image, status, name, description, price, category }) => {
  return (
    <div className="anuncio">
      <div className="img-anuncio">
        <img src={image[1]} alt="Imagem da acomodação" />
        <span>Status: {status ? "Disponível" : "Indisponível"}</span>
      </div>
      <p>
        <strong>{name}</strong>
      </p>
      <p>{description}</p>
      <p>{category}</p>
      <p>
        <strong>R${price}</strong> Preço por hospede
      </p>
    </div>
  );
};

export default Detalhes;
