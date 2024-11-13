import { PiArrowCircleLeftThin } from "react-icons/pi";
import { FaWifi, FaCar, FaSwimmingPool, FaMedkit } from "react-icons/fa";
import { LuMonitor } from "react-icons/lu";
import { GrRestaurant } from "react-icons/gr";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { TbAirConditioning, TbBeach } from "react-icons/tb";
import { MdHotTub, MdOutdoorGrill, MdFitnessCenter } from "react-icons/md";
import { WiSmoke } from "react-icons/wi";
import { PiFireExtinguisherBold, PiSecurityCameraThin } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import useUserData from "../hooks/useUserData.jsx";

import "./Anuncio.css";

const Anuncio = ({ accommodation }) => {
  console.log(accommodation);
  const accommodationCreator = accommodation.creator;
  const creatorData = useUserData(accommodationCreator);
  const { userData: creator } = creatorData;
  const getColor = (condition) => (condition ? "#001969" : "#000000");
  console.log(creator);
  return (
    <div className="pagina-anuncio">
      <div className="header-anuncio">
        <div className="header-anuncio-separador">
          <div className="header-btn-sair">
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
          <FaStar /> Favoritar
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
                  <img src={creator.profile_picture} alt="Imagem do Criador" />
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
                <div>
                  <span>
                    <FaWifi color={getColor(accommodation.wifi)} />
                  </span>
                  <span>Wifi</span>
                </div>
                <div>
                  <span>
                    <FaCar color={getColor(accommodation.parking_included)} />
                  </span>
                  <span>Estacionamento</span>
                </div>
                <div>
                  <span>
                    <FaSwimmingPool color={getColor(accommodation.pool)} />
                  </span>
                  <span>Piscina</span>
                </div>
                <div>
                  <span>
                    <MdHotTub color={getColor(accommodation.jacuzzi)} />
                  </span>
                  <span>Jacuzzi</span>
                </div>
                <div>
                  <span>
                    <TbAirConditioning
                      color={getColor(accommodation.air_conditioning)}
                    />
                  </span>
                  <span>Ar-Condicionado</span>
                </div>
                <div>
                  <span>
                    <CgSmartHomeWashMachine
                      color={getColor(accommodation.washing_machine)}
                    />
                  </span>
                  <span>Lavadora</span>
                </div>
                <div>
                  <span>
                    <MdOutdoorGrill color={getColor(accommodation.grill)} />
                  </span>
                  <span>Churrasqueira</span>
                </div>
              </div>
              <div>
                <div>
                  <span>
                    <FaMedkit color={getColor(accommodation.first_aid_kit)} />
                  </span>
                  <span>Kit de Primeiros Socorros</span>
                </div>
                <div>
                  <span>
                    <PiFireExtinguisherBold
                      color={getColor(accommodation.fire_extinguisher)}
                    />
                  </span>
                  <span>Extintor de Incêndio</span>
                </div>
                <div>
                  <span>
                    <WiSmoke color={getColor(accommodation.smoke_detector)} />
                  </span>
                  <span>Detector de Fumaça</span>
                </div>
                <div>
                  <span>
                    <PiSecurityCameraThin
                      color={getColor(accommodation.outdoor_camera)}
                    />
                  </span>
                  <span>Câmera Externa</span>
                </div>
                <div>
                  <span>
                    <GrRestaurant color={getColor(accommodation.kitchen)} />
                  </span>
                  <span>Cozinha</span>
                </div>
                <div>
                  <span>
                    <LuMonitor color={getColor(accommodation.tv)} />
                  </span>
                  <span>TV</span>
                </div>
              </div>
            </div>
            <div className="linha-acomodacao-descricao"></div>
            {/* <aside>
              <h2>Informações Importantes</h2>
            </aside>
            <div>
              <h3>Check-In e Check-Out</h3>
              <p></p>
              <p></p>
            </div>
            <div>
              <h3></h3>
              <p></p>
            </div>
            <div>
              <h3></h3>
              <p></p>
            </div> */}
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
