import { FaGithub, FaInstagram } from 'react-icons/fa';
import logo from '../../image/logo-black.png';

function Footer() {
  return (
    <footer className="w-full p-5 bg-gray-100">
      <div className="flex justify-between items-center mx-5 mb-3">
        <div className="flex items-center gap-5">
          <img className="w-36" src={logo} alt="Quick Host Logo" />
          <nav className="flex gap-4">
            <a href="#inicio">Início</a>
            <a href="#reservas">Reservas</a>
            <a href="#hospedar">Hospedar</a>
            <a href="#mensagens">Mensagens</a>
          </nav>
        </div>
        <div className="flex gap-3">
          <a href="https://github.com/Eduardoss45/quickhost" target="_blank">
            <FaGithub className="text-3xl" />
          </a>
          <a href="https://www.instagram.com/quickhost_/" target="_blank">
            <FaInstagram className="text-3xl" />
          </a>
        </div>
      </div>
      <div className="flex justify-between mx-5">
        <div className="flex gap-2">
          <p>&copy; 2024 Quick Host</p>
          <a href="#termos">Termos</a>
          <a href="#privacidade">Privacidade</a>
          <a href="#cookies">Cookies</a>
        </div>
        <div className="flex gap-2">
          <a href="#inicio">Início</a>
          <a href="#reservas">Reservas</a>
          <a href="#hospedar">Hospedar</a>
          <a href="#mensagens">Mensagens</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
