import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FormularioLogin from './components/auth/LoginForm';
import Layout from './components/layout/Layout';
import Painel from './pages/Dashboard';
import Carregando from './components/ui/Loader';
import { useAuth } from './contexts/AuthContext';
import Veiculos from './pages/Veiculos';
import Clientes from './pages/Clientes';
import Contratos from './pages/Contratos';
import Categorias from './pages/Categorias';
import Status from './pages/Status';

const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <Carregando size="large" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<FormularioLogin />} />
      
      <Route path="/" element={
        <RotaProtegida>
          <Layout />
        </RotaProtegida>
      }>
        <Route index element={<Painel />} />
        <Route path="veiculos" element={<Veiculos />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="contratos" element={<Contratos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="status" element={<Status />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;