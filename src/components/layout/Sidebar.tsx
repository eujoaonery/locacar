import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Car, 
  Users, 
  FileText, 
  Tag, 
  AlertCircle, 
  LayoutDashboard, 
  LogOut, 
  X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isMobileSidebarOpen, 
  toggleMobileSidebar 
}) => {
  const { logout } = useAuth();

  const navItems = [
    { label: 'Painel', icon: <LayoutDashboard size={20} />, path: '/' },
    { label: 'Veículos', icon: <Car size={20} />, path: '/veiculos' },
    { label: 'Clientes', icon: <Users size={20} />, path: '/clientes' },
    { label: 'Contratos', icon: <FileText size={20} />, path: '/contratos' },
    { label: 'Categorias', icon: <Tag size={20} />, path: '/categorias' },
    { label: 'Status', icon: <AlertCircle size={20} />, path: '/status' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-200 ease-in-out"
        style={{ opacity: isMobileSidebarOpen ? 1 : 0, pointerEvents: isMobileSidebarOpen ? 'auto' : 'none' }}
        onClick={toggleMobileSidebar}
      />
      
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-dark-800 border-r border-dark-700 z-30
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 flex justify-between items-center border-b border-dark-700">
          <div className="flex items-center space-x-2">
            <Car size={24} className="text-primary" />
            <h1 className="text-xl font-bold text-white">LocaCar</h1>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={toggleMobileSidebar}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-3 rounded-md transition-colors
                    ${isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:bg-dark-700 hover:text-white'}
                  `}
                  onClick={() => isMobileSidebarOpen && toggleMobileSidebar()}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-dark-700">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-400 hover:bg-dark-700 hover:text-white rounded-md transition-colors"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;