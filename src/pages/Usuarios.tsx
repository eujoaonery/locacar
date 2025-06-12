import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Carregando from '../components/ui/Loader';
import { toast } from 'react-hot-toast';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  role?: string;
}

const Usuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<AuthUser[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const buscarUsuarios = async () => {
    try {
      // Buscar usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (user) {
        setUsuarios([{
          id: user.id,
          email: user.email || '',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at,
          role: 'Admin'
        }]);
      }
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar usuários');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      toast.success('Usuário criado com sucesso!');
      setModalAberto(false);
      setForm({ email: '', password: '', confirmPassword: '' });
      buscarUsuarios();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar usuário');
    }
  };

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Carregando size="large" />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Erro</h3>
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Usuários do Sistema</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setForm({ email: '', password: '', confirmPassword: '' });
            setModalAberto(true);
          }}
        >
          Adicionar Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuarios.map((usuario) => (
          <div key={usuario.id} className="card p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                {usuario.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{usuario.email.split('@')[0]}</h3>
                <p className="text-sm text-gray-400">{usuario.role || 'Usuário'}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail size={16} className="text-gray-400" />
                <span>{usuario.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <Calendar size={16} className="text-gray-400" />
                <span>
                  Criado em {format(new Date(usuario.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
              
              {usuario.last_sign_in_at && (
                <div className="flex items-center space-x-2 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span>
                    Último acesso: {format(new Date(usuario.last_sign_in_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm">
                <Shield size={16} className="text-green-500" />
                <span className="text-green-500">
                  {usuario.email_confirmed_at ? 'Email confirmado' : 'Email pendente'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-dark-700">
              <div className="text-xs text-gray-500">
                ID: {usuario.id.substring(0, 8)}...
              </div>
            </div>
          </div>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
          <p className="text-gray-400">Adicione o primeiro usuário ao sistema</p>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Novo Usuário</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="usuario@exemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Senha</label>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirmar Senha</label>
                <input
                  type="password"
                  className="input"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                  placeholder="Digite a senha novamente"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;