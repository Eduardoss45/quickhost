import { Link } from "react-router-dom";
import "./MenuFlutuante.css";

const MenuFlutuante = ({
  onLoginClick,
  onSignUpClick, // Renomeado para melhor clareza
  isAuthenticated,
  onLogout,
}) => {
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
            {/* Alterado para onSignUpClick */}
          </Link>
          <div id="menu-line"></div>
          <Link to="/">
            <button onClick={onLogout}>Sair</button>
          </Link>
        </>
      ) : (
        <>
          <Link to="/">
            <button onClick={onLoginClick}>Entrar</button>
          </Link>
          <div id="menu-line"></div>
          <Link to="/cadastro">
            <button onClick={onSignUpClick}>Cadastrar</button>{" "}
            {/* Alterado para onSignUpClick */}
          </Link>
        </>
      )}
    </div>
  );
};

export default MenuFlutuante;
