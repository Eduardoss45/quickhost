import React from "react";
import { IoEyeOutline, IoChatbubbleOutline } from "react-icons/io5";
import { PiPhoneThin, PiTrashSimple } from "react-icons/pi";
import { CiLocationOn, CiUser } from "react-icons/ci";
import "./CardReservas.css";

const CardReservas = () => {
  return (
    <div className="card">
      <div className="image-container">
        <img
          src="path/to/your/image.jpg"
          alt="Vista da acomodação"
          className="image"
        />
      </div>
      <div>
        <div className="details-container">
          <div>
            <div className="title-container">
              <h2 className="title">Nome da Acomodação</h2>
              <p className="host">Nome do Anfitrião</p>
            </div>
            <div className="dates-container">
              <div className="date-item">
                <span>Check-in</span>
                <p>13/09/2024</p>
              </div>
              <div className="date-item">
                <span>Check-out</span>
                <p>16/09/2024</p>
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
                Endereço: Rua das Ruas, 123 - Centro • Cidade, UF • 12345-678
              </p>
            </div>
            <div>
              <span>
                <PiPhoneThin className="icon" />
              </span>
              <p className="info">Telefone: +55 24 3371 1413</p>
            </div>
            <div>
              <span>
                <CiUser className="icon" />
              </span>
              <p className="info">Hóspede: Fátima Silva Santos</p>
            </div>
          </div>
          <div className="card-reservas-line"></div>
        </div>
        <div className="action-container">
          <div className="button-group">
            <button className="primary-button">
              <IoEyeOutline /> Ver anúncio
            </button>
            <button className="primary-button">
              <IoChatbubbleOutline />
              Mandar mensagem
            </button>
            <button className="secondary-button">
              <PiTrashSimple />
              Cancelar hospedagem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardReservas;
