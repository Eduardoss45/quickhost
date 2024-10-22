import { Link } from "react-router-dom";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import useLogin from "../hooks/useLogin"; // Importando o hook

import "./PainelFlutuanteLogin.css";

const PainelFlutuanteLogin = ({
  hideLoginPainel,
  showUserRegistrationPainel,
  onLoginSuccessful,
  setIsAuthenticated, // Recebendo o setIsAuthenticated do pai
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carregamento

  // Usando o hook useLogin
  const { handleLogin, errorMessage, successMessage, isAuthenticated } =
    useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário
    setLoading(true); // Inicia o carregamento
    const success = await handleLogin(email, password);

    if (success) {
      setIsAuthenticated(isAuthenticated); // Atualiza o estado no componente pai
      onLoginSuccessful(); // Chama o callback do login bem-sucedido
      hideLoginPainel(); // Oculta o painel de login
    }
    setLoading(false); // Finaliza o carregamento
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
