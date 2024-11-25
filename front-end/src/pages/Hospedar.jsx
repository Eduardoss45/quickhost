import React from "react";
import { Link } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import CardHospedagens from "../components/CardHospedagens";
import useAccommodation from "../hooks/useAccommodation";
import "./Hospedar.css";

const Hospedar = ({ accommodationData }) => {
  const listItems = accommodationData?.map((item) => useAccommodation(item));
  console.log(accommodationData);
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
      {listItems?.length > 0 ? (
        <div className="hospedar-items">
          {listItems.map((item) => (
            <CardHospedagens
              accommodationData={item?.accommodationData || null}
            />
          ))}
        </div>
      ) : (
        <div className="hospedar-texto-alternativo">
          <p>
            Parece que você não tem nenhum anúncio ativo... Clique em “Criar
            Hospedagem” para anunciar
          </p>
        </div>
      )}
    </div>
  );
};

export default Hospedar;
