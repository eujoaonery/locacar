import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Contract } from '../types';

export const generateContractPDF = (contract: Contract) => {
  const doc = new jsPDF();
  
  // Configurações
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  
  // Cabeçalho
  doc.setFontSize(20);
  doc.text('LOCA CAR', pageWidth / 2, margin, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text('CONTRATO DE LOCAÇÃO DE VEÍCULO', pageWidth / 2, margin + 10, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Contrato Nº: ${String(contract.id).padStart(6, '0')}`, margin, margin + 25);
  doc.text(`Data: ${format(new Date(), 'dd/MM/yyyy')}`, pageWidth - margin, margin + 25, { align: 'right' });
  
  // Informações do Cliente
  doc.setFontSize(14);
  doc.text('LOCATÁRIO', margin, margin + 40);
  
  doc.setFontSize(12);
  const cliente = contract.client;
  if (cliente) {
    doc.text(`Nome: ${cliente.name}`, margin, margin + 50);
    doc.text(`CPF: ${cliente.cpf}`, margin, margin + 60);
    doc.text(`RG: ${cliente.rg}`, pageWidth - margin - 50, margin + 60);
    doc.text(`Endereço: ${cliente.address}`, margin, margin + 70);
    doc.text(`Telefone: ${cliente.phone}`, margin, margin + 80);
  }
  
  // Informações do Veículo
  doc.setFontSize(14);
  doc.text('VEÍCULO', margin, margin + 100);
  
  doc.setFontSize(12);
  const veiculo = contract.vehicle;
  if (veiculo) {
    doc.text(`Marca/Modelo: ${veiculo.brand} ${veiculo.model}`, margin, margin + 110);
    doc.text(`Ano: ${veiculo.year}`, pageWidth - margin - 50, margin + 110);
    doc.text(`Placa: ${veiculo.license_plate}`, margin, margin + 120);
    doc.text(`Cor: ${veiculo.color}`, pageWidth - margin - 50, margin + 120);
  }
  
  // Informações da Locação
  doc.setFontSize(14);
  doc.text('PERÍODO E VALORES', margin, margin + 140);
  
  doc.setFontSize(12);
  doc.text(`Data de Início: ${format(new Date(contract.start_date), 'dd/MM/yyyy')}`, margin, margin + 150);
  doc.text(`Data de Fim: ${format(new Date(contract.end_date), 'dd/MM/yyyy')}`, pageWidth - margin - 80, margin + 150);
  doc.text(`Valor Total: R$ ${contract.total.toFixed(2)}`, margin, margin + 160);
  
  // Termos e Condições
  doc.setFontSize(14);
  doc.text('TERMOS E CONDIÇÕES', margin, margin + 180);
  
  doc.setFontSize(10);
  const termos = [
    '1. O LOCATÁRIO se compromete a devolver o veículo nas mesmas condições em que o recebeu.',
    '2. É proibido fumar dentro do veículo.',
    '3. O veículo deve ser utilizado apenas em território nacional.',
    '4. Multas de trânsito são de responsabilidade do LOCATÁRIO.',
    '5. O seguro está incluído no valor da locação.',
    '6. Em caso de acidente, o LOCATÁRIO deve comunicar imediatamente a LOCADORA.'
  ];
  
  let y = margin + 190;
  termos.forEach(termo => {
    doc.text(termo, margin, y);
    y += 10;
  });
  
  // Assinaturas
  doc.setFontSize(12);
  doc.text('_____________________________', margin, y + 20);
  doc.text('LOCADORA', margin + 20, y + 30);
  
  doc.text('_____________________________', pageWidth - margin - 80, y + 20);
  doc.text('LOCATÁRIO', pageWidth - margin - 60, y + 30);
  
  // Rodapé
  doc.setFontSize(8);
  doc.text('LOCA CAR - Locadora de Veículos Global', pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  
  // Salvar o PDF
  doc.save(`contrato_${String(contract.id).padStart(6, '0')}.pdf`);
};