import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCalendarAlt } from "react-icons/fa";
import useCadastro from "../hooks/useCadastro"; // Usando o hook de cadastro
import bg from "../image/login.png";
import "./Cadastro.css";

function Cadastro() {
  const { formData, loading, error, success, handleChange, handleSubmit } =
    useCadastro();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Resetando os campos após o sucesso do cadastro
  useEffect(() => {
    if (success) {
      // Reset form or navigate to a different page
      navigate("/"); // Assuming resetPage is passed as prop to close the component
    }
  }, [success]);

  // Função para validar CPF
  const validateCPF = (cpf) => {
    const regex = /^\d{11}$/;
    if (!regex.test(cpf)) {
      return "CPF inválido. Deve ter 11 dígitos.";
    }
    return null;
  };

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h1>Cadastre-se</h1>
        <p className="login-link">
          Já tem uma conta? <Link to="/entrar">Faça Login</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nome de Usuário</label>
          <input
            type="text"
            id="username"
            placeholder="Digite seu nome de usuário"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            placeholder="Digite seu CPF"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
          />

          <label htmlFor="birthDate">Data de Nascimento</label>
          <div className="input-container">
            <input
              type="date"
              id="birthDate"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />
          </div>

          <label htmlFor="password">Senha</label>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Digite sua senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label htmlFor="confirmPassword">Confirme sua senha</label>
          <div className="input-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder="Digite sua senha novamente"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <p className="terms">
            Concordo com os <Link to="#">Termos de Serviço</Link> e a{" "}
            <Link to="#">Política de Privacidade</Link>.
          </p>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Aguarde..." : "Cadastrar"}
          </button>

          {error && <p className="error">{`Erro: ${error.message}`}</p>}
          {success && (
            <p className="success">Usuário cadastrado com sucesso!</p>
          )}
        </form>
      </div>
      <div className="registration-image">
        <img src={bg} alt="Imagem de um ambiente agradável" />
      </div>
    </div>
  );
}

export default Cadastro;
