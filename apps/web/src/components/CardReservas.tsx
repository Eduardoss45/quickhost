import React from "react";
import { IoEyeOutline, IoChatbubbleOutline } from "react-icons/io5";
import { PiPhoneThin, PiTrashSimple } from "react-icons/pi";
import { CiLocationOn, CiUser } from "react-icons/ci";
import useDetalhes from "../hooks/useDetalhes";
import useAccommodation from "../hooks/useAccommodation";
import { Link } from "react-router-dom";
import './css/CardReservas.css';

const CardReservas = ({ userName, reserva }) => {
  const { userData } = useDetalhes(reserva);
  const { accommodationData } = useAccommodation(userData?.accommodation);
  const { userData: dados } = useDetalhes(accommodationData?.creator);
  return (
    <div className="card">
      <div className="image-container">
        <img
          src={`${import.meta.env.VITE_BASE_URL}${
            accommodationData?.internal_images[0]
          }`}
          alt="Vista da acomodação"
          className="image"
        />
      </div>
      <div>
        <div className="details-container">
          <div>
            <div className="title-container">
              <h2 className="title">{accommodationData?.title}</h2>
              <p className="host">
                {dados?.username || "Anfitrião Desconhecido"}
              </p>
            </div>
            <div className="dates-container">
              <div className="date-item">
                <span>Check-in</span>
                <p>{userData?.check_in_date || "Data não disponível"}</p>
              </div>
              <div className="date-item">
                <span>Check-out</span>
                <p>{userData?.check_out_date || "Data não disponível"}</p>
              </div>
            </div>
          </div>
          <div className="card-reservas-line"></div>
          <div>
            <div>
              <span>
                <CiLocationOn className="icon" />
              </span>
              <p className="info">
                Endereço:{" "}
                {accommodationData?.address || "Endereço não disponível"}
              </p>
            </div>
            <div>
              <span>
                <PiPhoneThin className="icon" />
              </span>
              <p className="info">
                Telefone: {dados?.phone_number || "Telefone não disponível"}
              </p>
            </div>
            <div>
              <span>
                <CiUser className="icon" />
              </span>
              <p className="info">
                Hóspede: {userName || "Nome do hóspede não disponível"}
              </p>
            </div>
          </div>
          <div className="card-reservas-line"></div>
        </div>
        <div className="action-container">
          <div className="button-group">
            <Link
              to={`/acomodacao/${accommodationData?.id_accommodation}`}
              className="primary-button"
            >
              <IoEyeOutline /> Ver anúncio
            </Link>
            <button className="primary-button">
              <IoChatbubbleOutline />
              Mandar mensagem
            </button>
            <Link to={`/reservas/${reserva}`} className="secondary-button">
              <PiTrashSimple />
              Cancelar hospedagem
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardReservas;
