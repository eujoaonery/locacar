import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Vehicle, Client, Contract, Category, Status } from '../types';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Configurações padrão para os relatórios
const reportConfig = {
  margin: 20,
  fontSize: {
    title: 18,
    subtitle: 14,
    normal: 10,
    small: 8
  },
  colors: {
    primary: '#000000',
    secondary: '#666666',
    accent: '#1A73E8',
    success: '#34A853',
    warning: '#FBBC04',
    error: '#EA4335'
  }
};

// Função auxiliar para adicionar cabeçalho
const addHeader = (doc: jsPDF, title: string, subtitle?: string) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Logo/Título principal
  doc.setFontSize(reportConfig.fontSize.title);
  doc.setTextColor(reportConfig.colors.primary);
  doc.text('LOCA CAR', reportConfig.margin, reportConfig.margin);
  
  // Subtítulo
  doc.setFontSize(reportConfig.fontSize.subtitle);
  doc.setTextColor(reportConfig.colors.secondary);
  doc.text('Sistema de Locadora de Veículos', reportConfig.margin, reportConfig.margin + 8);
  
  // Título do relatório
  doc.setFontSize(reportConfig.fontSize.subtitle);
  doc.setTextColor(reportConfig.colors.primary);
  doc.text(title, reportConfig.margin, reportConfig.margin + 20);
  
  if (subtitle) {
    doc.setFontSize(reportConfig.fontSize.normal);
    doc.setTextColor(reportConfig.colors.secondary);
    doc.text(subtitle, reportConfig.margin, reportConfig.margin + 28);
  }
  
  // Data de geração
  doc.setFontSize(reportConfig.fontSize.small);
  doc.setTextColor(reportConfig.colors.secondary);
  doc.text(
    `Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`,
    pageWidth - reportConfig.margin,
    reportConfig.margin,
    { align: 'right' }
  );
  
  // Linha separadora
  doc.setDrawColor(reportConfig.colors.secondary);
  doc.line(reportConfig.margin, reportConfig.margin + 35, pageWidth - reportConfig.margin, reportConfig.margin + 35);
  
  return reportConfig.margin + 45; // Retorna a posição Y após o cabeçalho
};

// Função auxiliar para adicionar rodapé
const addFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFontSize(reportConfig.fontSize.small);
  doc.setTextColor(reportConfig.colors.secondary);
  doc.text(
    'LocaCar - Sistema de Locadora de Veículos | Desenvolvido por João Nery e Cristhian - UNIVEM',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
};

// Relatório de Veículos
export const generateVehiclesReport = (vehicles: Vehicle[], filters?: {
  status?: string;
  category?: string;
  year?: number;
}) => {
  const doc = new jsPDF();
  
  let subtitle = 'Relatório Completo da Frota';
  if (filters?.status || filters?.category || filters?.year) {
    const filterParts = [];
    if (filters.status) filterParts.push(`Status: ${filters.status}`);
    if (filters.category) filterParts.push(`Categoria: ${filters.category}`);
    if (filters.year) filterParts.push(`Ano: ${filters.year}`);
    subtitle = `Filtros aplicados: ${filterParts.join(' | ')}`;
  }
  
  const startY = addHeader(doc, 'RELATÓRIO DE VEÍCULOS', subtitle);
  
  // Estatísticas resumidas
  const stats = {
    total: vehicles.length,
    disponivel: vehicles.filter(v => v.status?.name === 'Disponível').length,
    alugado: vehicles.filter(v => v.status?.name === 'Alugado').length,
    manutencao: vehicles.filter(v => v.status?.name === 'Em Manutenção').length,
    reservado: vehicles.filter(v => v.status?.name === 'Reservado').length
  };
  
  // Tabela de estatísticas
  doc.autoTable({
    startY: startY,
    head: [['Estatística', 'Quantidade', 'Percentual']],
    body: [
      ['Total de Veículos', stats.total.toString(), '100%'],
      ['Disponíveis', stats.disponivel.toString(), `${((stats.disponivel / stats.total) * 100).toFixed(1)}%`],
      ['Alugados', stats.alugado.toString(), `${((stats.alugado / stats.total) * 100).toFixed(1)}%`],
      ['Em Manutenção', stats.manutencao.toString(), `${((stats.manutencao / stats.total) * 100).toFixed(1)}%`],
      ['Reservados', stats.reservado.toString(), `${((stats.reservado / stats.total) * 100).toFixed(1)}%`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [26, 115, 232] },
    margin: { left: reportConfig.margin, right: reportConfig.margin }
  });
  
  // Tabela principal de veículos
  const tableData = vehicles.map(vehicle => [
    vehicle.license_plate,
    `${vehicle.brand} ${vehicle.model}`,
    vehicle.year.toString(),
    vehicle.color,
    vehicle.category?.name || 'N/A',
    vehicle.status?.name || 'N/A'
  ]);
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Placa', 'Modelo', 'Ano', 'Cor', 'Categoria', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      5: { 
        cellWidth: 25,
        halign: 'center'
      }
    },
    didParseCell: function(data) {
      if (data.column.index === 5 && data.section === 'body') {
        const status = data.cell.text[0];
        switch (status) {
          case 'Disponível':
            data.cell.styles.textColor = [52, 168, 83];
            break;
          case 'Alugado':
            data.cell.styles.textColor = [234, 67, 53];
            break;
          case 'Em Manutenção':
            data.cell.styles.textColor = [251, 188, 4];
            break;
          case 'Reservado':
            data.cell.styles.textColor = [26, 115, 232];
            break;
        }
      }
    }
  });
  
  addFooter(doc);
  doc.save(`relatorio_veiculos_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`);
};

// Relatório de Clientes
export const generateClientsReport = (clients: Client[]) => {
  const doc = new jsPDF();
  
  const startY = addHeader(doc, 'RELATÓRIO DE CLIENTES', `Total de ${clients.length} clientes cadastrados`);
  
  // Estatísticas por cidade
  const citiesCount = clients.reduce((acc, client) => {
    const city = client.address.split(' - ')[1] || 'Não informado';
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCities = Object.entries(citiesCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);
  
  // Tabela de estatísticas por cidade
  doc.autoTable({
    startY: startY,
    head: [['Cidade', 'Quantidade de Clientes', 'Percentual']],
    body: topCities.map(([city, count]) => [
      city,
      count.toString(),
      `${((count / clients.length) * 100).toFixed(1)}%`
    ]),
    theme: 'grid',
    headStyles: { fillColor: [26, 115, 232] },
    margin: { left: reportConfig.margin, right: reportConfig.margin }
  });
  
  // Tabela principal de clientes
  const tableData = clients.map(client => [
    client.name,
    client.cpf,
    client.phone,
    client.address.split(' - ')[1] || 'N/A',
    format(new Date(client.created_at || ''), 'dd/MM/yyyy', { locale: ptBR })
  ]);
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Nome', 'CPF', 'Telefone', 'Cidade', 'Cadastro']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    styles: { fontSize: 9 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { fontStyle: 'normal', fontFamily: 'courier' },
      2: { fontFamily: 'courier' }
    }
  });
  
  addFooter(doc);
  doc.save(`relatorio_clientes_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`);
};

// Relatório de Contratos
export const generateContractsReport = (contracts: Contract[], filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
}) => {
  const doc = new jsPDF();
  
  let subtitle = `Total de ${contracts.length} contratos`;
  if (filters?.startDate || filters?.endDate) {
    const period = [];
    if (filters.startDate) period.push(`De: ${format(new Date(filters.startDate), 'dd/MM/yyyy')}`);
    if (filters.endDate) period.push(`Até: ${format(new Date(filters.endDate), 'dd/MM/yyyy')}`);
    subtitle += ` | ${period.join(' ')}`;
  }
  
  const startY = addHeader(doc, 'RELATÓRIO DE CONTRATOS', subtitle);
  
  // Estatísticas financeiras
  const totalRevenue = contracts.reduce((sum, contract) => sum + contract.total, 0);
  const averageContract = totalRevenue / contracts.length || 0;
  const maxContract = Math.max(...contracts.map(c => c.total));
  const minContract = Math.min(...contracts.map(c => c.total));
  
  // Tabela de estatísticas financeiras
  doc.autoTable({
    startY: startY,
    head: [['Métrica', 'Valor']],
    body: [
      ['Total de Contratos', contracts.length.toString()],
      ['Receita Total', `R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Valor Médio por Contrato', `R$ ${averageContract.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Maior Contrato', `R$ ${maxContract.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Menor Contrato', `R$ ${minContract.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [52, 168, 83] },
    margin: { left: reportConfig.margin, right: reportConfig.margin }
  });
  
  // Tabela principal de contratos
  const tableData = contracts.map(contract => {
    const startDate = format(new Date(contract.start_date), 'dd/MM/yyyy');
    const endDate = format(new Date(contract.end_date), 'dd/MM/yyyy');
    const days = Math.ceil((new Date(contract.end_date).getTime() - new Date(contract.start_date).getTime()) / (1000 * 60 * 60 * 24));
    
    return [
      `#${String(contract.id).padStart(4, '0')}`,
      contract.client?.name || 'N/A',
      `${contract.vehicle?.brand} ${contract.vehicle?.model}` || 'N/A',
      contract.vehicle?.license_plate || 'N/A',
      startDate,
      endDate,
      days.toString(),
      `R$ ${contract.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ];
  });
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['ID', 'Cliente', 'Veículo', 'Placa', 'Início', 'Fim', 'Dias', 'Valor Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [0, 0, 0] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { fontFamily: 'courier', fontStyle: 'bold' },
      3: { fontFamily: 'courier' },
      6: { halign: 'center' },
      7: { fontStyle: 'bold', textColor: [52, 168, 83] }
    }
  });
  
  addFooter(doc);
  doc.save(`relatorio_contratos_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`);
};

// Relatório de Categorias
export const generateCategoriesReport = (categories: Category[], vehiclesByCategory: { category: string; count: number }[]) => {
  const doc = new jsPDF();
  
  const startY = addHeader(doc, 'RELATÓRIO DE CATEGORIAS', `${categories.length} categorias cadastradas`);
  
  // Tabela principal de categorias
  const tableData = categories.map(category => {
    const vehicleCount = vehiclesByCategory.find(v => v.category === category.name)?.count || 0;
    const totalPotentialRevenue = vehicleCount * category.daily_rate * 30; // Receita potencial mensal
    
    return [
      category.name,
      category.description || 'N/A',
      `R$ ${category.daily_rate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      vehicleCount.toString(),
      `R$ ${totalPotentialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    ];
  });
  
  doc.autoTable({
    startY: startY,
    head: [['Categoria', 'Descrição', 'Diária', 'Veículos', 'Receita Potencial/Mês']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [251, 188, 4] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    styles: { fontSize: 10 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { fontStyle: 'bold', textColor: [52, 168, 83] },
      3: { halign: 'center' },
      4: { fontStyle: 'bold', textColor: [26, 115, 232] }
    }
  });
  
  // Estatísticas resumidas
  const totalVehicles = vehiclesByCategory.reduce((sum, cat) => sum + cat.count, 0);
  const averageDailyRate = categories.reduce((sum, cat) => sum + cat.daily_rate, 0) / categories.length;
  const totalPotentialRevenue = categories.reduce((sum, cat) => {
    const vehicleCount = vehiclesByCategory.find(v => v.category === cat.name)?.count || 0;
    return sum + (vehicleCount * cat.daily_rate * 30);
  }, 0);
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Resumo Geral', 'Valor']],
    body: [
      ['Total de Veículos', totalVehicles.toString()],
      ['Diária Média', `R$ ${averageDailyRate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Receita Potencial Mensal Total', `R$ ${totalPotentialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [26, 115, 232] },
    margin: { left: reportConfig.margin, right: reportConfig.margin }
  });
  
  addFooter(doc);
  doc.save(`relatorio_categorias_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`);
};

// Relatório de Status
export const generateStatusReport = (statuses: Status[], vehiclesByStatus: { status: string; count: number }[]) => {
  const doc = new jsPDF();
  
  const startY = addHeader(doc, 'RELATÓRIO DE STATUS', 'Distribuição de veículos por status');
  
  // Tabela principal de status
  const tableData = statuses.map(status => {
    const vehicleCount = vehiclesByStatus.find(v => v.status === status.name)?.count || 0;
    const percentage = vehiclesByStatus.reduce((sum, v) => sum + v.count, 0) > 0 
      ? ((vehicleCount / vehiclesByStatus.reduce((sum, v) => sum + v.count, 0)) * 100).toFixed(1)
      : '0.0';
    
    return [
      status.name,
      status.description || 'N/A',
      vehicleCount.toString(),
      `${percentage}%`
    ];
  });
  
  doc.autoTable({
    startY: startY,
    head: [['Status', 'Descrição', 'Quantidade', 'Percentual']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [234, 67, 53] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    styles: { fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      2: { halign: 'center', fontStyle: 'bold' },
      3: { halign: 'center', fontStyle: 'bold' }
    },
    didParseCell: function(data) {
      if (data.column.index === 0 && data.section === 'body') {
        const status = data.cell.text[0];
        switch (status) {
          case 'Disponível':
            data.cell.styles.textColor = [52, 168, 83];
            break;
          case 'Alugado':
            data.cell.styles.textColor = [234, 67, 53];
            break;
          case 'Em Manutenção':
            data.cell.styles.textColor = [251, 188, 4];
            break;
          case 'Reservado':
            data.cell.styles.textColor = [26, 115, 232];
            break;
        }
      }
    }
  });
  
  // Análise de disponibilidade
  const totalVehicles = vehiclesByStatus.reduce((sum, status) => sum + status.count, 0);
  const availableVehicles = vehiclesByStatus.find(s => s.status === 'Disponível')?.count || 0;
  const rentedVehicles = vehiclesByStatus.find(s => s.status === 'Alugado')?.count || 0;
  const maintenanceVehicles = vehiclesByStatus.find(s => s.status === 'Em Manutenção')?.count || 0;
  const reservedVehicles = vehiclesByStatus.find(s => s.status === 'Reservado')?.count || 0;
  
  const occupancyRate = totalVehicles > 0 ? ((rentedVehicles / totalVehicles) * 100).toFixed(1) : '0.0';
  const availabilityRate = totalVehicles > 0 ? ((availableVehicles / totalVehicles) * 100).toFixed(1) : '0.0';
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Indicador', 'Valor', 'Observação']],
    body: [
      ['Taxa de Ocupação', `${occupancyRate}%`, 'Veículos atualmente alugados'],
      ['Taxa de Disponibilidade', `${availabilityRate}%`, 'Veículos prontos para locação'],
      ['Veículos em Manutenção', maintenanceVehicles.toString(), 'Requer atenção operacional'],
      ['Veículos Reservados', reservedVehicles.toString(), 'Comprometidos para futuras locações']
    ],
    theme: 'grid',
    headStyles: { fillColor: [26, 115, 232] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    columnStyles: {
      1: { fontStyle: 'bold', halign: 'center' }
    }
  });
  
  addFooter(doc);
  doc.save(`relatorio_status_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`);
};

// Relatório Geral (Dashboard)
export const generateDashboardReport = (stats: {
  totalVehicles: number;
  availableVehicles: number;
  activeContracts: number;
  totalRevenue: number;
  revenueByDay: { day: string; revenue: number }[];
  vehiclesByCategory: { category: string; count: number }[];
}) => {
  const doc = new jsPDF();
  
  const startY = addHeader(doc, 'RELATÓRIO GERAL DO SISTEMA', 'Visão consolidada de todas as operações');
  
  // Indicadores principais
  doc.autoTable({
    startY: startY,
    head: [['Indicador', 'Valor', 'Descrição']],
    body: [
      ['Total de Veículos', stats.totalVehicles.toString(), 'Frota completa cadastrada'],
      ['Veículos Disponíveis', stats.availableVehicles.toString(), 'Prontos para locação'],
      ['Contratos Ativos', stats.activeContracts.toString(), 'Locações em andamento'],
      ['Receita Total', `R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Faturamento acumulado']
    ],
    theme: 'grid',
    headStyles: { fillColor: [0, 0, 0] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    columnStyles: {
      1: { fontStyle: 'bold', halign: 'center' }
    }
  });
  
  // Distribuição por categoria
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Categoria', 'Quantidade', 'Participação']],
    body: stats.vehiclesByCategory.map(cat => [
      cat.category,
      cat.count.toString(),
      `${((cat.count / stats.totalVehicles) * 100).toFixed(1)}%`
    ]),
    theme: 'striped',
    headStyles: { fillColor: [26, 115, 232] },
    margin: { left: reportConfig.margin, right: reportConfig.margin }
  });
  
  // Análise de performance
  const occupancyRate = stats.totalVehicles > 0 
    ? (((stats.totalVehicles - stats.availableVehicles) / stats.totalVehicles) * 100).toFixed(1)
    : '0.0';
  
  const averageDailyRevenue = stats.revenueByDay.length > 0
    ? stats.revenueByDay.reduce((sum, day) => sum + day.revenue, 0) / stats.revenueByDay.length
    : 0;
  
  doc.autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Análise de Performance', 'Valor']],
    body: [
      ['Taxa de Ocupação da Frota', `${occupancyRate}%`],
      ['Receita Média Diária', `R$ ${averageDailyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
      ['Receita por Veículo', `R$ ${(stats.totalRevenue / stats.totalVehicles).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [52, 168, 83] },
    margin: { left: reportConfig.margin, right: reportConfig.margin },
    columnStyles: {
      1: { fontStyle: 'bold', halign: 'center' }
    }
  });
  
  addFooter(doc);
  doc.save(`relatorio_geral_${format(new Date(), 'ddMMyyyy_HHmm')}.pdf`);
};