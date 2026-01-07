import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SlDirections } from "react-icons/sl";
import { FaUser } from "react-icons/fa";
import { IoBedOutline, IoChatbubbleOutline } from "react-icons/io5";
import MenuFlutuante from "./MenuFlutuante";
import useUserData from "../hooks/useUserData";
import useNavbar from "../hooks/useNavbar";
import logo from "../image/logo.png";
import './css/Navbar.css';

const Navbar = () => {
  const { userData } = useUserData();
  const [profilePicture, setProfilePicture] = useState("");
  const [name, setName] = useState("");
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const {
    isMenuOpen,
    showUserRegistration,
    toggleMenuVisibility,
    showLoginPainel,
    initializePageState,
  } = useNavbar();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    initializePageState();
  }, [location.pathname]);
  useEffect(() => {
    if (userData) {
      setProfilePicture(userData.profile_picture || "");
      setName(userData.username || "");
    }
  }, [userData, setProfilePicture, setName]);
  return (
    <>
      <header>
        <div id="top-row">
          <Link to="/">
            <img id="logo" src={logo} alt="logo da quickhost" />
          </Link>
          <nav id="nav-btn">
            <Link to={isAuthenticated ? "/reservas" : "/entrar"}>
              <button className="btn navegacao">
                <span>
                  <IoBedOutline />
                  Reservas
                </span>
              </button>
            </Link>
            <Link to={isAuthenticated ? "/hospedar" : "/entrar"}>
              <button className="btn navegacao">
                <span>
                  <SlDirections />
                  Hospedar
                </span>
              </button>
            </Link>
            <Link to={isAuthenticated ? "" : "/entrar"}>
              <button className="btn navegacao">
                <span>
                  <IoChatbubbleOutline />
                  Mensagens
                </span>
              </button>
            </Link>
            <div id="box-relativo">
              <button className="btn menu" onClick={toggleMenuVisibility}>
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
                      <FaUser />
                    )
                  ) : (
                    <FaUser />
                  )}
                </span>
              </button>
              {isMenuOpen && (
                <>
                  <MenuFlutuante
                    onLoginClick={showLoginPainel}
                    onCadastroClick={showUserRegistration}
                    onClick={toggleMenu}
                    profilePicture={profilePicture || undefined}
                    name={name || undefined}
                    isAuthenticated={isAuthenticated}
                  />
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Navbar;
