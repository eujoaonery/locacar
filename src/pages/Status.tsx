import React, { useEffect, useState } from 'react';
import { statusesApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import type { Status } from '../types';
import { toast } from 'react-hot-toast';

const Status: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [statusEditando, setStatusEditando] = useState<Status | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: ''
  });

  const buscarStatus = async () => {
    try {
      const dados = await statusesApi.getAll();
      setStatuses(dados);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar status');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (statusEditando) {
        await statusesApi.update(statusEditando.id, form);
        toast.success('Status atualizado com sucesso!');
      } else {
        await statusesApi.create(form);
        toast.success('Status criado com sucesso!');
      }
      setModalAberto(false);
      setStatusEditando(null);
      setForm({ name: '', description: '' });
      buscarStatus();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar status');
    }
  };

  const handleExcluir = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este status?')) {
      try {
        await statusesApi.delete(id);
        toast.success('Status excluído com sucesso!');
        buscarStatus();
      } catch (err: any) {
        toast.error(err.message || 'Erro ao excluir status');
      }
    }
  };

  const handleEditar = (status: Status) => {
    setStatusEditando(status);
    setForm({
      name: status.name,
      description: status.description || ''
    });
    setModalAberto(true);
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
        <h2 className="text-2xl font-bold">Status</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setStatusEditando(null);
            setForm({ name: '', description: '' });
            setModalAberto(true);
          }}
        >
          Adicionar Status
        </button>
      </div>

      <div className="bg-dark-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {statuses.map((status) => (
              <tr key={status.id} className="hover:bg-dark-700/50">
                <td className="px-6 py-4 text-sm">{status.name}</td>
                <td className="px-6 py-4 text-sm">{status.description}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button 
                    className="btn-secondary mr-2"
                    onClick={() => handleEditar(status)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-outline text-red-500 hover:bg-red-500/10"
                    onClick={() => handleExcluir(status.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-dark-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {statusEditando ? 'Editar' : 'Novo'} Status
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  className="input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Status;