import { useParams, useNavigate } from "react-router-dom";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import useAccommodation from "../hooks/useAccommodation";
import useDetalhes from "../hooks/useDetalhes";
import "./InformacoesAcomodacao.css";

const InformacoesAcomodacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accommodationData } = useAccommodation(id);
  const listItems = accommodationData?.registered_user_bookings.length
    ? accommodationData?.registered_user_bookings.map((item) =>
        console.log(item)
      )
    : null;
  return (
    <div className="info-acomodacao">
      <div>
        <PiArrowCircleLeftThin onClick={() => navigate("/hospedar")} />
        <div>
          <h2>Ver informações</h2>
          <p>{accommodationData?.title || "Título não disponível"}</p>
        </div>
      </div>
      <div>
        <button>
          Todas hospedagens (
          {accommodationData?.registered_bookings?.length || 0})
        </button>
        <button>
          Hóspedes no momento ({accommodationData?.current_guests || 0})
        </button>
        <button>
          Programados ({accommodationData?.upcoming_bookings || 0})
        </button>
      </div>
      {accommodationData?.registered_bookings?.length > 0 ? (
        <div>
          {accommodationData?.registered_bookings.map((booking, index) => (
            <div key={index}>
              <div>
                <img
                  src={booking.image || "/path/to/default-image.jpg"}
                  alt={`Reserva ${index + 1}`}
                />
                <div>
                  <h2>{booking.guest_name || "Nome não disponível"}</h2>
                  <p>{booking.description || "Descrição não disponível"}</p>
                </div>
              </div>
              <div>
                <div className="dates-container">
                  <div className="date-item">
                    <span>Check-in</span>
                    <p>{booking.check_in_date || "Data não disponível"}</p>
                  </div>
                  <div className="date-item">
                    <span>Check-out</span>
                    <p>{booking.check_out_date || "Data não disponível"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Sem reservas registradas no momento.</p>
      )}
      <div>
        <p>Detalhes adicionais podem ser exibidos aqui.</p>
      </div>
    </div>
  );
};

export default InformacoesAcomodacao;
