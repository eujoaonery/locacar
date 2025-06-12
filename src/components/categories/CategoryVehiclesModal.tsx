import React, { useState, useEffect } from 'react';
import { X, Car } from 'lucide-react';
import { vehiclesApi } from '../../services/api';
import Carregando from '../ui/Loader';
import type { Vehicle, Category } from '../../types';

interface CategoryVehiclesModalProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

const CategoryVehiclesModal: React.FC<CategoryVehiclesModalProps> = ({
  category,
  isOpen,
  onClose
}) => {
  const [veiculos, setVeiculos] = useState<Vehicle[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && category.id) {
      buscarVeiculosCategoria();
    }
  }, [isOpen, category.id]);

  const buscarVeiculosCategoria = async () => {
    try {
      setCarregando(true);
      const todosVeiculos = await vehiclesApi.getAll();
      const veiculosCategoria = todosVeiculos.filter(
        veiculo => veiculo.category_id === category.id
      );
      setVeiculos(veiculosCategoria);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar veículos da categoria');
    } finally {
      setCarregando(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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
            <h3 className="text-xl font-semibold text-neutral-900">Veículos da Categoria</h3>
            <p className="text-neutral-600 mt-1">
              {category.name} - R$ {category.daily_rate.toFixed(2)}/dia
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
          ) : veiculos.length === 0 ? (
            <div className="text-center py-12">
              <Car size={48} className="mx-auto text-neutral-400 mb-4" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Nenhum veículo encontrado</h3>
              <p className="text-neutral-600">Não há veículos cadastrados nesta categoria</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-neutral-50 rounded-xl p-4">
                <h4 className="font-semibold text-neutral-900 mb-2">Resumo da Categoria</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {veiculos.length}
                    </div>
                    <div className="text-sm text-neutral-600">Total de Veículos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success-600">
                      {veiculos.filter(v => v.status?.name === 'Disponível').length}
                    </div>
                    <div className="text-sm text-neutral-600">Disponíveis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-error-600">
                      {veiculos.filter(v => v.status?.name === 'Alugado').length}
                    </div>
                    <div className="text-sm text-neutral-600">Alugados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning-600">
                      {veiculos.filter(v => v.status?.name === 'Em Manutenção').length}
                    </div>
                    <div className="text-sm text-neutral-600">Em Manutenção</div>
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
                      <th className="px-4 py-3 text-left text-sm font-semibold text-neutral-700">Status</th>
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
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(veiculo.status?.name || '')}`}>
                            {veiculo.status?.name}
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

export default CategoryVehiclesModal;