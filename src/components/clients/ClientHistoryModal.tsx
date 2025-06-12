import React, { useState, useEffect } from 'react';
import { X, FileText, Car } from 'lucide-react';
import { contractsApi } from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Carregando from '../ui/Loader';
import type { Contract, Client } from '../../types';

interface ClientHistoryModalProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

const ClientHistoryModal: React.FC<ClientHistoryModalProps> = ({
  client,
  isOpen,
  onClose
}) => {
  const [contratos, setContratos] = useState<Contract[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && client.id) {
      buscarHistoricoCliente();
    }
  }, [isOpen, client.id]);

  const buscarHistoricoCliente = async () => {
    try {
      setCarregando(true);
      const todosContratos = await contractsApi.getAll();
      const contratosCliente = todosContratos.filter(
        contrato => contrato.client_id === client.id
      );
      setContratos(contratosCliente);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar histórico do cliente');
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
              {client.name} - {client.cpf}
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
              <p className="text-neutral-600">Este cliente ainda não realizou nenhuma locação</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Resumo do Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {contratos.length}
                    </div>
                    <div className="text-sm text-neutral-600">Total de Locações</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                      R$ {contratos.reduce((sum, c) => sum + c.total, 0).toFixed(2)}
                    </div>
                    <div className="text-sm text-neutral-600">Valor Total Gasto</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600">
                      {new Set(contratos.map(c => c.vehicle_id)).size}
                    </div>
                    <div className="text-sm text-neutral-600">Veículos Diferentes</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">ID Contrato</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Carro</th>
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
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Car size={16} className="text-neutral-400" />
                            <div>
                              <span className="text-neutral-900">
                                {contrato.vehicle?.brand} {contrato.vehicle?.model}
                              </span>
                              <div className="text-xs text-neutral-500">
                                {contrato.vehicle?.license_plate}
                              </div>
                            </div>
                          </div>
                        </td>
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

export default ClientHistoryModal;