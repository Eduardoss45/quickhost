import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CiMenuBurger } from "react-icons/ci";
import { FaUserCircle, FaHotel } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import logo from "../image/logo.png";
import "./Navbar.css";

import MenuFlutuante from "./MenuFlutuante";
import SearchBar from "./SearchBar";
import PainelFlutuanteLogin from "./PainelFlutuanteLogin";
import useUserData from "../hooks/useUserData";

const Navbar = ({ onSearch }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isLoginPanelVisible, setIsLoginPainelVisible] = useState(false);
  const [isSearchbarVisible, setIsSearchbarVisible] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const location = useLocation();
  const token = localStorage.getItem("token");
  const id_user = localStorage.getItem("id_user");

  const { data: userData, error: userError } = useUserData(id_user, token);

  useEffect(() => {
    checkAuth();
    resetPage();
  }, [location.pathname]);

  useEffect(() => {
    if (userData) {
      setProfilePicture(userData.profile_picture || "");
    }
  }, [userData]);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        try {
          const response = await axios.post(
            "http://localhost:8000/token/refresh/",
            { refresh: refreshToken }
          );
          localStorage.setItem("token", response.data.access);
          localStorage.setItem("refreshToken", response.data.refresh);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Erro ao renovar token:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  const toggleMenu = () => setIsMenuVisible((prev) => !prev);

  const handleLoginClick = () => {
    setIsLoginPainelVisible(true);
    setIsMenuVisible(false);
    setIsSearchbarVisible(true);
  };

  const handleCadastroClick = () => {
    setIsLoginPainelVisible(false);
    setIsMenuVisible(false);
    setIsSearchbarVisible(false);
  };

  const closeLoginPanel = () => {
    setIsLoginPainelVisible(false);
    setIsSearchbarVisible(true);
  };

  const openCadastro = () => {
    setIsSearchbarVisible(false);
    setIsLoginPainelVisible(false);
  };

  const resetPage = () => {
    setIsSearchbarVisible(location.pathname === "/");
    setIsLoginPainelVisible(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    resetPage();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("id_user");
    setIsAuthenticated(false);
    setProfilePicture(""); // Limpar a foto de perfil ao sair
  };

  return (
    <>
      <header>
        <div id="top-row">
          <Link to="/">
            <img id="logo" src={logo} alt="logo da quickhost" />
          </Link>
          <nav id="nav-btn">
            <Link to="reservas/">
              <button className="btn navegacao">
                <span>
                  <MdHotel />
                  Reservas
                </span>
              </button>
            </Link>
            <Link to="/hospedar/anuncio">
              <button className="btn navegacao">
                <span>
                  <FaHotel />
                  Hospedar
                </span>
              </button>
            </Link>
            <div id="box-relativo">
              <button className="btn menu" onClick={toggleMenu}>
                <span id="hanb">
                  <CiMenuBurger />
                </span>
                <span id="user">
                  {isAuthenticated ? (
                    profilePicture ? (
                      <div id="profile">
                        <img
                          src={profilePicture}
                          alt="Profile"
                          id="profile-picture"
                        />
                      </div>
                    ) : (
                      <FaUserCircle />
                    )
                  ) : (
                    <FaUserCircle />
                  )}
                </span>
              </button>
              {isMenuVisible && (
                <MenuFlutuante
                  onLoginClick={handleLoginClick}
                  onCadastroClick={handleCadastroClick}
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </nav>
        </div>
        {isSearchbarVisible && (
          <div id="bottom-row">
            <SearchBar onSearch={onSearch} />
          </div>
        )}
      </header>
      {isLoginPanelVisible && (
        <>
          <div className="backdrop" onClick={closeLoginPanel}></div>
          <PainelFlutuanteLogin
            closeLoginPanel={closeLoginPanel}
            openCadastro={openCadastro}
            onLoginSuccess={handleLoginSuccess}
          />
        </>
      )}
    </>
  );
};

export default Navbar;
