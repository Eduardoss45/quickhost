import React from "react";
import { IoAdd } from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import CardHospedagens from "../components/CardHospedagens";
import useAccommodation from "../hooks/useAccommodation";
import "./Hospedar.css";

const Hospedar = ({ accommodationData }) => {
  const listItems = accommodationData?.map((item) => useAccommodation(item));
  const navigate = useNavigate();
  const handleClick = () => {
    const dadoEspecifico = accommodationData.id_accommodation;
    navigate("/hospedar/", { state: { dadoEspecifico } });
  };
  return (
    <div className="pagina-hospedar">
      <div className="menu-hospedar">
        <h2>Hospedar</h2>
        <div>
          <Link to="/acomodacoes">
            <button onClick={handleClick}>
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
