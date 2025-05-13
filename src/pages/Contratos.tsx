import React, { useState, useEffect } from 'react';
import { contractsApi, vehiclesApi, clientsApi } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Carregando from '../components/ui/Loader';
import type { Contract, Vehicle, Client } from '../types';
import { toast } from 'react-hot-toast';
import { FileText, Download } from 'lucide-react';
import { generateContractPDF } from '../utils/pdf';

const Contratos: React.FC = () => {
  const [contratos, setContratos] = useState<Contract[]>([]);
  const [veiculos, setVeiculos] = useState<Vehicle[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({
    client_id: '',
    vehicle_id: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    total: 0
  });

  const buscarDados = async () => {
    try {
      const [contratosData, veiculosData, clientesData] = await Promise.all([
        contractsApi.getAll(),
        vehiclesApi.getAll(),
        clientsApi.getAll()
      ]);
      setContratos(contratosData);
      setVeiculos(veiculosData.filter(v => v.status?.name === 'Disponível'));
      setClientes(clientesData);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar dados');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const calcularTotal = async () => {
    if (form.vehicle_id && form.start_date && form.end_date) {
      try {
        const total = await contractsApi.calculateTotal(
          parseInt(form.vehicle_id),
          form.start_date,
          form.end_date
        );
        setForm(prev => ({ ...prev, total }));
      } catch (err) {
        console.error('Erro ao calcular total:', err);
      }
    }
  };

  useEffect(() => {
    calcularTotal();
  }, [form.vehicle_id, form.start_date, form.end_date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        client_id: parseInt(form.client_id),
        vehicle_id: parseInt(form.vehicle_id)
      };

      const novoContrato = await contractsApi.create(formData);
      toast.success('Contrato criado com sucesso!');
      setModalAberto(false);
      setForm({
        client_id: '',
        vehicle_id: '',
        start_date: format(new Date(), 'yyyy-MM-dd'),
        end_date: format(new Date(), 'yyyy-MM-dd'),
        total: 0
      });
      buscarDados();

      // Gerar e baixar o PDF automaticamente
      const contrato = {
        ...novoContrato,
        client: clientes.find(c => c.id === formData.client_id),
        vehicle: veiculos.find(v => v.id === formData.vehicle_id)
      };
      generateContractPDF(contrato);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar contrato');
    }
  };

  const handleDownloadPDF = (contrato: Contract) => {
    generateContractPDF(contrato);
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
        <h2 className="text-2xl font-bold">Contratos</h2>
        <button 
          className="btn-primary"
          onClick={() => setModalAberto(true)}
        >
          Novo Contrato
        </button>
      </div>

      <div className="bg-dark-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cliente</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Veículo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Início</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Fim</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {contratos.map((contrato) => (
              <tr key={contrato.id} className="hover:bg-dark-700/50">
                <td className="px-6 py-4 text-sm">{contrato.client?.name}</td>
                <td className="px-6 py-4 text-sm">
                  {contrato.vehicle?.brand} {contrato.vehicle?.model}
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(contrato.start_date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(contrato.end_date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 text-sm">
                  R$ {contrato.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <button 
                    className="btn-secondary"
                    onClick={() => handleDownloadPDF(contrato)}
                  >
                    <Download size={16} className="mr-2" />
                    PDF
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
              Novo Contrato de Locação
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Cliente</label>
                <select
                  className="input"
                  value={form.client_id}
                  onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Veículo</label>
                <select
                  className="input"
                  value={form.vehicle_id}
                  onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um veículo</option>
                  {veiculos.map((veiculo) => (
                    <option key={veiculo.id} value={veiculo.id}>
                      {veiculo.brand} {veiculo.model} - {veiculo.license_plate}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data de Início</label>
                <input
                  type="date"
                  className="input"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  required
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Data de Fim</label>
                <input
                  type="date"
                  className="input"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  required
                  min={form.start_date}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total</label>
                <input
                  type="text"
                  className="input"
                  value={`R$ ${form.total.toFixed(2)}`}
                  disabled
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
                  Gerar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contratos;