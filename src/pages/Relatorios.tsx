import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, BarChart3, PieChart, Users, Car, Calendar } from 'lucide-react';
import ReportsModal from '../components/reports/ReportsModal';
import { 
  vehiclesApi, 
  clientsApi, 
  contractsApi, 
  categoriesApi, 
  statusesApi, 
  dashboardApi 
} from '../services/api';
import {
  generateVehiclesReport,
  generateClientsReport,
  generateContractsReport,
  generateCategoriesReport,
  generateStatusReport,
  generateDashboardReport
} from '../utils/reportGenerator';
import { toast } from 'react-hot-toast';
import Carregando from '../components/ui/Loader';

const Relatorios: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    totalClients: 0,
    totalContracts: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [vehicles, clients, contracts] = await Promise.all([
        vehiclesApi.getAll(),
        clientsApi.getAll(),
        contractsApi.getAll()
      ]);

      const totalRevenue = contracts.reduce((sum, contract) => sum + contract.total, 0);

      setStats({
        totalVehicles: vehicles.length,
        totalClients: clients.length,
        totalContracts: contracts.length,
        totalRevenue
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleGenerateReport = async (type: string, filters?: any) => {
    setLoading(true);
    try {
      switch (type) {
        case 'vehicles':
          const vehicles = await vehiclesApi.getAll();
          let filteredVehicles = vehicles;
          
          if (filters?.status) {
            filteredVehicles = vehicles.filter(v => v.status?.name === filters.status);
          }
          if (filters?.category) {
            filteredVehicles = filteredVehicles.filter(v => v.category?.name === filters.category);
          }
          if (filters?.year) {
            filteredVehicles = filteredVehicles.filter(v => v.year === parseInt(filters.year));
          }
          
          generateVehiclesReport(filteredVehicles, filters);
          break;

        case 'clients':
          const clients = await clientsApi.getAll();
          generateClientsReport(clients);
          break;

        case 'contracts':
          const contracts = await contractsApi.getAll();
          let filteredContracts = contracts;
          
          if (filters?.startDate) {
            filteredContracts = contracts.filter(c => 
              new Date(c.start_date) >= new Date(filters.startDate)
            );
          }
          if (filters?.endDate) {
            filteredContracts = filteredContracts.filter(c => 
              new Date(c.end_date) <= new Date(filters.endDate)
            );
          }
          
          generateContractsReport(filteredContracts, filters);
          break;

        case 'categories':
          const [categories, vehiclesForCategories] = await Promise.all([
            categoriesApi.getAll(),
            vehiclesApi.getAll()
          ]);
          
          const vehiclesByCategory = categories.map(cat => ({
            category: cat.name,
            count: vehiclesForCategories.filter(v => v.category_id === cat.id).length
          }));
          
          generateCategoriesReport(categories, vehiclesByCategory);
          break;

        case 'status':
          const [statuses, vehiclesForStatus] = await Promise.all([
            statusesApi.getAll(),
            vehiclesApi.getAll()
          ]);
          
          const vehiclesByStatus = statuses.map(status => ({
            status: status.name,
            count: vehiclesForStatus.filter(v => v.status_id === status.id).length
          }));
          
          generateStatusReport(statuses, vehiclesByStatus);
          break;

        case 'dashboard':
          const dashboardStats = await dashboardApi.getStats();
          generateDashboardReport(dashboardStats);
          break;

        default:
          throw new Error('Tipo de relatório não reconhecido');
      }

      toast.success('Relatório gerado com sucesso!');
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao gerar relatório');
    } finally {
      setLoading(false);
    }
  };

  const quickReports = [
    {
      id: 'vehicles',
      title: 'Relatório de Veículos',
      description: 'Lista completa da frota',
      icon: Car,
      color: 'bg-blue-500',
      count: stats.totalVehicles
    },
    {
      id: 'clients',
      title: 'Relatório de Clientes',
      description: 'Cadastro de clientes',
      icon: Users,
      color: 'bg-green-500',
      count: stats.totalClients
    },
    {
      id: 'contracts',
      title: 'Relatório de Contratos',
      description: 'Histórico de locações',
      icon: FileText,
      color: 'bg-purple-500',
      count: stats.totalContracts
    },
    {
      id: 'dashboard',
      title: 'Relatório Geral',
      description: 'Visão consolidada',
      icon: BarChart3,
      color: 'bg-orange-500',
      count: `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-primary to-primary-700 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Central de Relatórios</h1>
            <p className="text-primary-100">
              Gere relatórios profissionais em PDF para análise e controle
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <FileText size={32} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickReports.map((report) => {
          const IconComponent = report.icon;
          return (
            <div key={report.id} className="card card-hover p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${report.color} rounded-xl flex items-center justify-center`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-900">{report.title}</h3>
                  <p className="text-sm text-neutral-600 mb-2">{report.description}</p>
                  <p className="text-lg font-bold text-neutral-900">{report.count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate Reports */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Download size={20} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Gerar Relatórios</h3>
              <p className="text-neutral-600">Exporte dados com filtros personalizados</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Carregando size="small" />
                  <span>Gerando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <FileText size={20} />
                  <span>Abrir Gerador de Relatórios</span>
                </div>
              )}
            </button>

            <div className="grid grid-cols-2 gap-3">
              {quickReports.slice(0, 4).map((report) => (
                <button
                  key={report.id}
                  onClick={() => handleGenerateReport(report.id)}
                  className="btn-outline text-sm py-2"
                  disabled={loading}
                >
                  Gerar {report.title.split(' ')[2] || report.title.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Features */}
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900">Recursos dos Relatórios</h3>
              <p className="text-neutral-600">Funcionalidades incluídas</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Layout Profissional</h4>
                <p className="text-sm text-neutral-600">Design limpo e organizado para apresentações</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Filtros Avançados</h4>
                <p className="text-sm text-neutral-600">Personalize os dados por período, status e categoria</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Estatísticas Detalhadas</h4>
                <p className="text-sm text-neutral-600">Análises e indicadores de performance</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900">Exportação Instantânea</h4>
                <p className="text-sm text-neutral-600">Download automático em formato PDF</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6">Relatórios Disponíveis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <Car size={20} className="text-blue-500" />
              <h4 className="font-semibold text-neutral-900">Veículos</h4>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Lista completa da frota com status, categorias e estatísticas de ocupação.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Status</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Categoria</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Ano</span>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <Users size={20} className="text-green-500" />
              <h4 className="font-semibold text-neutral-900">Clientes</h4>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Cadastro completo de clientes com análise por região e histórico.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Completo</span>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <FileText size={20} className="text-purple-500" />
              <h4 className="font-semibold text-neutral-900">Contratos</h4>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Histórico de locações com análise financeira e indicadores de performance.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Período</span>
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Financeiro</span>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <PieChart size={20} className="text-orange-500" />
              <h4 className="font-semibold text-neutral-900">Categorias</h4>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Análise de categorias com valores de diária e receita potencial.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Análise</span>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <BarChart3 size={20} className="text-red-500" />
              <h4 className="font-semibold text-neutral-900">Status</h4>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Distribuição de veículos por status com indicadores operacionais.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Operacional</span>
            </div>
          </div>

          <div className="p-4 border border-neutral-200 rounded-xl hover:border-neutral-300 transition-colors">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp size={20} className="text-indigo-500" />
              <h4 className="font-semibold text-neutral-900">Geral</h4>
            </div>
            <p className="text-sm text-neutral-600 mb-3">
              Visão consolidada com todos os indicadores e análises do sistema.
            </p>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Executivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Modal */}
      <ReportsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGenerateReport={handleGenerateReport}
      />
    </div>
  );
};

export default Relatorios;