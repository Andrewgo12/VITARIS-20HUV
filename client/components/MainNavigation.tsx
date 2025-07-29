import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Home, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface MainNavigationProps {
  userName?: string;
  userRole?: string;
  showUserMenu?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ 
  userName = "Usuario", 
  userRole = "Rol",
  showUserMenu = true 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    navigate('/login');
  };

  if (!showUserMenu) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => handleNavigation('/')}
          className="text-black hover:text-gray-800"
        >
          <Home className="w-4 h-4 mr-2" />
          {t('nav.home')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Navegación principal */}
      <Button
        variant="ghost"
        onClick={() => handleNavigation('/')}
        className="text-black hover:text-gray-800"
      >
        <Home className="w-4 h-4 mr-2" />
        {t('nav.home')}
      </Button>

      {/* Menú de usuario */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="text-black hover:text-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium">{userName}</div>
                <div className="text-xs text-gray-600">{userRole}</div>
              </div>
              <Menu className="w-4 h-4 ml-1" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-300">
          <DropdownMenuItem
            onClick={() => handleNavigation('/profile')}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
          >
            <User className="w-4 h-4" />
            <span className="text-black">{t('nav.profile')}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => handleNavigation('/settings')}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
            <span className="text-black">{t('nav.settings')}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('nav.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MainNavigation;
