import React, { useState } from 'react';
import { Car, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../ui/Loader';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting login for:', email);
      await login(email, password);
      console.log('Login successful, navigating to dashboard');
      
      // Force navigation after successful login
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 200);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Falha ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-800 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="mb-8">
            <Car size={80} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-6 text-center">LocaCar</h1>
          <p className="text-xl text-center text-white/90 max-w-md leading-relaxed">
            Sistema completo de gerenciamento para locadoras de veículos
          </p>
          <div className="mt-12 text-center">
            <p className="text-white/80 text-sm">
              Desenvolvido por alunos do UNIVEM
            </p>
            <p className="text-white/60 text-xs mt-1">
             Curso de Ciência da Computação
            </p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <Car size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">LocaCar</h1>
          </div>
          
          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Bem-vindo de volta
              </h2>
              <p className="text-neutral-600">
                Entre com suas credenciais para acessar o sistema
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-xl text-sm animate-slide-down">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-error-500 rounded-full flex-shrink-0"></div>
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email" className="label">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={18} className="text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-12"
                    placeholder="seu@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="label">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={18} className="text-neutral-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-12 pr-12"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-neutral-700">
                    Lembrar-me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary-700 transition-colors">
                    Esqueceu sua senha?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader size="small" />
                    <span>Entrando...</span>
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-neutral-600">
                Não tem uma conta?{' '}
                <a href="#" className="font-medium text-primary hover:text-primary-700 transition-colors">
                  Entre em contato com o administrador
                </a>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500">
              © 2025 LocaCar. Sistema desenvolvido para UNIVEM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;