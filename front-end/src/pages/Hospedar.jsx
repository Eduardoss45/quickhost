import React from "react";
import { Link } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import "./Hospedar.css";
import CardHospedagens from "../components/CardHospedagens";

const Hospedar = () => {
  return (
    <div className="pagina-hospedar">
      <div className="menu-hospedar">
        <h2>Hospedar</h2>
        <div>
          <Link to="/acomodacoes">
            <button>
              <span>
                <IoAdd />
              </span>
              Criar Hospedagem
            </button>
          </Link>
        </div>
      </div>
      <div className="hospedar-texto-alternativo">
        <p>
          Parece que você não tem nenhum anúncio ativo... Clique em “Criar
          Hospedagem” para anunciar
        </p>
      </div>
      <div>
        <CardHospedagens />
      </div>
    </div>
  );
};

export default Hospedar;
