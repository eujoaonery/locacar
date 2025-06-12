import React, { useState, useEffect } from 'react';
import { Car, Users, FileText, DollarSign, TrendingUp, Calendar, MapPin } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import VehicleCategoryPie from '../components/dashboard/VehicleCategoryPie';
import Carregando from '../components/ui/Loader';
import { dashboardApi, contractsApi, clientsApi } from '../services/api';
import { DashboardStats, Contract, Client } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);
  const [topClients, setTopClients] = useState<(Client & { totalRentals: number, totalSpent: number })[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  
  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [statsData, contractsData, clientsData] = await Promise.all([
          dashboardApi.getStats(),
          contractsApi.getAll(),
          clientsApi.getAll()
        ]);
        
        // Get recent contracts
        const recent = contractsData
          .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
          .slice(0, 5);
        
        // Calculate top clients
        const clientStats = clientsData.map(client => {
          const clientContracts = contractsData.filter(c => c.client_id === client.id);
          return {
            ...client,
            totalRentals: clientContracts.length,
            totalSpent: clientContracts.reduce((sum, c) => sum + c.total, 0)
          };
        });
        
        const top = clientStats
          .sort((a, b) => b.totalSpent - a.totalSpent)
          .slice(0, 5);
        
        setStats(statsData);
        setRecentContracts(recent);
        setTopClients(top);
      } catch (err: any) {
        setErro(err.message || 'Falha ao carregar dados do painel');
        console.error(err);
      } finally {
        setCarregando(false);
      }
    };
    
    buscarDados();
  }, []);
  
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
        <h3 className="text-lg font-semibold text-error-800 mb-2">Erro ao carregar dados</h3>
        <p className="text-error-600">{erro}</p>
      </div>
    );
  }
  
  if (!stats) {
    return null;
  }
  
  const { 
    totalVehicles, 
    availableVehicles, 
    activeContracts, 
    totalRevenue,
    revenueByDay,
    vehiclesByCategory
  } = stats;
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="card p-6 bg-gradient-to-r from-primary to-primary-700 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bem-vindo ao LocaCar! 👋
            </h1>
            <p className="text-primary-100">
              Aqui está um resumo das suas operações hoje
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-primary-100">
            <Calendar size={20} />
            <span>{format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Veículos"
          value={totalVehicles}
          icon={<Car size={24} />}
          color="primary"
          description="Frota completa"
        />
        <StatCard
          title="Veículos Disponíveis"
          value={availableVehicles}
          icon={<Car size={24} />}
          color="success"
          description="Prontos para locação"
        />
        <StatCard
          title="Contratos Ativos"
          value={activeContracts}
          icon={<FileText size={24} />}
          color="accent"
          description="Em andamento"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign size={24} />}
          color="warning"
          description="Faturamento acumulado"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueByDay} />
        </div>
        <div>
          <VehicleCategoryPie data={vehiclesByCategory} />
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contracts */}
        <div className="card">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Contratos Recentes</h3>
              <TrendingUp size={20} className="text-success-500" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentContracts.map(contract => (
                <div key={contract.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <FileText size={16} className="text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">
                        Contrato #{String(contract.id).padStart(4, '0')}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {contract.vehicle?.brand} {contract.vehicle?.model}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {contract.client?.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success-600">
                      R$ {contract.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {format(new Date(contract.end_date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              ))}
              {recentContracts.length === 0 && (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-neutral-300 mb-3" />
                  <p className="text-neutral-500">Nenhum contrato recente</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Top Clients */}
        <div className="card">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Principais Clientes</h3>
              <Users size={20} className="text-accent-500" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topClients.map((client, index) => (
                <div key={client.id} className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 truncate">{client.name}</h4>
                    <p className="text-sm text-neutral-500">
                      {client.totalRentals} {client.totalRentals === 1 ? 'locação' : 'locações'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success-600">
                      R$ {client.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
              {topClients.length === 0 && (
                <div className="text-center py-8">
                  <Users size={48} className="mx-auto text-neutral-300 mb-3" />
                  <p className="text-neutral-500">Nenhum cliente encontrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-outline p-4 h-auto flex-col space-y-2 hover:border-primary-300 hover:bg-primary-50 group">
            <Car size={24} className="text-neutral-600 group-hover:text-primary-600" />
            <span className="font-medium">Novo Veículo</span>
          </button>
          <button className="btn-outline p-4 h-auto flex-col space-y-2 hover:border-success-300 hover:bg-success-50 group">
            <Users size={24} className="text-neutral-600 group-hover:text-success-600" />
            <span className="font-medium">Novo Cliente</span>
          </button>
          <button className="btn-outline p-4 h-auto flex-col space-y-2 hover:border-accent-300 hover:bg-accent-50 group">
            <FileText size={24} className="text-neutral-600 group-hover:text-accent-600" />
            <span className="font-medium">Novo Contrato</span>
          </button>
          <button className="btn-outline p-4 h-auto flex-col space-y-2 hover:border-warning-300 hover:bg-warning-50 group">
            <MapPin size={24} className="text-neutral-600 group-hover:text-warning-600" />
            <span className="font-medium">Relatórios</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;