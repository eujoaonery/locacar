import React, { useState } from 'react';
import { Car } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Loader from '../ui/Loader';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Falha ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-dark-900">
      <div className="max-w-md w-full space-y-8 bg-dark-800 p-8 rounded-lg border border-dark-700 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <Car size={48} className="text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Entrar no LocaCar
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Digite suas credenciais para acessar sua conta
          </p>
          <p className="mt-2 text-xs text-primary">
            Aplicativo Desenvolvido por alunos do UNIVEM
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 bg-dark-700 border-dark-600 rounded text-primary focus:ring-primary"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-300">
                Lembrar-me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-400">
                Esqueceu sua senha?
              </a>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center py-3"
            >
              {isLoading ? (
                <Loader size="small" />
              ) : (
                <span>Entrar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;