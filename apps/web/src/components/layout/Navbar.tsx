import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SlDirections } from 'react-icons/sl';
import { FaUser } from 'react-icons/fa';
import { IoBedOutline, IoChatbubbleOutline } from 'react-icons/io5';
import { useUser } from '@/hooks/new/useUser';

import NavButton from '../custom/NavButton';
import FloatingMenu from '../../pages/FloatingMenu';
import useNavbar from '../../hooks/useNavbar';
import useUserData from '../../hooks/useUserData';
import { authStore } from '@/store/auth.store';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

import logo from '../../image/logo.png';

const Navbar = () => {
  const location = useLocation();
  const { logout } = useUser();

  const { user } = authStore(state => state);
  const isAuthenticated = Boolean(user);

  const { userData } = useUserData();

  const [userAvatarUrl, setUserAvatarUrl] = useState('');
  const [userDisplayName, setUserDisplayName] = useState('');

  const { showLoginPainel, showUserRegistration, initializePageState } = useNavbar();

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Menu do usuário"
              className="rounded border border-white p-1.5 focus:outline-none focus:ring-2 focus:ring-white/70"
            >
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
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-0 bg-white border-none">
            <FloatingMenu
              isAuthenticated={isAuthenticated}
              name={userDisplayName || undefined}
              profilePicture={userAvatarUrl || undefined}
              onLoginClick={showLoginPainel}
              onSignUpClick={showUserRegistration}
              onLogout={logout}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Navbar;
