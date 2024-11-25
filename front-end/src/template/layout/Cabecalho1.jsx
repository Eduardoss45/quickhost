import React from "react";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./css/Cabecalho1.css";

const Cabecalho1 = () => {
  return (
    <div className="cabecalho-1">
      <Link to="/hospedar">
        <PiArrowCircleLeftThin />
      </Link>
      <h2>Anuncie com facilidade no Quick Host</h2>
    </div>
  );
};

export default Cabecalho1;
