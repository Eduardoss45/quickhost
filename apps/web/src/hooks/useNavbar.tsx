import { useState } from "react";
import { useLocation } from "react-router-dom";

const useNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginPainelVisible, setIsLoginPainelVisible] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const location = useLocation();

  const toggleMenuVisibility = () => setIsMenuOpen((prev) => !prev);

  const showLoginPainel = () => {
    setIsLoginPainelVisible(true);
    setIsMenuOpen(false);
    setIsSearchBarVisible(true);
  };

  const showUserRegistration = () => {
    setIsLoginPainelVisible(false);
    setIsMenuOpen(false);
    setIsSearchBarVisible(false);
  };

  const hideLoginPainel = () => {
    setIsLoginPainelVisible(false);
    setIsSearchBarVisible(true);
  };

  const showUserRegistrationPainel = () => {
    setIsLoginPainelVisible(false);
    setIsSearchBarVisible(false);
  };

  const onLoginSuccessful = () => {
    setIsLoginPainelVisible(false);
    setIsSearchBarVisible(true);
  };

  const initializePageState = () => {
    setIsSearchBarVisible(location.pathname === "/");
    setIsLoginPainelVisible(false);
  };

  return {
    isMenuOpen,
    isLoginPainelVisible,
    isSearchBarVisible,
    toggleMenuVisibility,
    showLoginPainel,
    showUserRegistration,
    hideLoginPainel,
    initializePageState,
    onLoginSuccessful,
    showUserRegistrationPainel,
    setIsLoginPainelVisible,
    setIsSearchBarVisible,
  };
};

export default useNavbar;
