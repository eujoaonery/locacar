import React, { useEffect, useState } from 'react';
import { clientsApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import type { Client } from '../types';
import { toast } from 'react-hot-toast';

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Client | null>(null);
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

      <div className="bg-dark-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Telefone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Endereço</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">RG</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">CPF</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-dark-700/50">
                <td className="px-6 py-4 text-sm">{cliente.name}</td>
                <td className="px-6 py-4 text-sm">{cliente.phone}</td>
                <td className="px-6 py-4 text-sm">{cliente.address}</td>
                <td className="px-6 py-4 text-sm">{cliente.rg}</td>
                <td className="px-6 py-4 text-sm">{cliente.cpf}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button 
                    className="btn-secondary mr-2"
                    onClick={() => handleEditar(cliente)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-outline text-red-500 hover:bg-red-500/10"
                    onClick={() => handleExcluir(cliente.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {clienteEditando ? 'Editar' : 'Novo'} Cliente
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
                <label className="block text-sm font-medium mb-1">Telefone</label>
                <input
                  type="tel"
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Endereço</label>
                <textarea
                  className="input"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RG</label>
                <input
                  type="text"
                  className="input"
                  value={form.rg}
                  onChange={(e) => setForm({ ...form, rg: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPF</label>
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

export default Clientes;