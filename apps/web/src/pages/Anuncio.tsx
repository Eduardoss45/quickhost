import React, { useState, useEffect } from 'react';
import { PiArrowCircleLeftThin } from 'react-icons/pi';
import { FaWifi, FaCar, FaSwimmingPool, FaMedkit } from 'react-icons/fa';
import { LuMonitor } from 'react-icons/lu';
import { GrRestaurant } from 'react-icons/gr';
import { CgSmartHomeWashMachine } from 'react-icons/cg';
import { TbAirConditioning, TbBeach } from 'react-icons/tb';
import { MdHotTub, MdOutdoorGrill, MdFitnessCenter } from 'react-icons/md';
import { WiSmoke } from 'react-icons/wi';
import { PiFireExtinguisherBold, PiSecurityCameraThin } from 'react-icons/pi';
import { Link, useParams, Navigate, useNavigate } from 'react-router-dom';
import { IoStarSharp } from 'react-icons/io5';
import useDetalhes from '../hooks/useDetalhes';
import SeletorData from './SeletorData.js';
import Avaliacao from './Avaliacao.js';
import useComents from '../hooks/useComents.js';
import useUserData from '../hooks/useUserData.js';
import useFavorite from '../hooks/useFavorite.js';
Anuncio.css';
import useAccommodation from '../hooks/useAccommodation.js';

const Anuncio = () => {
  const { data } = useParams();
  const navigate = useNavigate();
  const { accommodationData } = useAccommodation(data);
  const { isFavorite, toggleFavorite } = useFavorite(accommodationData?.id_accommodation);
  const [avaliacao, setAvaliacao] = useState(null);
  const [total, setTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(false);
  const { userData: dados } = useUserData();
  const creatorData = useDetalhes(accommodationData?.creator);
  const { userData: creator } = creatorData;
  const { comentarios, postComment } = useComents(accommodationData?.id_accommodation);
  const handleClick = rating => {
    setAvaliacao(rating);
  };
  const handleFavoriteClick = () => {
    toggleFavorite();
  };
  const handleAddComment = () => {
    postComment(
      dados?.id_user || null,
      accommodationData?.id_accommodation || null,
      comment,
      avaliacao
    );
  };
  const handleDataChange = (newCheckin, newCheckout, newTotal, newTax) => {
    setTotal(newTotal);
    setTax(newTax);
    setCheckIn(newCheckin);
    setCheckOut(newCheckout);
  };
  const formatDate = date => {
    if (!date) return null;
    const formattedDate = new Date(date);
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const handleDataSubmit = e => {
    e.preventDefault();
    setError(false);
    if (checkIn && checkOut) {
      const formData = {
        user_booking: dados.id_user,
        accommodation: accommodationData.id_accommodation,
        check_in_date: formatDate(checkIn),
        check_out_date: formatDate(checkOut),
        price: accommodationData.price,
      };
      navigate(`/pagamento/${accommodationData?.id_accommodation}`, {
        state: formData,
      });
    } else {
      setError(true);
    }
  };

  return (
    <div >
      <div >
        <div >
          <div >
            <Link to="/">
              <PiArrowCircleLeftThin />
            </Link>
          </div>
          <aside >
            {accommodationData?.title ? (
              <h1>{accommodationData.title}</h1>
            ) : (
              <h1>Título Indisponível</h1>
            )}
            <p>{accommodationData?.address || 'Endereço Indisponível'}</p>
          </aside>
        </div>
        <div onClick={handleFavoriteClick} >
          <IoStarSharp
            style={{
              color: isFavorite ? '#ff6f31' : '#001969',
              cursor: 'pointer',
            }}
          />
          <span>{isFavorite ? 'Remover' : 'Favoritar'}</span>
        </div>
      </div>
      <div >
        <div >
          {accommodationData?.internal_images && accommodationData.internal_images.length >= 4 ? (
            <>
              <div >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData.internal_images[1]}`}
                  alt="Imagem 1"
                />
                <div >
                  <span>
                    {accommodationData.is_active ? (
                      <p>Aberto para pedidos</p>
                    ) : (
                      <p>Fechado para pedidos</p>
                    )}
                  </span>
                </div>
              </div>
              <div >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData.internal_images[2]}`}
                  alt="Imagem 2"
                />
              </div>
              <div >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData.internal_images[3]}`}
                  alt="Imagem 3"
                />
              </div>
              <div >
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${accommodationData.internal_images[4]}`}
                  alt="Imagem 4"
                />
              </div>
            </>
          ) : (
            <p>Imagens indisponíveis</p>
          )}
        </div>
        <div >
          <div>
            <aside >
              <h2>Descrição da Acomodação</h2>
              <p>{accommodationData?.description || 'Descrição Indisponível'}</p>
            </aside>
            <div ></div>
            <div >
              <div>
                {creator?.profile_picture && (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${creator.profile_picture}`}
                    alt="Imagem do Criador"
                  />
                )}
              </div>
              <div>
                <h2>{creator?.username || 'Nome do Criador Indisponível'}</h2>
                <p>Anfitrião</p>
              </div>
            </div>
            <div ></div>
            <aside >
              <h2>Esta Acomodação Oferece</h2>
            </aside>
            <div >
              <div>
                <div >
                  <span>
                    <FaWifi />
                  </span>
                  <span>Wifi</span>
                </div>
                <div >
                  <span>
                    <FaCar />
                  </span>
                  <span>Estacionamento</span>
                </div>
                <div >
                  <span>
                    <FaSwimmingPool />
                  </span>
                  <span>Piscina</span>
                </div>
                <div >
                  <span>
                    <MdHotTub />
                  </span>
                  <span>Jacuzzi</span>
                </div>
                <div >
                  <span>
                    <TbAirConditioning />
                  </span>
                  <span>Ar-Condicionado</span>
                </div>
                <div >
                  <span>
                    <CgSmartHomeWashMachine />
                  </span>
                  <span>Lavadora</span>
                </div>
                <div >
                  <span>
                    <MdOutdoorGrill />
                  </span>
                  <span>Churrasqueira</span>
                </div>
              </div>
              <div>
                <div >
                  <span>
                    <FaMedkit />
                  </span>
                  <span>Kit de Primeiros Socorros</span>
                </div>
                <div >
                  <span>
                    <PiFireExtinguisherBold />
                  </span>
                  <span>Extintor de Incêndio</span>
                </div>
                <div >
                  <span>
                    <WiSmoke />
                  </span>
                  <span>Detector de Fumaça</span>
                </div>
                <div >
                  <span>
                    <PiSecurityCameraThin />
                  </span>
                  <span>Câmera Externa</span>
                </div>
                <div >
                  <span>
                    <GrRestaurant />
                  </span>
                  <span>Cozinha</span>
                </div>
                <div >
                  <span>
                    <LuMonitor />
                  </span>
                  <span>TV</span>
                </div>
                <div >
                  <span>
                    <MdFitnessCenter />
                  </span>
                  <span>Academia Privada</span>
                </div>
                <div >
                  <span>
                    <TbBeach />
                  </span>
                  <span>Acesso a Praia</span>
                </div>
              </div>
            </div>
            <div ></div>
            <div >
              <aside>
                <h2>Informações Importantes</h2>
              </aside>
              <div>
                <h3>Check-In e Check-Out</h3>
                <p>Check-in a partir das 14h</p>
                <p>Check-out até às 12h</p>
              </div>
              <div>
                <h3>Política de Cancelamento</h3>
                <p>Após o pagamento há a possibilidade de cancelamento.</p>
              </div>
              <div>
                <h3>Câmera de Segurança</h3>
                <p>{`${
                  accommodationData?.kitchen
                    ? 'Possui câmera de segurança na área externa'
                    : 'Não possui câmera de segurança'
                }`}</p>
              </div>
              <div ></div>
            </div>
            <aside >
              <h2>
                Avaliações{' '}
                {comentarios?.length > 0 ? `${comentarios.length}` : 'Nenhuma avaliação disponível'}
              </h2>
              <p>
                <IoStarSharp />{' '}
                <span>{accommodationData?.average_rating || 'Nenhuma avaliação disponível'}</span>
              </p>
            </aside>
            {dados?.registered_accommodation_bookings?.length > 0 ? (
              accommodationData?.registered_user_bookings.some(
                item => item == dados?.registered_accommodation_bookings
              ) ? (
                <div >
                  <input
                    type="text"
                    value={comment}
                    placeholder="Deixe seu comentário...(pelo menos 100 caracteres!)"
                    onChange={e => setComment(e.target.value)}
                    aria-label="Comentário sobre a avaliação"
                  />
                  {comment !== '' && avaliacao > 0 && (
                    <button onClick={handleAddComment}>Enviar</button>
                  )}

                  <ul >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <li
                        key={rating}
                        
                        onClick={() => handleClick(rating)}
                        role="button"
                        aria-label={`Avaliar com ${rating} estrelas`}
                      >
                        {avaliacao >= rating ? (
                          <IoStarSharp />
                        ) : (
                          <IoStarSharp />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div >
                  <span>Você não se hospedou neste local.</span>
                </div>
              )
            ) : (
              <div >
                <span>Você não tem autorização para comentar nesta acomodação.</span>
              </div>
            )}

            <div>
              <Avaliacao comentarios={comentarios} />
            </div>
          </div>
          <div >
            <div>
              <SeletorData pricePerDay={accommodationData?.price} onDateChange={handleDataChange} />
              <div >
                <p>Acomodação</p>
                <span>{`R$ ${accommodationData?.price || '0,00'}`}</span>
              </div>
              <div ></div>
              <div >
                <p>Taxa de Serviço</p>
                <span>{`R$ ${tax || '0,00'}`}</span>
              </div>
              <div ></div>
              <div >
                <p>Total</p>
                <span>{`R$ ${total || '0,00'}`}</span>
              </div>
              {error && (
                <div >
                  <span>Selecione o check in e check out!</span>
                </div>
              )}
              <div >
                <button
                  disabled={accommodationData?.registered_user_bookings.some(bookingId =>
                    dados?.registered_accommodation_bookings.includes(bookingId)
                  )}
                  onClick={handleDataSubmit}
                >
                  Reservar Reservar para a Temporada
                </button>
                <button type="button">Enviar Mensagem</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anuncio;
