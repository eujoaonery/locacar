# LocaCar - Sistema de Gerenciamento de Locadora de Veículos

## Sobre o Projeto

O LocaCar é um sistema completo de gerenciamento para locadoras de veículos, desenvolvido como parte da atividade de Desenvolvimento de Sistemas de Informação do curso de Ciência da Computação - Turma 5 da UNIVEM.

### Desenvolvedores
- João Nery
- Cristhian

## Funcionalidades

### 1. Gestão de Veículos
- Cadastro e atualização de veículos
- Controle de status (Disponível, Alugado, Em Manutenção, Reservado)
- Categorização por tipo de veículo
- Registro de informações como marca, modelo, ano, placa e cor

### 2. Gestão de Clientes
- Cadastro completo de clientes
- Armazenamento de documentos (RG e CPF)
- Histórico de locações
- Gestão de contatos e endereços

### 3. Contratos de Locação
- Geração automática de contratos
- Cálculo automático de valores
- Exportação de contratos em PDF
- Controle de datas de início e fim

### 4. Categorias de Veículos
- Definição de categorias personalizadas
- Configuração de valores de diária
- Descrições detalhadas
- Relatórios por categoria

### 5. Dashboard
- Visão geral do negócio
- Gráficos de receita
- Distribuição de veículos por categoria
- Indicadores de desempenho

### 6. Controle de Status
- Gerenciamento de estados dos veículos
- Acompanhamento de disponibilidade
- Histórico de alterações
- Relatórios de ocupação

## Características Técnicas

### Frontend
- React com TypeScript
- Tailwind CSS para estilização
- Lucide React para ícones
- React Router para navegação
- React Hot Toast para notificações
- Chart.js para gráficos

### Backend
- Supabase para banco de dados e autenticação
- PostgreSQL como banco de dados
- Row Level Security (RLS) para segurança
- Políticas de acesso personalizadas

### Recursos Adicionais
- Design responsivo
- Tema dark mode
- Interface intuitiva
- Geração de PDF
- Validações em tempo real

## Requisitos do Sistema

- Node.js 18+
- NPM ou Yarn
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet

## Instalação e Execução

1. Clone o repositório
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

4. Execute o projeto
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes React reutilizáveis
  ├── contexts/       # Contextos React (auth, etc)
  ├── pages/          # Páginas da aplicação
  ├── services/       # Serviços e APIs
  ├── types/          # Definições de tipos TypeScript
  └── utils/          # Utilitários e helpers
```

## Contribuição

Este é um projeto acadêmico desenvolvido para a disciplina de Desenvolvimento de Sistemas de Informação da UNIVEM. Contribuições são bem-vindas através de pull requests.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

Desenvolvido como parte do curso de Ciência da Computação - UNIVEM 2025