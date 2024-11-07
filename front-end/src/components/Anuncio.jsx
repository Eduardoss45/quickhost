import { PiArrowCircleLeftThin } from "react-icons/pi";
import { FaStar } from "react-icons/fa";

import "./Anuncio.css";

const Anuncio = ({ accommodation }) => {
  console.log(accommodation);

  return (
    <div className="pagina-anuncio">
      <div className="header-anuncio">
        <div className="header-anuncio-separador">
          <div className="header-btn-sair">
            <PiArrowCircleLeftThin />
          </div>
          <div className="header-title-acomodacao">
            {accommodation?.title ? (
              <h1>{accommodation.title}</h1>
            ) : (
              <h1>Título Indisponível</h1>
            )}
            <p>{accommodation?.address || "Endereço Indisponível"}</p>
          </div>
        </div>
        <div className="header-btn-favoritar">
          <FaStar /> Favoritar
        </div>
      </div>
      <div className="conteudo-anuncio">
        <div className="wrapper">
          {/* Verifica se `internal_images` existe e se contém ao menos 4 imagens */}
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
            <div className="conteudo-acomodacao-descricao">
              <h2>Descrição da Acomodação</h2>
              <p>{accommodation?.description || "Descrição Indisponível"}</p>
            </div>

            {/* Outras seções detalhadas da acomodação */}
            <div>
              <h2>Titulo 1</h2>
              <p>
                <strong>Texto 1</strong>
              </p>
              <p>Texto 2</p>
              <p>Texto 3</p>
            </div>
            <div>
              <h2>Titulo 2</h2>
              <p>
                <strong>Texto 4</strong>
              </p>
            </div>
            <div>
              <h2>Titulo 3</h2>
              <p>
                <strong>Texto 5</strong>
              </p>
            </div>
            <div>
              <h2>Nome do Proprietário</h2>
              <p>Descrição</p>
            </div>
            <div>
              <h2>Titulo 4</h2>
              <span>Ícone + texto 1</span>
              <span>Ícone + texto 2</span>
              <span>Ícone + texto 3</span>
              <span>Ícone + texto 4</span>
            </div>
          </div>
          <div>
            <div>
              <div>Quadro 1</div>
              <div>Quadro 2</div>
            </div>
            <div>Preço</div>
            <div>Taxa</div>
            <div>Total</div>
            <button>Botão 1</button>
            <button>Botão 2</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Anuncio;
