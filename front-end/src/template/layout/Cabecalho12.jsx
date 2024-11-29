import React from "react";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./css/Cabecalho12.css";

const Cabecalho12 = ({ name }) => {
  return (
    <div className="cabecalho-12">
      <Link to="/hospedar">
        <PiArrowCircleLeftThin />
      </Link>
      <div>
        <h2>Editar endereço</h2>
        <p>{name || "Não informado"}</p>
      </div>
    </div>
  );
};

export default Cabecalho12;
