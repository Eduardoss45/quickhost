import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

import "./PainelFlutuanteLogin.css";

const PainelFlutuanteLogin = ({
  closeLoginPanel, // Alterado aqui
  onLoginSuccess,
  openCadastro,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/token/", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("id_user", response.data.user.id_user);

      // Necessarios para depuração
      console.log("Access Token:", localStorage.getItem("token"));
      console.log("Refresh Token:", localStorage.getItem("refreshToken"));
      console.log("User ID:", localStorage.getItem("id_user"));

      onLoginSuccess();
      closeLoginPanel(); // Alterado aqui
    } catch (err) {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div id="painel-flutuante">
      <div id="painel-login">
        <div id="top-painel">
          <span onClick={closeLoginPanel}>
            {" "}
            {/* Alterado aqui */}
            <IoMdClose />
          </span>
          Entrar ou Cadastrar-se
        </div>
        <div id="form-login">
          <h1>Bem-vindo ao Quick Host</h1>
          {error && <p className="error message">{error}</p>}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              id="btn-submit-login"
              type="submit"
              value="Log in"
              onClick={handleLogin}
            />
          </div>
          <p>
            Não possui conta?{" "}
            <Link to="/cadastro" onClick={openCadastro}>
              Criar
            </Link>
          </p>
          <p>
            <Link to="/senha" onClick={openCadastro}>
              Esqueci a senha
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PainelFlutuanteLogin;
