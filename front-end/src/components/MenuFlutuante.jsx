import { Link } from "react-router-dom";
import "./MenuFlutuante.css";

const MenuFlutuante = ({ onSignUpClick, onLoginClick }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("id_user");
    localStorage.removeItem("isAuthenticated");
  };
  return (
    <div id="menu-flutuante">
      {isAuthenticated ? (
        <>
          <Link to="/favoritos">
            <button onClick={onLoginClick}>Favoritos</button>
          </Link>
          <div id="menu-line"></div>
          <Link to="/perfil">
            <button onClick={onSignUpClick}>Conta</button>{" "}
          </Link>
          <div id="menu-line"></div>
          <Link to="/">
            <button onClick={handleLogout}>Sair</button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/entrar">
            <button>Entrar</button>
          </Link>
          <div id="menu-line"></div>
          <Link to="/cadastro">
            <button>Cadastrar</button>{" "}
          </Link>
        </>
      )}
    </div>
  );
};

export default MenuFlutuante;
