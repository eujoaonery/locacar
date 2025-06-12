import React, { useState, useEffect } from 'react';
import { contractsApi, vehiclesApi, clientsApi } from '../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Carregando from '../components/ui/Loader';
import ContractDetailsModal from '../components/contracts/ContractDetailsModal';
import type { Contract, Vehicle, Client } from '../types';
import { toast } from 'react-hot-toast';
import { FileText, Download, Eye } from 'lucide-react';
import { generateContractPDF } from '../utils/pdf';

const Contratos: React.FC = () => {
  const [contratos, setContratos] = useState<Contract[]>([]);
  const [veiculos, setVeiculos] = useState<Vehicle[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
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

  const handleViewDetails = (contrato: Contract) => {
    setSelectedContract(contrato);
    setDetailsModalOpen(true);
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
        <h2 className="text-2xl font-bold">Contratos</h2>
        <button 
          className="btn-primary"
          onClick={() => setModalAberto(true)}
        >
          Novo Contrato
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Veículo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Início
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Fim
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {contratos.map((contrato) => (
              <tr key={contrato.id} className="hover:bg-neutral-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm">
                  <span className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">
                    #{String(contrato.id).padStart(4, '0')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-neutral-900">{contrato.client?.name}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">
                  {contrato.vehicle?.brand} {contrato.vehicle?.model}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-900">
                  {format(new Date(contrato.start_date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-900">
                  {format(new Date(contrato.end_date), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-success-600">
                    R$ {contrato.total.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="btn-outline mr-2"
                      onClick={() => handleViewDetails(contrato)}
                      title="Ver detalhes do contrato"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleDownloadPDF(contrato)}
                      title="Baixar PDF"
                    >
                      <Download size={16} className="mr-2" />
                      PDF
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
                Novo Contrato de Locação
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
                  <label className="label">Cliente</label>
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
                <div className="form-group">
                  <label className="label">Veículo</label>
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
                <div className="form-group">
                  <label className="label">Data de Início</label>
                  <input
                    type="date"
                    className="input"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    required
                    min={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Data de Fim</label>
                  <input
                    type="date"
                    className="input"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    required
                    min={form.start_date}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Total</label>
                  <input
                    type="text"
                    className="input"
                    value={`R$ ${form.total.toFixed(2)}`}
                    disabled
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
                  Gerar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedContract && (
        <ContractDetailsModal
          contract={selectedContract}
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false);
            setSelectedContract(null);
          }}
        />
      )}
    </div>
  );
};

export default Contratos;