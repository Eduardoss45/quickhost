import { FaGithub, FaInstagram } from 'react-icons/fa';
import logo from '../../image/logo-black.png';

function Footer() {
  return (
    <footer className="flex-col p-5">
      <div className="flex justify-between mx-5 items-center">
        <div className="flex items-center gap-5 justify-between ">
          <div>
            <img className="w-35" src={logo} alt="Quick Host Logo" />
          </div>
          <nav className="flex gap-4">
            <a href="#inicio">Início</a>
            <a href="#reservas">Reservas</a>
            <a href="#hospedar">Hospedar</a>
            <a href="#mensagens">Mensagens</a>
          </nav>
        </div>
        <div className="flex gap-3">
          <a href="https://github.com/Eduardoss45/quickhost" target="blank">
            <FaGithub className="text-3xl" />
          </a>
          <a href="https://www.instagram.com/quickhost_/" target="blank">
            <FaInstagram className="text-3xl" />
          </a>
        </div>
      </div>
      <div className="flex flex-row mx-5 my-2.5 justify-between">
        <div className="flex gap-2">
          <p>&copy; 2024 Quick Host</p>
          <a href="#termos">Termos</a>
          <a href="#privacidade">Privacidade</a>
          <a href="#cookies">Cookies</a>
        </div>
        <div className="flex gap-2">
          <a href="#termos">Início</a>
          <a href="#privacidade">Reservas</a>
          <a href="#cookies">Hospedar</a>
          <a href="#cookies">Mensagens</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
