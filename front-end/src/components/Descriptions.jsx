import "./Descriptions.css";

const Descriptions = () => {
  return (
    <div id="description-box">
      <h1>Anuncie com facilidade com a App Host</h1>
      <div>
        <div className="regras">
          <h2>1-Descreva sua acomodação</h2>
          <p>Forneça informações básicas sobre sua acomodação.</p>
          <div className="line"></div>
        </div>
        <div className="regras">
          <h2>2-Adicione destaques</h2>
          <p>
            Adicione elementos para se destacar entre as outras acomodações.
          </p>
          <div className="line"></div>
        </div>
        <div className="regras">
          <h2>3-Conclua e publique</h2>
          <p>Defina um preço inicial e publique seu anúncio.</p>
        </div>
      </div>
    </div>
  );
};

export default Descriptions;