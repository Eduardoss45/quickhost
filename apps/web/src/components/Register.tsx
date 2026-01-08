// * Trocar para usar novo hook e validação com react-hook-form e zod

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import useCadastro from '../hooks/useCadastro';
import bg from '../image/login.png';
import './css/Cadastro.css';

function Register() {
  const { formData, loading, error, success, handleChange, handleSubmit } = useCadastro();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = event => {
    event.preventDefault();
    if (formData.password === formData.confirmPassword) {
      setErrorPassword(false);
      handleSubmit(event);
    } else {
      setErrorPassword(true);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  useEffect(() => {
    if (success) {
      navigate('/');
    }
  }, [success, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (errorPassword) {
        console.log('Por favor, confirme a senha antes de prosseguir.');
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [errorPassword]);

  return (
    <div className="registration-container">
      <div className="registration-form">
        <h1>Cadastre-se</h1>
        <p className="login-link">
          Já tem uma conta? <Link to="/entrar">Faça Login</Link>
        </p>

        <form onSubmit={handleFormSubmit}>
          {error?.username && <p className="error">{error?.username}</p>}
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

          {error?.email && <p className="error">{error?.email}</p>}
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

          {error?.cpf && <p className="error">{error?.cpf}</p>}
          <label htmlFor="cpf">CPF</label>
          <input
            type="text"
            id="cpf"
            placeholder="Digite seu CPF (11 Digitos)"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            required
          />

          {error?.birth_date && <p className="error">{error?.birth_date}</p>}
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

          {error?.password && <p className="error">{error?.password}</p>}
          <label htmlFor="password">Senha</label>
          <div className="input-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Digite sua senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          {errorPassword && (
            <p className="error">Por favor, confirme a senha antes de prosseguir.</p>
          )}
          <label htmlFor="confirmPassword">Confirme sua senha</label>
          <div className="input-container">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
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
              {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
            </button>
          </div>

          <p className="terms">
            Concordo com os <Link to="#">Termos de Serviço</Link> e a{' '}
            <Link to="#">Política de Privacidade</Link>.
          </p>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Aguarde...' : 'Cadastrar'}
          </button>
          {success && <p className="success">Usuário cadastrado com sucesso!</p>}
        </form>
      </div>
      <div className="registration-image">
        <img src={bg} alt="Imagem de um ambiente agradável" />
      </div>
    </div>
  );
}

export default Register;
