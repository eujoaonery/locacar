import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface VehicleCategoryPieProps {
  data: {
    category: string;
    count: number;
  }[];
}

const VehicleCategoryPie: React.FC<VehicleCategoryPieProps> = ({ data }) => {
  const colors = [
    '#FF6B00',
    '#14B8A6',
    '#8B5CF6',
    '#EC4899',
    '#F59E0B',
    '#10B981',
  ];
  
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: data.map((_, index) => colors[index % colors.length]),
        borderColor: '#1A1A1A',
        borderWidth: 2,
      }
    ]
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#FFFFFF',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#333333',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      }
    }
  };
  
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Veículos por Categoria</h3>
      <div className="h-64 flex items-center justify-center">
        <Pie data={chartData} options={options as any} />
      </div>
    </div>
  );
};

export default VehicleCategoryPie;