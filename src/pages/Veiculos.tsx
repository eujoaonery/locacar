import React, { useEffect, useState } from 'react';
import { vehiclesApi, statusesApi, categoriesApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import type { Vehicle, Status, Category } from '../types';
import { toast } from 'react-hot-toast';

const Veiculos: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Vehicle[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [veiculoEditando, setVeiculoEditando] = useState<Vehicle | null>(null);
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

  const traduzirCor = (cor: string): string => {
    const cores: { [key: string]: string } = {
      'black': 'Preto',
      'white': 'Branco',
      'silver': 'Prata',
      'gray': 'Cinza',
      'red': 'Vermelho',
      'blue': 'Azul',
      'green': 'Verde',
      'yellow': 'Amarelo',
      'brown': 'Marrom',
      'orange': 'Laranja',
      'purple': 'Roxo',
      'pink': 'Rosa'
    };
    
    return cores[cor.toLowerCase()] || cor;
  };

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

  const cores = [
    'Preto', 'Branco', 'Prata', 'Cinza', 'Vermelho', 
    'Azul', 'Verde', 'Amarelo', 'Marrom', 'Laranja',
    'Roxo', 'Rosa'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Veículos</h2>
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
          Adicionar Veículo
        </button>
      </div>

      <div className="bg-dark-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Marca</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Modelo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Ano</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Placa</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Cor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Categoria</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {veiculos.map((veiculo) => (
              <tr key={veiculo.id} className="hover:bg-dark-700/50">
                <td className="px-6 py-4 text-sm">{veiculo.brand}</td>
                <td className="px-6 py-4 text-sm">{veiculo.model}</td>
                <td className="px-6 py-4 text-sm">{veiculo.year}</td>
                <td className="px-6 py-4 text-sm">{veiculo.license_plate}</td>
                <td className="px-6 py-4 text-sm">{traduzirCor(veiculo.color)}</td>
                <td className="px-6 py-4 text-sm">{veiculo.status?.name}</td>
                <td className="px-6 py-4 text-sm">{veiculo.category?.name}</td>
                <td className="px-6 py-4 text-sm text-right">
                  <button 
                    className="btn-secondary mr-2"
                    onClick={() => handleEditar(veiculo)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-outline text-red-500 hover:bg-red-500/10"
                    onClick={() => handleExcluir(veiculo.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {veiculoEditando ? 'Editar' : 'Novo'} Veículo
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Marca</label>
                <input
                  type="text"
                  className="input"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Modelo</label>
                <input
                  type="text"
                  className="input"
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ano</label>
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
              <div>
                <label className="block text-sm font-medium mb-1">Placa</label>
                <input
                  type="text"
                  className="input"
                  value={form.license_plate}
                  onChange={(e) => setForm({ ...form, license_plate: e.target.value.toUpperCase() })}
                  required
                  pattern="[A-Z0-9]+"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cor</label>
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
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
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
              <div>
                <label className="block text-sm font-medium mb-1">Categoria</label>
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
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setModalAberto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Veiculos;