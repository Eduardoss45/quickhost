import React from 'react';
import { IoEyeOutline, IoChatbubbleOutline } from 'react-icons/io5';
import { PiPhoneThin, PiTrashSimple } from 'react-icons/pi';
import { CiLocationOn, CiUser } from 'react-icons/ci';
import useDetalhes from '../hooks/useDetalhes';
import useAccommodation from '../hooks/useAccommodation';
import { Link } from 'react-router-dom';

const CardReservas = ({ userName, reserva }) => {
  const { userData } = useDetalhes(reserva);
  const { accommodationData } = useAccommodation(userData?.accommodation);
  const { userData: dados } = useDetalhes(accommodationData?.creator);
  return (
    <div>
      <div>
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData?.internal_images[0]}`}
          alt="Vista da acomodação"
        />
      </div>
      <div>
        <div>
          <div>
            <div>
              <h2>{accommodationData?.title}</h2>
              <p>{dados?.username || 'Anfitrião Desconhecido'}</p>
            </div>
            <div>
              <div>
                <span>Check-in</span>
                <p>{userData?.check_in_date || 'Data não disponível'}</p>
              </div>
              <div>
                <span>Check-out</span>
                <p>{userData?.check_out_date || 'Data não disponível'}</p>
              </div>
            </div>
          </div>
          <div></div>
          <div>
            <div>
              <span>
                <CiLocationOn />
              </span>
              <p>Endereço: {accommodationData?.address || 'Endereço não disponível'}</p>
            </div>
            <div>
              <span>
                <PiPhoneThin />
              </span>
              <p>Telefone: {dados?.phone_number || 'Telefone não disponível'}</p>
            </div>
            <div>
              <span>
                <CiUser />
              </span>
              <p>Hóspede: {userName || 'Nome do hóspede não disponível'}</p>
            </div>
          </div>
          <div></div>
        </div>
        <div>
          <div >
            <Link
              to={`/acomodacao/${accommodationData?.id_accommodation}`}
              
            >
              <IoEyeOutline /> Ver anúncio
            </Link>
            <button >
              <IoChatbubbleOutline />
              Mandar mensagem
            </button>
            <Link to={`/reservas/${reserva}`} >
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
