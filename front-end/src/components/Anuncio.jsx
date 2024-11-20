import React, { useState } from "react";
import { PiArrowCircleLeftThin } from "react-icons/pi";
import { FaWifi, FaCar, FaSwimmingPool, FaMedkit } from "react-icons/fa";
import { LuMonitor } from "react-icons/lu";
import { GrRestaurant } from "react-icons/gr";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { TbAirConditioning, TbBeach } from "react-icons/tb";
import { MdHotTub, MdOutdoorGrill, MdFitnessCenter } from "react-icons/md";
import { WiSmoke } from "react-icons/wi";
import { PiFireExtinguisherBold, PiSecurityCameraThin } from "react-icons/pi";
import { Link } from "react-router-dom";
import { IoStarSharp } from "react-icons/io5";
import useDetalhes from "../hooks/useDetalhes.jsx";

import "./Anuncio.css";
import Avaliacao from "./Avaliacao.jsx";
import useComents from "../hooks/useComents.jsx";

const Anuncio = ({ accommodation }) => {
  const [avaliacao, setAvaliacao] = useState(null);
  const creatorData = accommodation.creator
    ? useDetalhes(accommodation.creator)
    : null;
  const { userData: creator } = creatorData;
  const { comentarios, loading, error } = useComents(
    accommodation?.id_accommodation
  );

  const handleReload = () => {
    window.location.reload();
  };

  const handleClick = (rating) => {
    setAvaliacao(rating);
    console.log(rating);
  };
  return (
    <div className="pagina-anuncio">
      <div className="header-anuncio">
        <div className="header-anuncio-separador">
          <div onClick={handleReload} className="header-btn-sair">
            <Link to="/">
              <PiArrowCircleLeftThin />
            </Link>
          </div>
          <aside className="header-title-acomodacao">
            {accommodation?.title ? (
              <h1>{accommodation.title}</h1>
            ) : (
              <h1>Título Indisponível</h1>
            )}
            <p>{accommodation?.address || "Endereço Indisponível"}</p>
          </aside>
        </div>
        <div className="header-btn-favoritar">
          <IoStarSharp /> Favoritar
        </div>
      </div>
      <div className="conteudo-anuncio">
        <div className="wrapper">
          {accommodation?.internal_images &&
          accommodation.internal_images.length >= 4 ? (
            <>
              <div className="box1">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${
                    accommodation.internal_images[1]
                  }`}
                  alt="Imagem 1"
                />
                <div className="conteudo-acomodacao-status">
                  <span>
                    {accommodation.is_active ? (
                      <p>Aberto para pedidos</p>
                    ) : (
                      <p>Fechado para pedidos</p>
                    )}
                  </span>
                </div>
              </div>
              <div className="box2">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${
                    accommodation.internal_images[2]
                  }`}
                  alt="Imagem 2"
                />
              </div>
              <div className="box3">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${
                    accommodation.internal_images[3]
                  }`}
                  alt="Imagem 3"
                />
              </div>
              <div className="box4">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${
                    accommodation.internal_images[4]
                  }`}
                  alt="Imagem 4"
                />
              </div>
            </>
          ) : (
            <p>Imagens indisponíveis</p>
          )}
        </div>
        <div className="conteudo-divisao-detalhes">
          <div>
            <aside className="conteudo-acomodacao-descricao">
              <h2>Descrição da Acomodação</h2>
              <p>{accommodation?.description || "Descrição Indisponível"}</p>
            </aside>
            <div className="linha-acomodacao-descricao"></div>
            <div className="conteudo-acomodacao-criador">
              <div>
                {creator?.profile_picture && (
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}${
                      creator.profile_picture
                    }`}
                    alt="Imagem do Criador"
                  />
                )}
              </div>
              <div>
                <h2>{creator?.username || "Nome do Criador Indisponível"}</h2>
                <p>Anfitrião</p>
              </div>
            </div>
            <div className="linha-acomodacao-descricao"></div>
            <aside className="conteudo-acomodacao-titulo">
              <h2>Esta Acomodação Oferece</h2>
            </aside>
            <div className="conteudo-acomodacao-recursos">
              <div>
                <div className={`${accommodation.wifi ? "visible" : "hidden"}`}>
                  <span>
                    <FaWifi />
                  </span>
                  <span>Wifi</span>
                </div>
                <div
                  className={`${
                    accommodation.parking_included ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <FaCar />
                  </span>
                  <span>Estacionamento</span>
                </div>
                <div className={`${accommodation.pool ? "visible" : "hidden"}`}>
                  <span>
                    <FaSwimmingPool />
                  </span>
                  <span>Piscina</span>
                </div>
                <div
                  className={`${accommodation.jacuzzi ? "visible" : "hidden"}`}
                >
                  <span>
                    <MdHotTub />
                  </span>
                  <span>Jacuzzi</span>
                </div>
                <div
                  className={`${
                    accommodation.air_conditioning ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <TbAirConditioning />
                  </span>
                  <span>Ar-Condicionado</span>
                </div>
                <div
                  className={`${
                    accommodation.washing_machine ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <CgSmartHomeWashMachine />
                  </span>
                  <span>Lavadora</span>
                </div>
                <div
                  className={`${accommodation.grill ? "visible" : "hidden"}`}
                >
                  <span>
                    <MdOutdoorGrill />
                  </span>
                  <span>Churrasqueira</span>
                </div>
              </div>
              <div>
                <div
                  className={`${
                    accommodation.first_aid_kit ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <FaMedkit />
                  </span>
                  <span>Kit de Primeiros Socorros</span>
                </div>
                <div
                  className={`${
                    accommodation.fire_extinguisher ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <PiFireExtinguisherBold />
                  </span>
                  <span>Extintor de Incêndio</span>
                </div>
                <div
                  className={`${
                    accommodation.smoke_detector ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <WiSmoke />
                  </span>
                  <span>Detector de Fumaça</span>
                </div>
                <div
                  className={`${
                    accommodation.outdoor_camera ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <PiSecurityCameraThin />
                  </span>
                  <span>Câmera Externa</span>
                </div>
                <div
                  className={`${accommodation.kitchen ? "visible" : "hidden"}`}
                >
                  <span>
                    <GrRestaurant />
                  </span>
                  <span>Cozinha</span>
                </div>
                <div className={`${accommodation.tv ? "visible" : "hidden"}`}>
                  <span>
                    <LuMonitor />
                  </span>
                  <span>TV</span>
                </div>
                <div
                  className={`${
                    accommodation.private_gym ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <MdFitnessCenter />
                  </span>
                  <span>Academia Privada</span>
                </div>
                <div
                  className={`${
                    accommodation.beach_access ? "visible" : "hidden"
                  }`}
                >
                  <span>
                    <TbBeach />
                  </span>
                  <span>Acesso a Praia</span>
                </div>
              </div>
            </div>
            <div className="linha-acomodacao-descricao"></div>
            <div className="acomodacao-informacoes-importantes">
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
                  accommodation.kitchen
                    ? "Possui câmera de segurança na área externa"
                    : "Não possui câmera de segurança"
                }`}</p>
              </div>
              <div className="linha-acomodacao-descricao"></div>
            </div>
            <aside className="acomodacao-informacoes-avaliacao">
              <h2>
                Avaliações{" "}
                {comentarios?.length > 0
                  ? `${comentarios.length}`
                  : "Nenhuma avaliação disponível"}
              </h2>
              <p>
                <IoStarSharp />{" "}
                <span>
                  {accommodation?.average_rating ||
                    "Nenhuma avaliação disponível"}
                </span>
              </p>
            </aside>
            <div className="caixa-avaliacao">
              <span>Escolha sua avaliação</span>
              <ul className="avaliacao">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <li
                    key={rating}
                    className="star-icon"
                    onClick={() => handleClick(rating)}
                  >
                    {/* Usando FaStar para estrelas cheias e FaRegStar para estrelas vazias */}
                    {avaliacao >= rating ? (
                      <IoStarSharp className="ativo" />
                    ) : (
                      <IoStarSharp className="desativado" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Avaliacao comentarios={comentarios} />
            </div>
          </div>
          {/* <div>
            <div>
              <div>Quadro 1</div>
              <div>Quadro 2</div>
            </div>
            <div>Preço</div>
            <div>Taxa</div>
            <div>Total</div>
            <button>Botão 1</button>
            <button>Botão 2</button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Anuncio;
