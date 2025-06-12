import React, { useEffect, useState } from 'react';
import { statusesApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import StatusVehiclesModal from '../components/status/StatusVehiclesModal';
import type { Status } from '../types';
import { toast } from 'react-hot-toast';
import { Car } from 'lucide-react';

const Status: React.FC = () => {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [statusEditando, setStatusEditando] = useState<Status | null>(null);
  const [vehiclesModalOpen, setVehiclesModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
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

  const handleViewVehicles = (status: Status) => {
    setSelectedStatus(status);
    setVehiclesModalOpen(true);
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
      <div className="card p-6 border-error-200 bg-error-50">
        <h3 className="text-lg font-semibold text-error-800 mb-2">Erro</h3>
        <p className="text-error-600">{erro}</p>
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

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {statuses.map((status) => (
              <tr key={status.id} className="hover:bg-neutral-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm font-medium text-neutral-900">{status.name}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{status.description}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="btn-outline mr-2"
                      onClick={() => handleViewVehicles(status)}
                      title="Ver veículos com este status"
                    >
                      <Car size={16} />
                    </button>
                    <button 
                      className="btn-secondary mr-2"
                      onClick={() => handleEditar(status)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-outline text-error-600 hover:bg-error-50"
                      onClick={() => handleExcluir(status.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-semibold text-neutral-900">
                {statusEditando ? 'Editar' : 'Novo'} Status
              </h3>
              <button
                onClick={() => setModalAberto(false)}
                className="btn-ghost btn-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div className="form-group">
                  <label className="label">Nome</label>
                  <input
                    type="text"
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Descrição</label>
                  <textarea
                    className="input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
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

      {selectedStatus && (
        <StatusVehiclesModal
          status={selectedStatus}
          isOpen={vehiclesModalOpen}
          onClose={() => {
            setVehiclesModalOpen(false);
            setSelectedStatus(null);
          }}
        />
      )}
    </div>
  );
};

export default Status;