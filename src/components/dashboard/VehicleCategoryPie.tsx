import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

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
    { bg: '#FF6B00', border: '#FF8733' },
    { bg: '#14B8A6', border: '#0D9488' },
    { bg: '#8B5CF6', border: '#7C3AED' },
    { bg: '#EC4899', border: '#DB2777' },
    { bg: '#F59E0B', border: '#D97706' },
    { bg: '#10B981', border: '#059669' },
    { bg: '#3B82F6', border: '#2563EB' },
    { bg: '#EF4444', border: '#DC2626' },
  ];
  
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const chartData = {
    labels: data.map(item => item.category),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: data.map((_, index) => colors[index % colors.length].bg),
        borderColor: data.map((_, index) => colors[index % colors.length].border),
        borderWidth: 2,
        hoverBorderWidth: 3,
        cutout: '65%',
        spacing: 2,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: true,
        usePointStyle: true,
        pointStyle: 'circle',
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: function(context: any) {
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} veículos (${percentage}%)`;
          }
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
    hover: {
      animationDuration: 200,
    }
  };
  
  return (
    <div className="card p-6 relative overflow-hidden h-96">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-full -translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Veículos por Categoria</h3>
          <p className="text-sm text-neutral-500 mt-1">Distribuição da frota por tipo de veículo</p>
        </div>
        
        <div className="flex-1 flex flex-col min-h-0">
          <div className="h-48 flex items-center justify-center relative mb-4">
            <Doughnut data={chartData} options={options as any} />
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-neutral-900">{total}</p>
              <p className="text-xs text-neutral-500 uppercase tracking-wider">Total</p>
            </div>
          </div>
          
          {/* Custom legend with scrollbar */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="space-y-2 pr-2">
              {data.map((item, index) => {
                const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0';
                const color = colors[index % colors.length];
                
                return (
                  <div key={item.category} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div 
                        className="w-3 h-3 rounded-full border flex-shrink-0"
                        style={{ 
                          backgroundColor: color.bg,
                          borderColor: color.border
                        }}
                      ></div>
                      <span className="font-medium text-neutral-900 text-sm truncate">{item.category}</span>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-semibold text-neutral-900 text-sm">{item.count}</p>
                      <p className="text-xs text-neutral-500">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCategoryPie;