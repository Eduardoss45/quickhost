import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const FloatingMenu = ({ onSignUpClick, onLoginClick, isAuthenticated, profilePicture, name }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('id_user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    window.location.reload();
  };

  return (
    <div>
      <div>
        {!isAuthenticated ? (
          <>
            <Link to="/register">
              <button onClick={onSignUpClick}>
                Cadastrar-se
              </button>
            </Link>
            <Link to="/login">
              <button onClick={onLoginClick}>
                Fazer Login
              </button>
            </Link>
          </>
        ) : (
          <>
            <div>
              {profilePicture ? (
                <img src={profilePicture} alt="Avatar do Usuário"/>
              ) : (
                <FaUser />
              )}
              <span>{name || 'Nome de Usuário'}</span>
            </div>
            <Link to="/reservas">
              <button>Reservas</button>
            </Link>
            <Link to="/hospedar">
              <button>Hospedar</button>
            </Link>
            <Link to="/favoritos">
              <button>Favoritos</button>
            </Link>
            <Link to="/">
              <button>Mensagens</button>
            </Link>
            <Link to="/configuracoes">
              <button>Configuração</button>
            </Link>
            <hr />
            <button onClick={handleLogout}>
              Sair da Conta
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingMenu;
