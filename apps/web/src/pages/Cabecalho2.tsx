import React from "react";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./css/Cabecalho2.css";

const Cabecalho2 = () => {
  return (
    <div>
      <Link to="/hospedar">
        <PiArrowCircleLeftThin />
      </Link>
      <div>
        <h2>Criar uma nova hospedagem</h2>
        <p>Informações básicas</p>
      </div>
    </div>
  );
};

export default Cabecalho2;
