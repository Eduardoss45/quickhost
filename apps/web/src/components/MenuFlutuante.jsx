import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import "./MenuFlutuante.css";

const MenuFlutuante = ({
  onSignUpClick,
  onLoginClick,
  isAuthenticated,
  profilePicture,
  name,
}) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("id_user");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    window.location.reload();
  };

  return (
    <div className="menu-flutuante">
      <div className="dropdown">
        {!isAuthenticated ? (
          <>
            <Link to="/cadastro">
              <button className="dropdown-item" onClick={onSignUpClick}>
                Cadastrar-se
              </button>
            </Link>
            <Link to="/entrar">
              <button className="dropdown-item" onClick={onLoginClick}>
                Fazer Login
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="dropdown-header">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Avatar do Usuário"
                  className="avatar-large"
                />
              ) : (
                <FaUser className="avatar-large" />
              )}
              <span>{name || "Nome de Usuário"}</span>
            </div>
            <Link to="/reservas">
              <button className="dropdown-item">Reservas</button>
            </Link>
            <Link to="/hospedar">
              <button className="dropdown-item">Hospedar</button>
            </Link>
            <Link to="/favoritos">
              <button className="dropdown-item">Favoritos</button>
            </Link>
            <Link to="/">
              <button className="dropdown-item">Mensagens</button>
            </Link>
            <Link to="/configuracoes">
              <button className="dropdown-item">Configuração</button>
            </Link>
            <hr />
            <button className="dropdown-item" onClick={handleLogout}>
              Sair da Conta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuFlutuante;
