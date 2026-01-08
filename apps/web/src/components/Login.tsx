import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useUser } from '@/hooks/new/useUser';
import bg from '../image/login.png';

import './css/Login.css';

function Login() {
  const { login, loading } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Bem vindo(a) de volta!</h1>
        <p className="register-link">
          Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <p className="terms">
            Ao fazer login, você concorda com nossos <Link to="#">Termos de Serviço</Link> e de{' '}
            <Link to="#">Privacidade</Link>.
          </p>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Carregando...' : 'Fazer Login'}
          </button>
        </form>
      </div>
      <div className="login-image">
        <img src={bg} alt="Imagem de uma casa grande e pessoas andando no jardim" />
      </div>
    </div>
  );
}

export default Login;
