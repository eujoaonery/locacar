import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, DollarSign } from 'lucide-react';
import { contractsApi } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Carregando from '../ui/Loader';
import type { Contract, Vehicle } from '../../types';

interface VehicleHistoryModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleHistoryModal: React.FC<VehicleHistoryModalProps> = ({
  vehicle,
  isOpen,
  onClose
}) => {
  const [contratos, setContratos] = useState<Contract[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && vehicle.id) {
      buscarHistoricoVeiculo();
    }
  }, [isOpen, vehicle.id]);

  const buscarHistoricoVeiculo = async () => {
    try {
      setCarregando(true);
      const todosContratos = await contractsApi.getAll();
      const contratosVeiculo = todosContratos.filter(
        contrato => contrato.vehicle_id === vehicle.id
      );
      setContratos(contratosVeiculo);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar histórico do veículo');
    } finally {
      setCarregando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">Histórico de Contratos</h3>
            <p className="text-neutral-600 mt-1">
              {vehicle.brand} {vehicle.model} - {vehicle.license_plate}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 rounded-lg hover:bg-neutral-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {carregando ? (
            <div className="flex justify-center items-center h-32">
              <Carregando size="large" />
            </div>
          ) : erro ? (
            <div className="bg-error-50 border border-error-200 text-error-700 p-4 rounded-xl">
              <p>{erro}</p>
            </div>
          ) : contratos.length === 0 ? (
            <div className="text-center py-12">
              <FileText size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nenhum contrato encontrado</h3>
              <p className="text-neutral-600">Este veículo ainda não foi alugado</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Resumo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {contratos.length}
                    </div>
                    <div className="text-sm text-neutral-600">Total de Contratos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                      R$ {contratos.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-neutral-600">Receita Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600">
                      {contratos.reduce((sum, c) => {
                        const start = new Date(c.start_date);
                        const end = new Date(c.end_date);
                        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
                        return sum + days;
                      }, 0)}
                    </div>
                    <div className="text-sm text-neutral-600">Total de Dias Alugado</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">ID Contrato</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Cliente</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Data Início</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Data Fim</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {contratos.map((contrato) => (
                      <tr key={contrato.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 text-sm">
                          <span className="font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-900">
                            #{String(contrato.id).padStart(4, '0')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">{contrato.client?.name}</td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          {format(new Date(contrato.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">
                          {format(new Date(contrato.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-success-600">
                          R$ {contrato.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleHistoryModal;