import React from 'react';
import { GraduationCap, Users, Calendar, Award, BookOpen, MapPin } from 'lucide-react';

const Sobre: React.FC = () => {
  const desenvolvedores = [
    'João Nery',
    'Cristhian Garcia', 
    'Christian Dantas',
    'Rafael Moreno',
    'Alan Stati'
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="card p-8 bg-gradient-to-r from-primary to-primary-700 text-white border-0">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-3">LocaCar</h1>
            <p className="text-xl text-primary-100 mb-2">Sistema de Locadora de Veículos Global</p>
            <p className="text-primary-200">Desenvolvido para a disciplina de Desenvolvimento de Sistemas de Informação</p>
          </div>
          <div className="flex-shrink-0">
            <img 
              src="https://www.univem.edu.br/img/site/logo.png" 
              alt="Univem Logo" 
              className="h-20 md:h-24 opacity-90 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>

      {/* Informações do Projeto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">Informações do Projeto</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Award size={16} className="text-neutral-500" />
              <div>
                <p className="font-medium text-neutral-900">Nome do Projeto</p>
                <p className="text-neutral-600">LocaCar - Sistema de Locadora de Veículos</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <BookOpen size={16} className="text-neutral-500" />
              <div>
                <p className="font-medium text-neutral-900">Disciplina</p>
                <p className="text-neutral-600">Desenvolvimento de Sistemas de Informação</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar size={16} className="text-neutral-500" />
              <div>
                <p className="font-medium text-neutral-900">Ano Letivo</p>
                <p className="text-neutral-600">2025</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
              <GraduationCap size={20} className="text-accent-600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900">Informações Acadêmicas</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <MapPin size={16} className="text-neutral-500" />
              <div>
                <p className="font-medium text-neutral-900">Instituição</p>
                <p className="text-neutral-600">Centro Universitário Eurípides de Marília - UNIVEM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <GraduationCap size={16} className="text-neutral-500" />
              <div>
                <p className="font-medium text-neutral-900">Curso</p>
                <p className="text-neutral-600">Ciência da Computação</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users size={16} className="text-neutral-500" />
              <div>
                <p className="font-medium text-neutral-900">Turma</p>
                <p className="text-neutral-600">Turma 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desenvolvedores */}
      <div className="card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-success-600" />
          </div>
          <h3 className="text-xl font-semibold text-neutral-900">Equipe de Desenvolvimento</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {desenvolvedores.map((dev, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-700 flex items-center justify-center text-white font-bold">
                {dev.split(' ').map(name => name.charAt(0)).join('')}
              </div>
              <div>
                <p className="font-medium text-neutral-900">{dev}</p>
                <p className="text-sm text-neutral-500">Desenvolvedor</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tecnologias Utilizadas */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-6">Tecnologias Utilizadas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-neutral-800 mb-3">Frontend</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-neutral-600">React 18 com TypeScript</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span className="text-neutral-600">Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-neutral-600">Vite</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-neutral-600">React Router DOM</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-neutral-600">Lucide React (Ícones)</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 mb-3">Backend & Banco</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-neutral-600">Supabase</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-neutral-600">PostgreSQL</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-neutral-600">Row Level Security (RLS)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-neutral-600">Autenticação JWT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Funcionalidades */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-neutral-900 mb-6">Principais Funcionalidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-neutral-200 rounded-lg">
            <h4 className="font-semibold text-neutral-800 mb-2">Gestão de Veículos</h4>
            <p className="text-sm text-neutral-600">Cadastro, edição e controle de status dos veículos da frota</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <h4 className="font-semibold text-neutral-800 mb-2">Gestão de Clientes</h4>
            <p className="text-sm text-neutral-600">Cadastro completo de clientes com documentos e histórico</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <h4 className="font-semibold text-neutral-800 mb-2">Contratos de Locação</h4>
            <p className="text-sm text-neutral-600">Geração automática de contratos com cálculo de valores</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <h4 className="font-semibold text-neutral-800 mb-2">Dashboard Analítico</h4>
            <p className="text-sm text-neutral-600">Visão geral com gráficos e indicadores de desempenho</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <h4 className="font-semibold text-neutral-800 mb-2">Geração de PDF</h4>
            <p className="text-sm text-neutral-600">Exportação de contratos em formato PDF</p>
          </div>
          <div className="p-4 border border-neutral-200 rounded-lg">
            <h4 className="font-semibold text-neutral-800 mb-2">Sistema de Autenticação</h4>
            <p className="text-sm text-neutral-600">Login seguro com controle de acesso</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="card p-4 bg-neutral-50">
        <p className="text-center text-sm text-neutral-600">
          © 2025 LocaCar. Sistema desenvolvido para fins acadêmicos - UNIVEM.
        </p>
      </div>
    </div>
  );
};

export default Sobre;