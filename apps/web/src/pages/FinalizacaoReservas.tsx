import { useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { PiArrowCircleLeftThin } from 'react-icons/pi';
import useAccommodation from '../hooks/useAccommodation';
import './css/FinalizacaoReserva.css';

const FinalizacaoReservas = () => {
  const { id } = useParams();
  const { accommodationData } = useAccommodation(id);
  const location = useLocation();
  const navigate = useNavigate();
  const handleExit = () => {
    navigate('/');
  };
  return (
    <div className="pagamento-card">
      <div>
        <div>
          <Link to="/">
            <span>
              <PiArrowCircleLeftThin />
            </span>
          </Link>
          <div>
            <h2>Reserva confirmada</h2>
            <p>{accommodationData?.title}</p>
          </div>
        </div>
        <div className="pagamento-concluido">
          <h3>Sucesso!</h3>
          <p>
            Sua estadia já foi confirmada em “{accommodationData?.title}” e já pode ser revisada na
            aba “Reservas”.
          </p>
        </div>
        <button onClick={handleExit}>Finalizar pagamento</button>
      </div>
      <div>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData?.main_cover_image}`}
          alt="A imagem principal não foi definida pelo anfitrião"
        />
      </div>
    </div>
  );
};

export default FinalizacaoReservas;
