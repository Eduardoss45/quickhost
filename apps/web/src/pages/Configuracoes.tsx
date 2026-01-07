import { Link } from "react-router-dom";
import { LiaUserEditSolid } from "react-icons/lia";
import { HiChevronRight } from "react-icons/hi2";
import './css/Configuracoes.css';

const Configuracoes = () => {
  return (
    <div className="configuracoes-page">
      <h2>Configuracoes</h2>
      <Link to="/perfil">
        <div>
          <div>
            <span className="configuracoes-icone">
              <LiaUserEditSolid />
            </span>
            <p>Minhas Informações</p>
          </div>
          <div>
            <span className="configuracoes-icone">
              <HiChevronRight />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Configuracoes;
