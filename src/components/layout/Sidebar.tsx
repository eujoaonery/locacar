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
  X,
  UserCog,
  ChevronRight,
  Info,
  BarChart3
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
  const { logout, user } = useAuth();

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { label: 'Veículos', icon: <Car size={20} />, path: '/veiculos' },
    { label: 'Clientes', icon: <Users size={20} />, path: '/clientes' },
    { label: 'Contratos', icon: <FileText size={20} />, path: '/contratos' },
    { label: 'Categorias', icon: <Tag size={20} />, path: '/categorias' },
    { label: 'Status', icon: <AlertCircle size={20} />, path: '/status' },
    { label: 'Relatórios', icon: <BarChart3 size={20} />, path: '/relatorios' },
    { label: 'Usuários', icon: <UserCog size={20} />, path: '/usuarios' },
  ];

  const systemItems = [
    { label: 'Sobre', icon: <Info size={20} />, path: '/sobre' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div 
        className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileSidebar}
      />
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-neutral-200 z-50
        transform transition-transform duration-300 ease-out
        lg:translate-x-0 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-uber-lg lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Car size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">LocaCar</h1>
              <p className="text-xs text-neutral-500">Sistema de Locação</p>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            onClick={toggleMobileSidebar}
          >
            <X size={20} className="text-neutral-600" />
          </button>
        </div>
        
        {/* User info */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">
                {user?.email?.split('@')[0] || 'Usuário'}
              </p>
              <p className="text-xs text-neutral-500">Administrador</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-6">
            {/* Main Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
                Sistema
              </h3>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        nav-link group relative
                        ${isActive ? 'nav-link-active' : ''}
                      `}
                      onClick={() => isMobileSidebarOpen && toggleMobileSidebar()}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" 
                      />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* System Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 px-3">
                Sistema
              </h3>
              <ul className="space-y-1">
                {systemItems.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `
                        nav-link group relative
                        ${isActive ? 'nav-link-active' : ''}
                      `}
                      onClick={() => isMobileSidebarOpen && toggleMobileSidebar()}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="flex-shrink-0">
                          {item.icon}
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronRight 
                        size={16} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400" 
                      />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        
        {/* Logout button */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            className="nav-link w-full text-error-600 hover:bg-error-50 hover:text-error-700"
          >
            <LogOut size={20} />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;