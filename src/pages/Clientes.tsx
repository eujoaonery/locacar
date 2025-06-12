import React, { useEffect, useState } from 'react';
import { clientsApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import ClientHistoryModal from '../components/clients/ClientHistoryModal';
import type { Client } from '../types';
import { toast } from 'react-hot-toast';
import { History } from 'lucide-react';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Client | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    rg: '',
    cpf: ''
  });

  const buscarClientes = async () => {
    try {
      const dados = await clientsApi.getAll();
      setClientes(dados);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar clientes');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (clienteEditando) {
        await clientsApi.update(clienteEditando.id, form);
        toast.success('Cliente atualizado com sucesso!');
      } else {
        await clientsApi.create(form);
        toast.success('Cliente criado com sucesso!');
      }
      setModalAberto(false);
      setClienteEditando(null);
      setForm({ name: '', phone: '', address: '', rg: '', cpf: '' });
      buscarClientes();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar cliente');
    }
  };

  const handleExcluir = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientsApi.delete(id);
        toast.success('Cliente excluído com sucesso!');
        buscarClientes();
      } catch (err: any) {
        toast.error(err.message || 'Erro ao excluir cliente');
      }
    }
  };

  const handleEditar = (cliente: Client) => {
    setClienteEditando(cliente);
    setForm({
      name: cliente.name,
      phone: cliente.phone,
      address: cliente.address,
      rg: cliente.rg,
      cpf: cliente.cpf
    });
    setModalAberto(true);
  };

  const handleViewHistory = (cliente: Client) => {
    setSelectedClient(cliente);
    setHistoryModalOpen(true);
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
        <h2 className="text-2xl font-bold">Clientes</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setClienteEditando(null);
            setForm({ name: '', phone: '', address: '', rg: '', cpf: '' });
            setModalAberto(true);
          }}
        >
          Adicionar Cliente
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
                Telefone
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Endereço
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                RG
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-neutral-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm font-medium text-neutral-900">{cliente.name}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{cliente.phone}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{cliente.address}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{cliente.rg}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{cliente.cpf}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="btn-outline mr-2"
                      onClick={() => handleViewHistory(cliente)}
                      title="Ver histórico de contratos"
                    >
                      <History size={16} />
                    </button>
                    <button 
                      className="btn-secondary mr-2"
                      onClick={() => handleEditar(cliente)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-outline text-error-600 hover:bg-error-50"
                      onClick={() => handleExcluir(cliente.id)}
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
                {clienteEditando ? 'Editar' : 'Novo'} Cliente
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
                  <label className="label">Telefone</label>
                  <input
                    type="tel"
                    className="input"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Endereço</label>
                  <textarea
                    className="input"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">RG</label>
                  <input
                    type="text"
                    className="input"
                    value={form.rg}
                    onChange={(e) => setForm({ ...form, rg: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">CPF</label>
                  <input
                    type="text"
                    className="input"
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    required
                    pattern="\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11}"
                    title="CPF no formato 000.000.000-00 ou 00000000000"
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

      {selectedClient && (
        <ClientHistoryModal
          client={selectedClient}
          isOpen={historyModalOpen}
          onClose={() => {
            setHistoryModalOpen(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
};

export default Clientes;