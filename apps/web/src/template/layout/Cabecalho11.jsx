import React from "react";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./css/Cabecalho11.css";

const Cabecalho11 = ({ name }) => {
  return (
    <div className="cabecalho-11">
      <Link to="/hospedar">
        <PiArrowCircleLeftThin />
      </Link>
      <div>
        <h2>Editar anúncio</h2>
        <p>{name || "Não informado"}</p>
      </div>
    </div>
  );
};

export default Cabecalho11;
