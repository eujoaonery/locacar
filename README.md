# LocaCar - Sistema de Locadora de Veículos

## 🌍 Global

**Equipe de Desenvolvimento:**  
- Alan Rodrigues de Melo Stati (RA: 636274)  
- Christian Dantas de Alencar Campos (RA: 638272)  
- Cristhian Leandro Goes Garcia (RA: 635316)  
- João Pedro Nery Evangelista da Silva (RA: 638062)  
- Rafael Moreno Mendonça (RA: 635464)  

**Data:** Junho de 2025  

---

## 📌 Visão Geral do Projeto

O **LocaCar** é um sistema de gerenciamento completo para locadoras de veículos, desenvolvido como projeto acadêmico para a disciplina de Desenvolvimento de Sistemas de Informação no curso de Ciência da Computação da UNIVEM.  

O sistema oferece controle total sobre veículos, contratos, clientes, relatórios e usuários, com foco em **responsividade, segurança e performance**.

---

## 🛠 Stack Tecnológica

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS  
- **Roteamento:** React Router DOM  
- **UI/UX:** Lucide React, React Hot Toast  
- **Visualização de Dados:** Chart.js, React-ChartJS-2  
- **PDFs:** jsPDF, jsPDF-AutoTable  
- **Datas:** date-fns  
- **Backend:** Supabase (PostgreSQL, Auth JWT, RLS)  
- **Ferramentas de Desenvolvimento:** ESLint, TypeScript, Autoprefixer, PostCSS  

---

## 📁 Arquitetura e Estrutura de Pastas

- `src/components`: organização por domínio (auth, dashboard, vehicles, etc)  
- `src/pages`: rotas principais da aplicação  
- `src/services`: integração com APIs Supabase  
- `src/types` e `src/utils`: tipagens e utilitários compartilhados  
- Banco de dados com tabelas: `statuses`, `categories`, `vehicles`, `clients`, `contracts`  
- Segurança por **RLS (Row-Level Security)**  
- Arquitetura modular e escalável  

---

## 🔐 Funcionalidade: Sistema de Autenticação

- Login com email e senha  
- Autenticação via JWT (Supabase Auth)  
- Proteção de rotas privadas  
- Interface moderna e responsiva  
- Controle de sessão e logout seguro  
- Permissões gerenciadas via Supabase  

---

## 📊 Funcionalidade: Dashboard Analítico

- Visão geral da frota, receita e contratos  
- Gráficos interativos: receita diária, veículos por categoria  
- Indicadores em tempo real: veículos disponíveis, contratos ativos  
- Tabela de contratos recentes e principais clientes  
- Navegação rápida por botões de atalho  

---

## 🚗 Funcionalidade: Gestão de Veículos

- Cadastro: marca, modelo, ano, placa (única), cor, status, categoria  
- Filtros por categoria, status e busca textual  
- Edição e exclusão com validações  
- Análise de frota e histórico de contratos  
- Interface intuitiva com indicadores e tabelas  

---

## 👤 Funcionalidade: Gestão de Clientes

- Cadastro: nome, telefone, endereço, RG, CPF (único)  
- Visualização e edição de dados  
- Histórico de locações  
- Análise de frequência e gastos  
- Validação automática de documentos  

---

## 📄 Funcionalidade: Contratos de Locação

- Geração automatizada de contratos em PDF  
- Cálculo com base no veículo, período e valor da diária  
- Atualização automática do status do veículo  
- Validação de datas e campos obrigatórios  
- Visualização detalhada dos contratos  

---

## 🗂 Funcionalidade: Gestão de Categorias

- Cadastro e edição de categorias  
- Definição de valores de diária  
- Visualização de veículos por categoria  
- Análise de receita estimada  

---

## 🔧 Funcionalidade: Gestão de Status

- Criação de status personalizados (Disponível, Alugado, Em Manutenção etc)  
- Controle visual e operacional da frota  
- Relatórios por status  
- Interface simples e objetiva  

---

## 📈 Funcionalidade: Sistema de Relatórios

- Relatórios em PDF por tipo: Veículos, Clientes, Contratos, Categorias, Status, Geral  
- Filtros: data, categoria, status e ano  
- Layouts profissionais com gráficos e tabelas  
- Download instantâneo após geração  

---

## 👥 Funcionalidade: Gestão de Usuários

- Listagem e criação de usuários  
- Controle de acesso via Supabase Auth  
- Registro de acessos  
- Segurança por autenticação JWT  

---

## ℹ Página Sobre

- Informações da equipe  
- Tecnologias utilizadas  
- Apresentação institucional da UNIVEM  
- Objetivos acadêmicos e visão do projeto  

---

## 🎨 Design e UI/UX

- Paleta de cores neutra  
- Tipografia: Inter  
- Design inspirado em apps como Uber  
- Componentes reutilizáveis com microinterações  
- Navegação com sidebar, breadcrumbs e feedback visual  
- Responsividade total: desktop, tablet e mobile  
- Animações e estados visuais durante o carregamento  

---

## 🔒 Segurança e Validações

- RLS para controle granular de acesso  
- Validações: CPF único, placa de veículos  
- Proteção de rotas, sanitização de inputs e tratamento de erros  
- Políticas personalizadas no Supabase  

---

## 📱 Suporte Responsivo

- **Desktop:** 1920px+  
- **Laptop:** 1024px – 1919px  
- **Tablet:** 768px – 1023px  
- **Mobile:** 320px – 767px  

---

## 📊 Métricas e Capacidade

- Dados de exemplo: 10 veículos, 10 clientes, 6 categorias, 4 status  
- Suporte ilimitado a registros  
- Performance garantida com React + Supabase  
- Backup automático e escalabilidade sob demanda  

---

## ✅ Considerações Finais

O **LocaCar** representa uma aplicação moderna, robusta e funcional, construída com as melhores práticas de desenvolvimento **Full-Stack**.  

A equipe aplicou conhecimentos de design, segurança, programação e arquitetura, consolidando um sistema completo para gestão de locadoras de veículos. O projeto destacou a colaboração em equipe, versionamento de código e integração de tecnologias emergentes.

---

