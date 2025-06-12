import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import WelcomePopup from '../ui/WelcomePopup';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { showWelcomePopup, setShowWelcomePopup } = useAuth();
  
  // Get page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/veiculos')) return 'Veículos';
    if (path.startsWith('/clientes')) return 'Clientes';
    if (path.startsWith('/contratos')) return 'Contratos'; 
    if (path.startsWith('/categorias')) return 'Categorias';
    if (path.startsWith('/status')) return 'Status';
    if (path.startsWith('/relatorios')) return 'Relatórios';
    if (path.startsWith('/usuarios')) return 'Usuários';
    if (path.startsWith('/sobre')) return 'Sobre';
    
    return 'LocaCar';
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar 
        isMobileSidebarOpen={isMobileSidebarOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
      />
      
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
        <Header 
          toggleMobileSidebar={toggleMobileSidebar} 
          title={getPageTitle()} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      
      {/* Welcome Popup */}
      <WelcomePopup 
        isOpen={showWelcomePopup}
        onClose={() => setShowWelcomePopup(false)}
      />
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;