import React from "react";
import { FaGithub, FaInstagram } from "react-icons/fa";
import './css/Footer.css';
import logo from "../image/logo-black.png";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <div>
          <div className="logo">
            <img src={logo} alt="Quick Host Logo" />
          </div>
          <nav className="nav">
            <a href="#inicio" className="link">
              Início
            </a>
            <a href="#reservas" className="link">
              Reservas
            </a>
            <a href="#hospedar" className="link">
              Hospedar
            </a>
            <a href="#mensagens" className="link">
              Mensagens
            </a>
          </nav>
        </div>
        <div className="social">
          <a href="https://github.com/Eduardoss45/quickhost" target="blank">
            <FaGithub className="icon" />
          </a>
          <a href="https://www.instagram.com/quickhost_/" target="blank">
            <FaInstagram className="icon" />
          </a>
        </div>
      </div>
      <div>
        <div className="bottom">
          <p>&copy; 2024 Quick Host</p>
          <a href="#termos" className="link">
            Termos
          </a>
          <a href="#privacidade" className="link">
            Privacidade
          </a>
          <a href="#cookies" className="link">
            Cookies
          </a>
        </div>
        <div className="bottom">
          <a href="#termos" className="link">
            Início
          </a>
          <a href="#privacidade" className="link">
            Reservas
          </a>
          <a href="#cookies" className="link">
            Hospedar
          </a>
          <a href="#cookies" className="link">
            Mensagens
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
