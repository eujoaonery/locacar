import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleMobileSidebar: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar, title }) => {
  const { user } = useAuth();
  
  return (
    <header className="bg-dark-800 border-b border-dark-700 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <button 
          className="lg:hidden mr-4 text-gray-400 hover:text-white"
          onClick={toggleMobileSidebar}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-primary w-4 h-4 flex items-center justify-center text-white text-xs rounded-full">
            3
          </span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-white">{user?.email?.split('@')[0]}</div>
            <div className="text-xs text-gray-400">Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;