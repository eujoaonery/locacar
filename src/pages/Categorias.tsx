import React, { useEffect, useState } from 'react';
import { categoriesApi } from '../services/api';
import Carregando from '../components/ui/Loader';
import type { Category } from '../types';
import { toast } from 'react-hot-toast';

const Categorias: React.FC = () => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState<Category | null>(null);
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

      <div className="bg-dark-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-dark-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Descrição</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Diária</th>
              <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-700">
            {categorias.map((categoria) => (
              <tr key={categoria.id} className="hover:bg-dark-700/50">
                <td className="px-6 py-4 text-sm">{categoria.name}</td>
                <td className="px-6 py-4 text-sm">{categoria.description}</td>
                <td className="px-6 py-4 text-sm">
                  R$ {categoria.daily_rate.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <button 
                    className="btn-secondary mr-2"
                    onClick={() => handleEditar(categoria)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-outline text-red-500 hover:bg-red-500/10"
                    onClick={() => handleExcluir(categoria.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-dark-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {categoriaEditando ? 'Editar' : 'Nova'} Categoria
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea
                  className="input"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor da Diária</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={form.daily_rate}
                  onChange={(e) => setForm({ ...form, daily_rate: e.target.value })}
                  required
                />
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

export default Categorias;