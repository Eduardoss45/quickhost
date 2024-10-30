import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import useLogin from "../hooks/useLogin";

import "./PainelFlutuanteLogin.css";

const PainelFlutuanteLogin = ({
  hideLoginPainel,
  showUserRegistrationPainel,
  onLoginSuccessful,
  setIsAuthenticated,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const { handleLogin, errorMessage, successMessage } =
    useLogin(handleAuthenticated);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await handleLogin(email, password);

    if (success) {
      setTimeout(() => {
        onLoginSuccessful();
        hideLoginPainel();
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div id="painel-flutuante">
      <div id="painel-login">
        <div id="top-painel">
          <span onClick={hideLoginPainel}>
            <IoMdClose />
          </span>
          Entrar ou Cadastrar-se
        </div>
        <div id="form-login">
          <h1>Bem-vindo ao Quick Host</h1>
          {(errorMessage || successMessage) && (
            <p className={errorMessage ? "error message" : "success message"}>
              {errorMessage || successMessage}
            </p>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Senha"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                id="btn-submit-login"
                type="submit"
                value="Log in"
                disabled={loading}
              />
              {loading && <span>Loading...</span>}{" "}
              {/* Feedback de carregamento */}
            </div>
          </form>
          <p>
            Não possui conta?{" "}
            <Link to="/cadastro" onClick={showUserRegistrationPainel}>
              Criar
            </Link>
          </p>
          <p>
            <Link to="/senha" onClick={showUserRegistrationPainel}>
              Esqueci a senha
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PainelFlutuanteLogin;
