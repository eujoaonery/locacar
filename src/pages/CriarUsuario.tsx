import React, { useState } from 'react';
import { createJoaoUser } from '../utils/createUser';
import { User, Mail, Key, CheckCircle } from 'lucide-react';
import Carregando from '../components/ui/Loader';

const CriarUsuario: React.FC = () => {
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleCriarUsuario = async () => {
    setCarregando(true);
    setErro(null);
    setSucesso(false);

    try {
      await createJoaoUser();
      setSucesso(true);
    } catch (error: any) {
      setErro(error.message || 'Erro ao criar usuário');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-dark-900">
      <div className="max-w-md w-full space-y-8 bg-dark-800 p-8 rounded-lg border border-dark-700 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <User size={48} className="text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Criar Novo Usuário
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sistema LocaCar - UNIVEM
          </p>
        </div>

        <div className="space-y-6">
          {!sucesso && !carregando && (
            <div className="bg-blue-900/30 border border-blue-800 text-blue-200 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">📋 Credenciais do Novo Usuário</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="font-mono bg-dark-700 px-2 py-1 rounded text-sm">
                    joao@criativfy.com.br
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Key size={16} className="text-gray-400" />
                  <span className="font-mono bg-dark-700 px-2 py-1 rounded text-sm">
                    12345678
                  </span>
                </div>
              </div>
            </div>
          )}

          {erro && (
            <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2">❌ Erro</h3>
              <p className="text-sm">{erro}</p>
            </div>
          )}

          {sucesso && (
            <div className="bg-green-900/30 border border-green-800 text-green-200 p-4 rounded-md">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle size={20} />
                <h3 className="text-lg font-semibold">✅ Usuário Criado com Sucesso!</h3>
              </div>
              <p className="text-sm mb-3">
                O usuário foi criado e já pode fazer login no sistema.
              </p>
              <div className="bg-green-800/30 p-3 rounded">
                <p className="text-sm font-semibold">Credenciais de Login:</p>
                <p className="text-sm">📧 Email: joao@criativfy.com.br</p>
                <p className="text-sm">🔑 Senha: 12345678</p>
              </div>
            </div>
          )}

          {!sucesso && (
            <button
              onClick={handleCriarUsuario}
              disabled={carregando}
              className="btn-primary w-full flex justify-center py-3"
            >
              {carregando ? (
                <Carregando size="small" />
              ) : (
                <span>Criar Usuário João</span>
              )}
            </button>
          )}

          {sucesso && (
            <div className="space-y-3">
              <a
                href="/login"
                className="btn-primary w-full flex justify-center py-3"
              >
                Ir para Login
              </a>
              <button
                onClick={() => window.location.reload()}
                className="btn-outline w-full flex justify-center py-3"
              >
                Criar Outro Usuário
              </button>
            </div>
          )}
        </div>

        <div className="bg-gray-900/50 border border-gray-700 p-4 rounded-md">
          <h3 className="text-sm font-semibold mb-2">ℹ️ Informações</h3>
          <div className="space-y-1 text-xs text-gray-400">
            <p>• O usuário será criado no sistema de autenticação do Supabase</p>
            <p>• Não é necessário confirmação por email</p>
            <p>• O usuário terá acesso completo ao sistema LocaCar</p>
            <p>• Desenvolvido por João Nery e Cristhian (UNIVEM)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriarUsuario;