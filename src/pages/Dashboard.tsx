import React, { useState, useEffect } from 'react';
import { Car, Users, FileText, DollarSign } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import VehicleCategoryPie from '../components/dashboard/VehicleCategoryPie';
import Carregando from '../components/ui/Loader';
import { dashboardApi, contractsApi, clientsApi } from '../services/api';
import { DashboardStats, Contract, Client } from '../types';

const Painel: React.FC = () => {
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
          .slice(0, 3);
        
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
          .slice(0, 3);
        
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
      <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Erro</h3>
        <p>{erro}</p>
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
    revenueByMonth,
    vehiclesByCategory
  } = stats;
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Veículos"
          value={totalVehicles}
          icon={<Car size={24} />}
          color="primary"
        />
        <StatCard
          title="Veículos Disponíveis"
          value={availableVehicles}
          icon={<Car size={24} />}
          color="success"
        />
        <StatCard
          title="Contratos Ativos"
          value={activeContracts}
          icon={<FileText size={24} />}
          color="info"
        />
        <StatCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          color="warning"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueByMonth} />
        </div>
        <div>
          <VehicleCategoryPie data={vehiclesByCategory} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Contratos Recentes</h3>
          <div className="space-y-4">
            {recentContracts.map(contract => (
              <div key={contract.id} className="flex justify-between p-3 bg-dark-700 rounded-md">
                <div>
                  <h4 className="font-medium">Contrato #{String(contract.id).padStart(4, '0')}</h4>
                  <p className="text-sm text-gray-400">
                    {contract.vehicle?.brand} {contract.vehicle?.model}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">
                    R$ {contract.total.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Vence em {new Date(contract.end_date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
            {recentContracts.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                Nenhum contrato recente
              </p>
            )}
          </div>
        </div>
        
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Principais Clientes</h3>
          <div className="space-y-4">
            {topClients.map(client => (
              <div key={client.id} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-medium">{client.name}</h4>
                    <p className="text-sm text-gray-400">
                      {client.totalRentals} {client.totalRentals === 1 ? 'aluguel' : 'aluguéis'}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-primary">
                  R$ {client.totalSpent.toLocaleString()}
                </p>
              </div>
            ))}
            {topClients.length === 0 && (
              <p className="text-gray-400 text-center py-4">
                Nenhum cliente encontrado
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Painel;