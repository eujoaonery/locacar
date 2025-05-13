import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Get page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/vehicles')) return 'Vehicles Management';
    if (path.startsWith('/clients')) return 'Clients Management';
    if (path.startsWith('/contracts')) return 'Contracts Management'; 
    if (path.startsWith('/categories')) return 'Categories Management';
    if (path.startsWith('/statuses')) return 'Statuses Management';
    
    return 'LocaCar';
  };
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };
  
  return (
    <div className="flex h-screen bg-dark-900 text-white">
      <Sidebar 
        isMobileSidebarOpen={isMobileSidebarOpen} 
        toggleMobileSidebar={toggleMobileSidebar} 
      />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header 
          toggleMobileSidebar={toggleMobileSidebar} 
          title={getPageTitle()} 
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="container mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark-800 border-t border-dark-700 p-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://www.univem.edu.br/img/site/logo.png" 
                  alt="Univem Logo" 
                  className="h-12"
                />
                <div>
                  <p className="text-sm text-gray-400">
                    Curso - Ciência da Computação Turma 5
                  </p>
                  <p className="text-sm text-gray-400">
                    Centro Universitário Eurípides de Marília
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">
                  Desenvolvido por João Nery e Cristhian
                </p>
                <p className="text-sm text-gray-400">
                  Atividade de Desenvolvimento de Sistemas de Informação
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#FF6B00',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;