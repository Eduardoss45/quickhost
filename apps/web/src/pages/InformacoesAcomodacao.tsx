import { useParams, useNavigate } from 'react-router-dom';
import { PiArrowCircleLeftThin } from 'react-icons/pi';
import useAccommodation from '../hooks/useAccommodation';

import InfoCard from './InfoCard';

const InformacoesAcomodacao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { accommodationData } = useAccommodation(id);
  return (
    <div >
      <div>
        <PiArrowCircleLeftThin onClick={() => navigate('/hospedar')} />
        <div>
          <h2>Ver informações</h2>
          <p>{accommodationData?.title || 'Título não disponível'}</p>
        </div>
      </div>
      <div>
        <button>
          Todas hospedagens ({accommodationData?.registered_user_bookings?.length || 0})
        </button>
        <button>Hóspedes no momento ({accommodationData?.current_guests || 0})</button>
        <button>Programados ({accommodationData?.upcoming_bookings || 0})</button>
      </div>
      {accommodationData?.registered_user_bookings?.length > 0 ? (
        <>
          {accommodationData?.registered_user_bookings.map((booking, index) => (
            <InfoCard
              booking={booking}
              index={index}
              accommodationData={accommodationData?.registered_user_bookings[index]}
            />
          ))}
        </>
      ) : (
        <p>Sem reservas registradas no momento.</p>
      )}
    </div>
  );
};

export default InformacoesAcomodacao;
