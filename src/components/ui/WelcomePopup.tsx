import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Users, BookOpen, Award, Building2 } from 'lucide-react';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeLeft(15);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Função para fechar quando clicar no overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const desenvolvedores = [
    { initials: 'JN', name: 'João Nery', color: 'from-blue-500 to-blue-600' },
    { initials: 'CG', name: 'Cristhian Garcia', color: 'from-green-500 to-green-600' },
    { initials: 'CD', name: 'Christian Dantas', color: 'from-purple-500 to-purple-600' },
    { initials: 'RM', name: 'Rafael Moreno', color: 'from-orange-500 to-orange-600' },
    { initials: 'AS', name: 'Alan Stati', color: 'from-red-500 to-red-600' }
  ];

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleOverlayClick}
    >
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden transform transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header com gradiente */}
        <div className="relative bg-gradient-to-br from-primary via-primary-800 to-primary-900 text-white p-8 overflow-hidden">
          {/* Elementos decorativos */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          {/* Botão de fechar - CORRIGIDO */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 group z-10"
            type="button"
            aria-label="Fechar popup"
          >
            <X size={20} className="text-white group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Timer circular */}
          <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-white/30"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - timeLeft / 15)}`}
                  className="text-white transition-all duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {timeLeft}
              </span>
            </div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2 animate-slide-down">LocaCar</h1>
              <p className="text-xl text-white/90 animate-slide-down" style={{ animationDelay: '0.1s' }}>
                Sistema de Locadora de Veículos Global
              </p>
              <p className="text-white/80 mt-2 animate-slide-down" style={{ animationDelay: '0.2s' }}>
                Desenvolvido para a disciplina de Desenvolvimento de Sistemas de Informação
              </p>
            </div>
            
            {/* Logo UNIVEM */}
            <div className="flex justify-center mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <GraduationCap size={24} className="text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">UNIVEM</h3>
                    <p className="text-sm text-white/80">Centro Universitário Eurípides de Marília</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Informações do Projeto */}
            <div className="space-y-6">
              <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={20} className="text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">Informações do Projeto</h3>
                </div>
                <div className="space-y-3 pl-13">
                  <div className="flex items-start space-x-3">
                    <Award size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Nome do Projeto</p>
                      <p className="text-neutral-600 text-sm">LocaCar - Sistema de Locadora de Veículos</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <BookOpen size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Disciplina</p>
                      <p className="text-neutral-600 text-sm">Desenvolvimento de Sistemas de Informação</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <GraduationCap size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Ano Letivo</p>
                      <p className="text-neutral-600 text-sm">2025</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Acadêmicas */}
              <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Building2 size={20} className="text-accent-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900">Informações Acadêmicas</h3>
                </div>
                <div className="space-y-3 pl-13">
                  <div className="flex items-start space-x-3">
                    <Building2 size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Instituição</p>
                      <p className="text-neutral-600 text-sm">Centro Universitário Eurípides de Marília - UNIVEM</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <GraduationCap size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Curso</p>
                      <p className="text-neutral-600 text-sm">Ciência da Computação</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users size={16} className="text-neutral-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">Turma</p>
                      <p className="text-neutral-600 text-sm">Turma 5</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipe de Desenvolvimento */}
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-success-600" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900">Equipe de Desenvolvimento</h3>
              </div>
              <div className="space-y-4">
                {desenvolvedores.map((dev, index) => (
                  <div 
                    key={dev.initials} 
                    className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-all duration-200 hover:scale-105 animate-slide-left"
                    style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${dev.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {dev.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{dev.name}</p>
                      <p className="text-sm text-neutral-500">Desenvolvedor</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="mt-8 pt-6 border-t border-neutral-200 text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <p className="text-sm text-neutral-600 mb-2">
              Bem-vindo ao sistema! Este popup será fechado automaticamente em <span className="font-semibold text-primary">{timeLeft} segundos</span>
            </p>
            <p className="text-xs text-neutral-500">
              © 2025 LocaCar. Sistema desenvolvido para fins acadêmicos - UNIVEM.
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-linear"
            style={{ width: `${((15 - timeLeft) / 15) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;