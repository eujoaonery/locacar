import React, { useEffect, useState } from 'react';
import { vehiclesApi, statusesApi, categoriesApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import VehicleHistoryModal from '../components/vehicles/VehicleHistoryModal';
import type { Vehicle, Status, Category } from '../types';
import { toast } from 'react-hot-toast';
import { History, Plus, Search, Filter, Car, Edit, Trash2 } from 'lucide-react';

const Veiculos: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Vehicle[]>([]);
  const [filteredVeiculos, setFilteredVeiculos] = useState<Vehicle[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [veiculoEditando, setVeiculoEditando] = useState<Vehicle | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    color: '',
    status_id: '',
    category_id: ''
  });

  const buscarDados = async () => {
    try {
      const [veiculosData, statusesData, categoriesData] = await Promise.all([
        vehiclesApi.getAll(),
        statusesApi.getAll(),
        categoriesApi.getAll()
      ]);
      setVeiculos(veiculosData);
      setFilteredVeiculos(veiculosData);
      setStatuses(statusesData);
      setCategories(categoriesData);
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

  // Filter vehicles based on search and filters
  useEffect(() => {
    let filtered = veiculos;

    if (searchTerm) {
      filtered = filtered.filter(veiculo =>
        veiculo.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(veiculo => veiculo.status_id === parseInt(statusFilter));
    }

    if (categoryFilter) {
      filtered = filtered.filter(veiculo => veiculo.category_id === parseInt(categoryFilter));
    }

    setFilteredVeiculos(filtered);
  }, [veiculos, searchTerm, statusFilter, categoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        ...form,
        status_id: parseInt(form.status_id),
        category_id: parseInt(form.category_id),
        year: parseInt(form.year.toString())
      };

      if (veiculoEditando) {
        await vehiclesApi.update(veiculoEditando.id, formData);
        toast.success('Veículo atualizado com sucesso!');
      } else {
        await vehiclesApi.create(formData);
        toast.success('Veículo criado com sucesso!');
      }
      setModalAberto(false);
      setVeiculoEditando(null);
      setForm({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        color: '',
        status_id: '',
        category_id: ''
      });
      buscarDados();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar veículo');
    }
  };

  const handleExcluir = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await vehiclesApi.delete(id);
        toast.success('Veículo excluído com sucesso!');
        buscarDados();
      } catch (err: any) {
        toast.error(err.message || 'Erro ao excluir veículo');
      }
    }
  };

  const handleEditar = (veiculo: Vehicle) => {
    setVeiculoEditando(veiculo);
    setForm({
      brand: veiculo.brand,
      model: veiculo.model,
      year: veiculo.year,
      license_plate: veiculo.license_plate,
      color: veiculo.color,
      status_id: veiculo.status_id?.toString() || '',
      category_id: veiculo.category_id?.toString() || ''
    });
    setModalAberto(true);
  };

  const handleViewHistory = (veiculo: Vehicle) => {
    setSelectedVehicle(veiculo);
    setHistoryModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'Disponível': 'status-available',
      'Alugado': 'status-rented',
      'Em Manutenção': 'status-maintenance',
      'Reservado': 'status-reserved'
    };
    
    return statusClasses[status as keyof typeof statusClasses] || 'status-badge';
  };

  const cores = [
    'Preto', 'Branco', 'Prata', 'Cinza', 'Vermelho', 
    'Azul', 'Verde', 'Amarelo', 'Marrom', 'Laranja',
    'Roxo', 'Rosa'
  ];

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Veículos</h2>
          <p className="text-neutral-600">Gerencie sua frota de veículos</p>
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setVeiculoEditando(null);
            setForm({
              brand: '',
              model: '',
              year: new Date().getFullYear(),
              license_plate: '',
              color: '',
              status_id: '',
              category_id: ''
            });
            setModalAberto(true);
          }}
        >
          <Plus size={20} className="mr-2" />
          Adicionar Veículo
        </button>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Buscar veículos..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os status</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
          
          <select
            className="input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <button
            className="btn-outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              setCategoryFilter('');
            }}
          >
            <Filter size={20} className="mr-2" />
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total</p>
              <p className="text-xl font-bold text-neutral-900">{veiculos.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-success-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Disponíveis</p>
              <p className="text-xl font-bold text-neutral-900">
                {veiculos.filter(v => v.status?.name === 'Disponível').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-error-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Alugados</p>
              <p className="text-xl font-bold text-neutral-900">
                {veiculos.filter(v => v.status?.name === 'Alugado').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Car size={20} className="text-warning-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Manutenção</p>
              <p className="text-xl font-bold text-neutral-900">
                {veiculos.filter(v => v.status?.name === 'Em Manutenção').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Veículo
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Placa
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Ano
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Cor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Categoria
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {filteredVeiculos.map((veiculo) => (
              <tr key={veiculo.id} className="hover:bg-neutral-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <Car size={20} className="text-neutral-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {veiculo.brand} {veiculo.model}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {veiculo.category?.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-mono text-sm bg-neutral-100 px-2 py-1 rounded">
                    {veiculo.license_plate}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-900">{veiculo.year}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{veiculo.color}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`status-badge ${getStatusBadge(veiculo.status?.name || '')}`}>
                    {veiculo.status?.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="px-2 py-1 bg-accent-100 text-accent-800 rounded-lg text-xs font-medium">
                    {veiculo.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="btn-ghost btn-sm"
                      onClick={() => handleViewHistory(veiculo)}
                      title="Ver histórico"
                    >
                      <History size={16} />
                    </button>
                    <button 
                      className="btn-ghost btn-sm"
                      onClick={() => handleEditar(veiculo)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-ghost btn-sm text-error-600 hover:bg-error-50"
                      onClick={() => handleExcluir(veiculo.id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredVeiculos.length === 0 && (
        <div className="card p-12 text-center">
          <Car size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Nenhum veículo encontrado
          </h3>
          <p className="text-neutral-600 mb-6">
            {searchTerm || statusFilter || categoryFilter 
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando seu primeiro veículo'
            }
          </p>
          {!searchTerm && !statusFilter && !categoryFilter && (
            <button 
              className="btn-primary"
              onClick={() => setModalAberto(true)}
            >
              <Plus size={20} className="mr-2" />
              Adicionar Primeiro Veículo
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-semibold">
                {veiculoEditando ? 'Editar' : 'Novo'} Veículo
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Marca</label>
                    <input
                      type="text"
                      className="input"
                      value={form.brand}
                      onChange={(e) => setForm({ ...form, brand: e.target.value })}
                      required
                      placeholder="Ex: Toyota"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Modelo</label>
                    <input
                      type="text"
                      className="input"
                      value={form.model}
                      onChange={(e) => setForm({ ...form, model: e.target.value })}
                      required
                      placeholder="Ex: Corolla"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Ano</label>
                    <input
                      type="number"
                      className="input"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Placa</label>
                    <input
                      type="text"
                      className="input"
                      value={form.license_plate}
                      onChange={(e) => setForm({ ...form, license_plate: e.target.value.toUpperCase() })}
                      required
                      placeholder="ABC-1234"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Cor</label>
                  <select
                    className="input"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma cor</option>
                    {cores.map((cor) => (
                      <option key={cor} value={cor}>
                        {cor}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Status</label>
                    <select
                      className="input"
                      value={form.status_id}
                      onChange={(e) => setForm({ ...form, status_id: e.target.value })}
                      required
                    >
                      <option value="">Selecione um status</option>
                      {statuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Categoria</label>
                    <select
                      className="input"
                      value={form.category_id}
                      onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
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
                  {veiculoEditando ? 'Atualizar' : 'Criar'} Veículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedVehicle && (
        <VehicleHistoryModal
          vehicle={selectedVehicle}
          isOpen={historyModalOpen}
          onClose={() => {
            setHistoryModalOpen(false);
            setSelectedVehicle(null);
          }}
        />
      )}
    </div>
  );
};

export default Veiculos;