import React, { useState } from 'react';
import { X, FileText, Download, Filter, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import Carregando from '../ui/Loader';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (type: string, filters?: any) => Promise<void>;
}

const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  onGenerateReport
}) => {
  const [selectedReport, setSelectedReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    category: '',
    year: ''
  });

  const reportTypes = [
    {
      id: 'vehicles',
      name: 'Relatório de Veículos',
      description: 'Lista completa da frota com status e categorias',
      icon: '🚗',
      hasFilters: true,
      filterTypes: ['status', 'category', 'year']
    },
    {
      id: 'clients',
      name: 'Relatório de Clientes',
      description: 'Cadastro completo de todos os clientes',
      icon: '👥',
      hasFilters: false
    },
    {
      id: 'contracts',
      name: 'Relatório de Contratos',
      description: 'Histórico de locações e faturamento',
      icon: '📋',
      hasFilters: true,
      filterTypes: ['startDate', 'endDate']
    },
    {
      id: 'categories',
      name: 'Relatório de Categorias',
      description: 'Análise de categorias e valores de diária',
      icon: '🏷️',
      hasFilters: false
    },
    {
      id: 'status',
      name: 'Relatório de Status',
      description: 'Distribuição de veículos por status',
      icon: '📊',
      hasFilters: false
    },
    {
      id: 'dashboard',
      name: 'Relatório Geral',
      description: 'Visão consolidada de todas as operações',
      icon: '📈',
      hasFilters: false
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) return;
    
    setIsGenerating(true);
    try {
      const reportType = reportTypes.find(r => r.id === selectedReport);
      const reportFilters = reportType?.hasFilters ? filters : undefined;
      
      await onGenerateReport(selectedReport, reportFilters);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFilterInputs = () => {
    const reportType = reportTypes.find(r => r.id === selectedReport);
    if (!reportType?.hasFilters) return null;

    return (
      <div className="mt-6 p-4 bg-neutral-50 rounded-xl">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={16} className="text-neutral-600" />
          <h4 className="font-medium text-neutral-900">Filtros</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportType.filterTypes?.includes('startDate') && (
            <div className="form-group">
              <label className="label">Data Inicial</label>
              <input
                type="date"
                className="input"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
          )}
          
          {reportType.filterTypes?.includes('endDate') && (
            <div className="form-group">
              <label className="label">Data Final</label>
              <input
                type="date"
                className="input"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          )}
          
          {reportType.filterTypes?.includes('status') && (
            <div className="form-group">
              <label className="label">Status</label>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">Todos os status</option>
                <option value="Disponível">Disponível</option>
                <option value="Alugado">Alugado</option>
                <option value="Em Manutenção">Em Manutenção</option>
                <option value="Reservado">Reservado</option>
              </select>
            </div>
          )}
          
          {reportType.filterTypes?.includes('category') && (
            <div className="form-group">
              <label className="label">Categoria</label>
              <select
                className="input"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">Todas as categorias</option>
                <option value="Econômico">Econômico</option>
                <option value="Compacto">Compacto</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Grande">Grande</option>
                <option value="Premium">Premium</option>
                <option value="SUV">SUV</option>
              </select>
            </div>
          )}
          
          {reportType.filterTypes?.includes('year') && (
            <div className="form-group">
              <label className="label">Ano</label>
              <input
                type="number"
                className="input"
                value={filters.year}
                onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                placeholder="Ex: 2023"
                min="2000"
                max={new Date().getFullYear() + 1}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Gerador de Relatórios</h3>
              <p className="text-neutral-600 mt-1">Exporte dados em PDF com layout profissional</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 rounded-lg hover:bg-neutral-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">Selecione o tipo de relatório</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => (
                  <div
                    key={report.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedReport === report.id
                        ? 'border-primary bg-primary-50'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{report.icon}</div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-neutral-900 mb-1">{report.name}</h5>
                        <p className="text-sm text-neutral-600">{report.description}</p>
                        {report.hasFilters && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 bg-accent-100 text-accent-700 text-xs rounded-lg">
                              <Filter size={12} className="mr-1" />
                              Filtros disponíveis
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedReport && getFilterInputs()}

            {selectedReport && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">i</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-1">Sobre este relatório</h5>
                    <p className="text-sm text-blue-800">
                      {reportTypes.find(r => r.id === selectedReport)?.description}
                    </p>
                    <p className="text-xs text-blue-700 mt-2">
                      O arquivo PDF será baixado automaticamente após a geração.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-neutral-200 bg-neutral-50">
          <div className="text-sm text-neutral-600">
            <Calendar size={16} className="inline mr-1" />
            Gerado em: {format(new Date(), 'dd/MM/yyyy HH:mm')}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="btn-outline"
              disabled={isGenerating}
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={!selectedReport || isGenerating}
              className="btn-primary"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <Carregando size="small" />
                  <span>Gerando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Download size={16} />
                  <span>Gerar Relatório</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;