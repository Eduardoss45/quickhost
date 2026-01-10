import React from "react";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./css/Cabecalho13.css";

const Cabecalho13 = ({ name }) => {
  return (
    <div>
      <Link to="/hospedar">
        <PiArrowCircleLeftThin />
      </Link>
      <div>
        <h2>Editar comodidades</h2>
        <p>{name || "Não informado"}</p>
      </div>
    </div>
  );
};

export default Cabecalho13;
