import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Carregando from '../components/ui/Loader';
import { User, Mail, Key, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AuthUserInfo {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
}

const VerificarUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<AuthUserInfo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const buscarUsuariosAuth = async () => {
    try {
      // Primeiro, vamos tentar obter informações do usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Erro ao obter usuário:', userError);
      }

      if (user) {
        setUsuarios([{
          id: user.id,
          email: user.email || 'Email não disponível',
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          email_confirmed_at: user.email_confirmed_at
        }]);
      } else {
        // Se não há usuário logado, vamos tentar uma consulta administrativa
        // Nota: Isso só funcionará se o usuário atual tiver permissões administrativas
        try {
          const { data, error } = await supabase.auth.admin.listUsers();
          
          if (error) {
            throw new Error('Não foi possível acessar a lista de usuários. Você precisa estar logado como administrador.');
          }
          
          if (data && data.users) {
            setUsuarios(data.users.map(u => ({
              id: u.id,
              email: u.email || 'Email não disponível',
              created_at: u.created_at,
              last_sign_in_at: u.last_sign_in_at,
              email_confirmed_at: u.email_confirmed_at
            })));
          }
        } catch (adminError) {
          setErro('Não foi possível acessar informações de usuários. Faça login primeiro.');
        }
      }
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar informações de usuários');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarUsuariosAuth();
  }, []);

  if (carregando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Carregando size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-900/30 border border-yellow-800 text-yellow-200 p-4 rounded-md">
        <div className="flex items-center space-x-2">
          <AlertCircle size={20} />
          <h3 className="text-lg font-semibold">Informações de Usuários do Sistema</h3>
        </div>
        <p className="mt-2 text-sm">
          Esta página mostra os usuários cadastrados no sistema de autenticação do Supabase.
        </p>
      </div>

      {erro && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Erro</h3>
          <p>{erro}</p>
          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-800 rounded">
            <h4 className="font-semibold mb-2">💡 Dica para recuperar acesso:</h4>
            <p className="text-sm">
              Se você esqueceu suas credenciais, você pode:
            </p>
            <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Verificar o arquivo <code>.env</code> para as configurações do Supabase</li>
              <li>Acessar o painel do Supabase em <a href="https://supabase.com" className="text-blue-400 underline">supabase.com</a></li>
              <li>Ir em Authentication → Users para ver os usuários cadastrados</li>
              <li>Criar um novo usuário através do painel administrativo</li>
            </ul>
          </div>
        </div>
      )}

      {usuarios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {usuarios.map((usuario) => (
            <div key={usuario.id} className="card p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {usuario.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Usuário do Sistema</h3>
                  <p className="text-sm text-gray-400">Administrador</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <span className="font-mono bg-dark-700 px-2 py-1 rounded">
                    {usuario.email}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <User size={16} className="text-gray-400" />
                  <span>
                    Criado em {format(new Date(usuario.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </span>
                </div>
                
                {usuario.last_sign_in_at && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Key size={16} className="text-green-400" />
                    <span>
                      Último login: {format(new Date(usuario.last_sign_in_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm">
                  <AlertCircle size={16} className={usuario.email_confirmed_at ? "text-green-500" : "text-yellow-500"} />
                  <span className={usuario.email_confirmed_at ? "text-green-500" : "text-yellow-500"}>
                    {usuario.email_confirmed_at ? 'Email confirmado' : 'Email não confirmado'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-dark-700">
                <div className="text-xs text-gray-500 font-mono">
                  ID: {usuario.id}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-900/30 border border-blue-800 text-blue-200 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">📋 Informações Importantes</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Sistema:</strong> LocaCar - Sistema de Locadora de Veículos</p>
          <p><strong>Autenticação:</strong> Supabase Auth</p>
          <p><strong>Banco de Dados:</strong> PostgreSQL (Supabase)</p>
          <p><strong>Desenvolvido por:</strong> João Nery e Cristhian (UNIVEM)</p>
        </div>
      </div>

      <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">🔐 Como Recuperar Acesso</h3>
        <div className="space-y-2 text-sm">
          <p><strong>1. Painel Supabase:</strong> Acesse seu projeto no Supabase Dashboard</p>
          <p><strong>2. Authentication:</strong> Vá para a seção "Authentication" → "Users"</p>
          <p><strong>3. Visualizar Usuários:</strong> Você verá todos os usuários cadastrados</p>
          <p><strong>4. Reset de Senha:</strong> Use a opção "Send reset password email"</p>
          <p><strong>5. Novo Usuário:</strong> Crie um novo usuário através do botão "Add user"</p>
        </div>
      </div>
    </div>
  );
};

export default VerificarUsuarios;