import React, { useState, useEffect } from 'react';
import { X, Car } from 'lucide-react';
import { vehiclesApi } from '../../services/api';
import Carregando from '../ui/Loader';
import type { Vehicle, Status } from '../../types';

interface StatusVehiclesModalProps {
  status: Status;
  isOpen: boolean;
  onClose: () => void;
}

const StatusVehiclesModal: React.FC<StatusVehiclesModalProps> = ({
  status,
  isOpen,
  onClose
}) => {
  const [veiculos, setVeiculos] = useState<Vehicle[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && status.id) {
      buscarVeiculosStatus();
    }
  }, [isOpen, status.id]);

  const buscarVeiculosStatus = async () => {
    try {
      setCarregando(true);
      const todosVeiculos = await vehiclesApi.getAll();
      const veiculosStatus = todosVeiculos.filter(
        veiculo => veiculo.status_id === status.id
      );
      setVeiculos(veiculosStatus);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar veículos do status');
    } finally {
      setCarregando(false);
    }
  };

  const getStatusColor = (statusName: string) => {
    switch (statusName) {
      case 'Disponível':
        return 'text-success-600 bg-success-100 border-success-200';
      case 'Alugado':
        return 'text-error-600 bg-error-100 border-error-200';
      case 'Em Manutenção':
        return 'text-warning-600 bg-warning-100 border-warning-200';
      case 'Reservado':
        return 'text-accent-600 bg-accent-100 border-accent-200';
      default:
        return 'text-neutral-600 bg-neutral-100 border-neutral-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">Veículos com Status</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status.name)}`}>
                {status.name}
              </span>
              {status.description && (
                <span className="text-neutral-600 text-sm">- {status.description}</span>
              )}
            </div>
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
          ) : veiculos.length === 0 ? (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nenhum veículo encontrado</h3>
              <p className="text-neutral-600">Não há veículos com este status</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Resumo do Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {veiculos.length}
                    </div>
                    <div className="text-sm text-neutral-600">Total de Veículos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600">
                      {new Set(veiculos.map(v => v.category_id)).size}
                    </div>
                    <div className="text-sm text-neutral-600">Categorias Diferentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600">
                      {Math.round(veiculos.reduce((sum, v) => sum + (v.year || 0), 0) / veiculos.length)}
                    </div>
                    <div className="text-sm text-neutral-600">Ano Médio</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Placa</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Modelo</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Ano</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Cor</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Categoria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {veiculos.map((veiculo) => (
                      <tr key={veiculo.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-neutral-900">
                          {veiculo.license_plate}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <Car size={16} className="text-neutral-400" />
                            <span className="text-neutral-900">{veiculo.brand} {veiculo.model}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-900">{veiculo.year}</td>
                        <td className="px-4 py-3 text-sm text-neutral-900">{veiculo.color}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-medium">
                            {veiculo.category?.name}
                          </span>
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

export default StatusVehiclesModal;