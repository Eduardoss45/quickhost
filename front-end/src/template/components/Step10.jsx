import React from "react";
import { Link } from "react-router-dom";
import "./css/Step10.css";

const Step10 = ({ loading, success, error }) => {
  console.log(loading, success, error);

  return (
    <div className="step-ten">
      {loading && <h2>Carregando...</h2>}
      {!loading &&
        !error &&
        (success ? (
          <>
            <h2>Sucesso!</h2>
            <p>
              Seu anúncio foi publicado com sucesso. Agora ele está disponível
              para locação no nosso sistema.
            </p>
            <Link to="/">
              <button className="finalizar-button">Sair</button>
            </Link>
          </>
        ) : (
          <>
            <h2>Quase lá!</h2>
            <p>
              Seu anúncio está prestes a ser publicado. Certifique-se de que não
              há falta de informações obrigatórias.
            </p>
          </>
        ))}
      {!loading && error && (
        <>
          <h2>Erro!</h2>
          <p>
            Antes de publicar, verifique os dados da locação e tente novamente.
          </p>
          <strong>{error}</strong>
        </>
      )}
    </div>
  );
};

export default Step10;
