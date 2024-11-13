import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { FaUserCircle, FaHotel } from "react-icons/fa";
import { MdHotel } from "react-icons/md";
import MenuFlutuante from "./MenuFlutuante";
import SearchBar from "./SearchBar";
import useUserData from "../hooks/useUserData";
import useAuth from "../hooks/useAuth";
import useNavbar from "../hooks/useNavbar";
import logo from "../image/logo.png";

import "./Navbar.css";

const Navbar = ({ onSearch }) => {
  const { userData } = useUserData();
  const Authenticated = useAuth();
  const [profilePicture, setProfilePicture] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  const {
    isMenuOpen,
    isSearchBarVisible,
    showUserRegistration,
    toggleMenuVisibility,
    showLoginPainel,
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

  return (
    <>
      <header>
        <div id="top-row">
          <Link to="/">
            <img id="logo" src={logo} alt="logo da quickhost" />
          </Link>
          <nav id="nav-btn">
            <Link to={isAuthenticated ? "reservas" : "/entrar"}>
              <button className="btn navegacao">
                <span>
                  <MdHotel />
                  Reservas
                </span>
              </button>
            </Link>
            <Link to={isAuthenticated ? "/hospedar/anuncio" : "/entrar"}>
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
    </>
  );
};

export default Navbar;
