import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SlDirections } from 'react-icons/sl';
import { FaUser } from 'react-icons/fa';
import { IoBedOutline, IoChatbubbleOutline } from 'react-icons/io5';

import NavButton from '../custom/NavButton';
import MenuFlutuante from '../../pages/FloatingMenu';
import useNavbar from '../../hooks/useNavbar';
import useUserData from '../../hooks/useUserData';
import { authStore } from '@/store/auth.store';

import logo from '../../image/logo.png';

const Navbar = () => {
  const location = useLocation();

  const { user } = authStore(state => state);
  const isAuthenticated = Boolean(user);

  const { userData } = useUserData();

  const [userAvatarUrl, setUserAvatarUrl] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('');

  const {
    isMenuOpen,
    toggleMenuVisibility,
    showLoginPainel,
    showUserRegistration,
    initializePageState,
  } = useNavbar();

  useEffect(() => {
    initializePageState();
  }, [location.pathname, initializePageState]);

  useEffect(() => {
    if (!userData) return;

    setUserAvatarUrl(userData.profile_picture ?? '');
    setUserDisplayName(userData.username ?? '');
  }, [userData]);

  return (
    <header className="flex items-center justify-between bg-orange-400 p-5">
      <Link to="/">
        <img className="w-36" src={logo} alt="Logo QuickHost" />
      </Link>

      <nav className="flex items-center gap-6">
        {isAuthenticated && (
          <>
            <Link to="/reservations">
              <NavButton icon={<IoBedOutline />} label="Reservas" />
            </Link>

            <Link to="/host">
              <NavButton icon={<SlDirections />} label="Hospedar" />
            </Link>

            <Link to="/chat">
              <NavButton icon={<IoChatbubbleOutline />} label="Mensagens" />
            </Link>
          </>
        )}

        <div className="flex items-center justify-center rounded border border-white p-1.5">
          <button onClick={toggleMenuVisibility} aria-label="Menu do usuário">
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="Avatar do usuário"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-2xl text-white" />
            )}
          </button>

          {isMenuOpen && (
            <MenuFlutuante
              isAuthenticated={isAuthenticated}
              name={userDisplayName || undefined}
              profilePicture={userAvatarUrl || undefined}
              onLoginClick={showLoginPainel}
              onCadastroClick={showUserRegistration}
            />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
