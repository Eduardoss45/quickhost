import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { FaUserCircle, FaHotel } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import logo from "../image/logo.png";
import "./Navbar.css";

import MenuFlutuante from "./MenuFlutuante";
import SearchBar from "./SearchBar";
import PainelFlutuanteLogin from "./PainelFlutuanteLogin";
import useUserData from "../hooks/useUserData";
import useAuth from "../hooks/useAuth";
import useNavbar from "../hooks/useNavbar";

const Navbar = ({ onSearch }) => {
  const { data: userData } = useUserData();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });
  const { profilePicture, setProfilePicture } = useAuth();

  const {
    isMenuOpen,
    isLoginPainelVisible,
    isSearchBarVisible,
    showUserRegistration,
    onLoginSuccessful,
    toggleMenuVisibility,
    showLoginPainel,
    showUserRegistrationPainel,
    hideLoginPainel,
    initializePageState,
  } = useNavbar();

  const location = useLocation();

  useEffect(() => {
    initializePageState();
  }, [location.pathname]);

  useEffect(() => {
    if (userData) {
      setProfilePicture(userData.profile_picture || "");
    }
  }, [userData, setProfilePicture]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("id_user");
    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);
    setProfilePicture("");
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
              <button className="btn menu" onClick={toggleMenuVisibility}>
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
              {isMenuOpen && (
                <MenuFlutuante
                  onLoginClick={showLoginPainel}
                  onCadastroClick={showUserRegistration}
                  isAuthenticated={isAuthenticated}
                  onLogout={handleLogout}
                />
              )}
            </div>
          </nav>
        </div>
        {isSearchBarVisible && (
          <div id="bottom-row">
            <SearchBar onSearch={onSearch} />
          </div>
        )}
      </header>
      {isLoginPainelVisible && (
        <>
          <div className="backdrop" onClick={hideLoginPainel}></div>
          <PainelFlutuanteLogin
            hideLoginPainel={hideLoginPainel}
            showUserRegistrationPainel={showUserRegistrationPainel}
            onLoginSuccessful={onLoginSuccessful}
            setIsAuthenticated={setIsAuthenticated}
          />
        </>
      )}
    </>
  );
};

export default Navbar;
