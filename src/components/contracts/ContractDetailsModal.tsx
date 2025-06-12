import React from 'react';
import { X, Calendar, DollarSign, User, Car } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Contract } from '../../types';

interface ContractDetailsModalProps {
  contract: Contract;
  isOpen: boolean;
  onClose: () => void;
}

const ContractDetailsModal: React.FC<ContractDetailsModalProps> = ({
  contract,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const calcularDias = () => {
    const start = new Date(contract.start_date);
    const end = new Date(contract.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calcularValorDiario = () => {
    const dias = calcularDias();
    return dias > 0 ? contract.total / dias : 0;
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h3 className="text-xl font-semibold text-neutral-900">Detalhes do Contrato</h3>
            <p className="text-neutral-600 mt-1">
              Contrato #{String(contract.id).padStart(4, '0')}
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
          <div className="space-y-6">
            {/* Informações do Cliente */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <User size={20} className="text-primary" />
                <h4 className="text-lg font-semibold text-neutral-900">Cliente</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Nome</label>
                  <p className="font-medium text-neutral-900">{contract.client?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">CPF</label>
                  <p className="font-medium text-neutral-900">{contract.client?.cpf}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Telefone</label>
                  <p className="font-medium text-neutral-900">{contract.client?.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">RG</label>
                  <p className="font-medium text-neutral-900">{contract.client?.rg}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-neutral-500 font-medium">Endereço</label>
                  <p className="font-medium text-neutral-900">{contract.client?.address}</p>
                </div>
              </div>
            </div>

            {/* Informações do Veículo */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Car size={20} className="text-primary" />
                <h4 className="text-lg font-semibold text-neutral-900">Veículo</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Marca/Modelo</label>
                  <p className="font-medium text-neutral-900">
                    {contract.vehicle?.brand} {contract.vehicle?.model}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Ano</label>
                  <p className="font-medium text-neutral-900">{contract.vehicle?.year}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Placa</label>
                  <p className="font-medium font-mono text-neutral-900">{contract.vehicle?.license_plate}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Cor</label>
                  <p className="font-medium text-neutral-900">{contract.vehicle?.color}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Categoria</label>
                  <p className="font-medium text-neutral-900">{contract.vehicle?.category?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Status</label>
                  <span className="px-3 py-1 bg-primary text-white rounded-lg text-sm font-medium">
                    {contract.vehicle?.status?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Informações do Contrato */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Calendar size={20} className="text-primary" />
                <h4 className="text-lg font-semibold text-neutral-900">Período e Valores</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Data de Início</label>
                  <p className="font-medium text-neutral-900">
                    {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Data de Fim</label>
                  <p className="font-medium text-neutral-900">
                    {format(new Date(contract.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Quantidade de Dias</label>
                  <p className="font-medium text-neutral-900">{calcularDias()} dias</p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Valor da Diária</label>
                  <p className="font-medium text-neutral-900">R$ {calcularValorDiario().toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Valor Total */}
            <div className="bg-gradient-to-r from-success-50 to-success-100 border border-success-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign size={24} className="text-success-600" />
                  <h4 className="text-xl font-semibold text-neutral-900">Valor Total do Contrato</h4>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-success-600">
                    R$ {contract.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-neutral-600">
                    {calcularDias()} dias × R$ {calcularValorDiario().toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-neutral-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-neutral-900 mb-3">Informações Adicionais</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Data de Criação</label>
                  <p className="font-medium text-neutral-900">
                    {contract.created_at && format(new Date(contract.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-neutral-500 font-medium">Última Atualização</label>
                  <p className="font-medium text-neutral-900">
                    {contract.updated_at && format(new Date(contract.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetailsModal;