import React, { useEffect, useState } from 'react';
import { categoriesApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import CategoryVehiclesModal from '../components/categories/CategoryVehiclesModal';
import type { Category } from '../types';
import { toast } from 'react-hot-toast';
import { Car } from 'lucide-react';

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Category | null>(null);
  const [vehiclesModalOpen, setVehiclesModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    daily_rate: ''
  });

  const buscarCategorias = async () => {
    try {
      const dados = await categoriesApi.getAll();
      setCategorias(dados);
    } catch (err: any) {
      setErro(err.message || 'Erro ao carregar categorias');
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (categoriaEditando) {
        await categoriesApi.update(categoriaEditando.id, {
          ...form,
          daily_rate: parseFloat(form.daily_rate)
        });
        toast.success('Categoria atualizada com sucesso!');
      } else {
        await categoriesApi.create({
          ...form,
          daily_rate: parseFloat(form.daily_rate)
        });
        toast.success('Categoria criada com sucesso!');
      }
      setModalAberto(false);
      setCategoriaEditando(null);
      setForm({ name: '', description: '', daily_rate: '' });
      buscarCategorias();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao salvar categoria');
    }
  };

  const handleExcluir = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        await categoriesApi.delete(id);
        toast.success('Categoria excluída com sucesso!');
        buscarCategorias();
      } catch (err: any) {
        toast.error(err.message || 'Erro ao excluir categoria');
      }
    }
  };

  const handleEditar = (categoria: Category) => {
    setCategoriaEditando(categoria);
    setForm({
      name: categoria.name,
      description: categoria.description || '',
      daily_rate: categoria.daily_rate.toString()
    });
    setModalAberto(true);
  };

  const handleViewVehicles = (categoria: Category) => {
    setSelectedCategory(categoria);
    setVehiclesModalOpen(true);
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
      <div className="card p-6 border-error-200 bg-error-50">
        <h3 className="text-lg font-semibold text-error-800 mb-2">Erro</h3>
        <p className="text-error-600">{erro}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <button 
          className="btn-primary"
          onClick={() => {
            setCategoriaEditando(null);
            setForm({ name: '', description: '', daily_rate: '' });
            setModalAberto(true);
          }}
        >
          Adicionar Categoria
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Diária
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-100">
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-neutral-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm font-medium text-neutral-900">{categoria.name}</td>
                <td className="px-6 py-4 text-sm text-neutral-900">{categoria.description}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="font-semibold text-success-600">
                    R$ {categoria.daily_rate.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button 
                      className="btn-outline mr-2"
                      onClick={() => handleViewVehicles(categoria)}
                      title="Ver veículos desta categoria"
                    >
                      <Car size={16} />
                    </button>
                    <button 
                      className="btn-secondary mr-2"
                      onClick={() => handleEditar(categoria)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-outline text-error-600 hover:bg-error-50"
                      onClick={() => handleExcluir(categoria.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="text-xl font-semibold text-neutral-900">
                {categoriaEditando ? 'Editar' : 'Nova'} Categoria
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
                <div className="form-group">
                  <label className="label">Nome</label>
                  <input
                    type="text"
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Descrição</label>
                  <textarea
                    className="input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="label">Valor da Diária</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={form.daily_rate}
                    onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
                    required
                  />
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
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedCategory && (
        <CategoryVehiclesModal
          category={selectedCategory}
          isOpen={vehiclesModalOpen}
          onClose={() => {
            setVehiclesModalOpen(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default Categorias;