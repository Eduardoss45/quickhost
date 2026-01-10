import { Link } from "react-router-dom";
import { LiaUserEditSolid } from "react-icons/lia";
import { HiChevronRight } from "react-icons/hi2";


const Configuracoes = () => {
  return (
    <div >
      <h2>Configuracoes</h2>
      <Link to="/perfil">
        <div>
          <div>
            <span >
              <LiaUserEditSolid />
            </span>
            <p>Minhas Informações</p>
          </div>
          <div>
            <span >
              <HiChevronRight />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Configuracoes;
