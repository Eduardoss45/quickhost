import "./Detalhes.css";

const Detalhes = ({
  image,
  status,
  name,
  description,
  price,
  category,
  onClick,
}) => {

  return (
    <div className="anuncio" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="img-anuncio">
        <img
          src={`${import.meta.env.VITE_BASE_URL}${image}`}
          alt="Imagem da acomodação"
        />
        <span>Status: {status ? "Disponível" : "Indisponível"}</span>
      </div>
      <p>
        <strong>{name}</strong>
      </p>
      <p>{description}</p>
      <p>Categoria: {category}</p>
      <p>
        <strong>R${price}</strong> por hóspede
      </p>
    </div>
  );
};

export default Detalhes;
