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
import Relatorios from './pages/Relatorios';
import Usuarios from './pages/Usuarios';
import Sobre from './pages/Sobre';
import VerificarUsuarios from './pages/VerificarUsuarios';
import CriarUsuario from './pages/CriarUsuario';

const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  console.log('RotaProtegida - User:', user?.email, 'Loading:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Carregando size="large" />
      </div>
    );
  }
  
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user, loading } = useAuth();

  console.log('App - User:', user?.email, 'Loading:', loading);

  return (
    <Routes>
      <Route path="/login" element={
        user && !loading ? <Navigate to="/" replace /> : <FormularioLogin />
      } />
      <Route path="/verificar-usuarios" element={<VerificarUsuarios />} />
      <Route path="/criar-usuario" element={<CriarUsuario />} />
      
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
        <Route path="relatorios" element={<Relatorios />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="sobre" element={<Sobre />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;