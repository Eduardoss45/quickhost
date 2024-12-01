import useDetalhes from "../hooks/useDetalhes";
import React from "react";
import { IoChatbubbleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import "./InfoCard.css";

const InfoCard = ({ booking, index, accommodationData }) => {
  const { userData, loading, error } = useDetalhes(booking);
  const { userData: data } = useDetalhes(userData?.user);
  return (
    <div key={index} className="info-card">
      <div>
        <div>
          <img
            src={
              `${import.meta.env.VITE_BASE_URL}${data?.profile_picture}` ||
              "/path/to/default-image.jpg"
            }
            alt={`Reserva ${index + 1}`}
          />
          <div>
            <h2>{data?.username || "Nome não disponível"}</h2>
            <p>Hospede no momento</p>
          </div>
          <div>
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
        </div>
          <div className="card-info-line"></div>
        <div>
          <Link>
            <button className="primary-button">
              <IoChatbubbleOutline />
              Mandar mensagem
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
