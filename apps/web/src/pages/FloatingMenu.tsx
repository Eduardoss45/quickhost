import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

type FloatingMenuProps = {
  isAuthenticated: boolean;
  profilePicture?: string;
  name?: string;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  onLogout?: () => void;
};

const FloatingMenu = ({
  isAuthenticated,
  profilePicture,
  name,
  onLoginClick,
  onSignUpClick,
  onLogout,
}: FloatingMenuProps) => {
  if (!isAuthenticated) {
    return (
      <>
        <DropdownMenuItem asChild>
          <Link to="/register" onClick={onSignUpClick}>
            Cadastrar-se
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/login" onClick={onLoginClick}>
            Fazer login
          </Link>
        </DropdownMenuItem>
      </>
    );
  }

  return (
    <>
      <DropdownMenuLabel className="flex items-center gap-3">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt="Avatar do usuário"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <FaUser className="h-8 w-8 text-muted-foreground" />
        )}

        <span className="text-sm font-medium">{name || 'Usuário'}</span>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuItem asChild>
        <Link to="/reservas">Reservas</Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link to="/hospedar">Hospedar</Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link to="/favoritos">Favoritos</Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link to="/mensagens">Mensagens</Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link to="/configuracoes">Configurações</Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem onClick={onLogout} className="text-red-600 focus:text-red-600">
        Sair da conta
      </DropdownMenuItem>
    </>
  );
};

export default FloatingMenu;
