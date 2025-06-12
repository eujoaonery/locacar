import React from 'react';
import { Menu, Bell, Search, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleMobileSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar, title }) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-6 sticky top-0 z-30 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={toggleMobileSidebar}
          >
            <Menu size={20} className="text-neutral-600" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
            <p className="text-sm text-neutral-500 hidden sm:block">
              Gerencie seus dados de forma eficiente
            </p>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="hidden md:flex relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              className="input pl-10 pr-4 py-2 w-64 text-sm"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <Bell size={20} className="text-neutral-600" />
            <span className="absolute -top-1 -right-1 bg-error-500 w-5 h-5 flex items-center justify-center text-white text-xs rounded-full font-medium">
              3
            </span>
          </button>
          
          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <Settings size={20} className="text-neutral-600" />
          </button>
          
          {/* User menu */}
          <div className="flex items-center space-x-3 pl-3 border-l border-neutral-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-neutral-900">
                {user?.email?.split('@')[0] || 'Usuário'}
              </div>
              <div className="text-xs text-neutral-500">Administrador</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;