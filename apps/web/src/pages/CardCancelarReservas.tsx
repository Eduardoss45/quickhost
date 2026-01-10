import { PiPhoneThin, PiArrowCircleLeftThin } from 'react-icons/pi';
import { BiDish } from 'react-icons/bi';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CiLocationOn, CiUser } from 'react-icons/ci';
import useCancelarReservas from '../hooks/useCancelarReservas';
import useAccommodation from '../hooks/useAccommodation';
import useDetalhes from '../hooks/useDetalhes';

const CardCancelarReservas = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useDetalhes(id);
  const { userData: hospede } = useDetalhes(userData?.user);
  const { accommodationData } = useAccommodation(userData?.accommodation);
  const { userData: creator } = useDetalhes(accommodationData?.creator);
  const { handleDeleteReserva, loading, success, error } = useCancelarReservas(userData?.booking);

  const handleCancelarReserva = async () => {
    await handleDeleteReserva();

    if (success) {
      alert('Reserva cancelada com sucesso!');
      navigate('/');
      location.reload();
    } else if (error) {
      alert('Erro ao cancelar a reserva. Por favor, tente novamente.');
      location.reload();
    }
  };

  return (
    <div>
      <div>
        <div>
          <PiArrowCircleLeftThin onClick={() => navigate('/reservas')} />
        </div>
        <div>
          <h1>Cancelar hospedagem</h1>
          <p>{accommodationData?.title || 'Não informado'}</p>
        </div>
      </div>
      <h2>Você deseja cancelar a seguinte reserva?</h2>
      <div>
        <div>
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData?.main_cover_image}`}
            alt="Vista da acomodação"
          />
        </div>

        <div>
          <div>
            <div>
              <h2>{accommodationData?.title || 'Não informado'}</h2>
              <p>{creator?.username || 'Não informado'}</p>
            </div>
            <div>
              <div>
                <span>Check-in</span>
                <p>{userData?.check_in_date || 'Não informado'}</p>
              </div>
              <div>
                <span>Check-out</span>
                <p>{userData?.check_out_date || 'Não informado'}</p>
              </div>
            </div>
          </div>
          <div></div>
          <div>
            <div>
              <span>
                <CiLocationOn />
              </span>
              <p>Endereço: {accommodationData?.address || 'Não informado'}</p>
            </div>
            <div>
              <span>
                <PiPhoneThin />
              </span>
              <p>Telefone: {creator?.phone_number}</p>
            </div>
            <div>
              <span>
                <CiUser />
              </span>
              <p>Hóspede: {hospede?.username}</p>
            </div>
            <div>
              <span>
                <BiDish />
              </span>
              <p>Refeições: 3</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <Link to="/reservas">
            <button>Não</button>
          </Link>
          <button onClick={handleCancelarReserva} disabled={loading}>
            {loading ? 'Cancelando...' : 'Sim, desejo cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardCancelarReservas;
