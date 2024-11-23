import { PiPhoneThin, PiArrowCircleLeftThin } from "react-icons/pi";
import { BiDish } from "react-icons/bi";
import { Link } from "react-router-dom";
import { CiLocationOn, CiUser } from "react-icons/ci";

import "./CardCancelarReservas.css";

const CardCancelarReservas = () => {
  return (
    <div className="card-cancelar">
      <div className="card-cancelar-menu">
        <div className="header-btn-sair">
          <Link to="/">
            <PiArrowCircleLeftThin />
          </Link>
        </div>
        <div>
          <h1>Cancelar hospedagem</h1>
          <p>Nome da Acomodação</p>
        </div>
      </div>
      <h2>Você deseja cancelar a seguinte reserva?</h2>
      <div className="card-cancelar-details">
        <div className="image-container">
          <img
            src="path/to/your/image.jpg"
            alt="Vista da acomodação"
            className="image"
          />
        </div>

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
          <div className="card-cancelar-reservas-line"></div>
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
            <div>
              <span>
                <BiDish className="icon" />
              </span>
              <p className="info">Refeições: Nenhuma</p>
            </div>
          </div>
        </div>
      </div>
      <div className="action-container">
        <div className="button-group">
          <button className="primary-button">Não</button>
          <button className="secondary-button">Sim, desejo cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default CardCancelarReservas;
