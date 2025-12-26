import { PiPhoneThin, PiArrowCircleLeftThin } from "react-icons/pi";
import { BiDish } from "react-icons/bi";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CiLocationOn, CiUser } from "react-icons/ci";
import useCancelarReservas from "../hooks/useCancelarReservas";
import useAccommodation from "../hooks/useAccommodation";
import useDetalhes from "../hooks/useDetalhes";
import "./CardCancelarReservas.css";

const CardCancelarReservas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useDetalhes(id);
  const { userData: hospede } = useDetalhes(userData?.user);
  const { accommodationData } = useAccommodation(userData?.accommodation);
  const { userData: creator } = useDetalhes(accommodationData?.creator);
  const { handleDeleteReserva, loading, success, error } = useCancelarReservas(
    userData?.booking
  );

  const handleCancelarReserva = async () => {
    await handleDeleteReserva();

    if (success) {
      alert("Reserva cancelada com sucesso!");
      navigate("/");
      location.reload();
    } else if (error) {
      alert("Erro ao cancelar a reserva. Por favor, tente novamente.");
      location.reload();
    }
  };

  return (
    <div className="card-cancelar">
      <div className="card-cancelar-menu">
        <div className="header-btn-sair">
          <PiArrowCircleLeftThin onClick={() => navigate("/reservas")} />
        </div>
        <div>
          <h1>Cancelar hospedagem</h1>
          <p>{accommodationData?.title || "Não informado"}</p>
        </div>
      </div>
      <h2>Você deseja cancelar a seguinte reserva?</h2>
      <div className="card-cancelar-details">
        <div className="image-container">
          <img
            src={`${import.meta.env.VITE_BASE_URL}${
              accommodationData?.main_cover_image
            }`}
            alt="Vista da acomodação"
            className="image"
          />
        </div>

        <div className="details-container">
          <div>
            <div className="title-container">
              <h2 className="title">
                {accommodationData?.title || "Não informado"}
              </h2>
              <p className="host">{creator?.username || "Não informado"}</p>
            </div>
            <div className="dates-container">
              <div className="date-item">
                <span>Check-in</span>
                <p>{userData?.check_in_date || "Não informado"}</p>
              </div>
              <div className="date-item">
                <span>Check-out</span>
                <p>{userData?.check_out_date || "Não informado"}</p>
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
                Endereço: {accommodationData?.address || "Não informado"}
              </p>
            </div>
            <div>
              <span>
                <PiPhoneThin className="icon" />
              </span>
              <p className="info">Telefone: {creator?.phone_number}</p>
            </div>
            <div>
              <span>
                <CiUser className="icon" />
              </span>
              <p className="info">Hóspede: {hospede?.username}</p>
            </div>
            <div>
              <span>
                <BiDish className="icon" />
              </span>
              <p className="info">Refeições: 3</p>
            </div>
          </div>
        </div>
      </div>
      <div className="action-container">
        <div className="button-group">
          <Link to="/reservas">
            <button className="primary-button">Não</button>
          </Link>
          <button
            onClick={handleCancelarReserva}
            className="secondary-button"
            disabled={loading}
          >
            {loading ? "Cancelando..." : "Sim, desejo cancelar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCancelarReservas;
