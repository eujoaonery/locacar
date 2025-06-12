import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: {
    day: string;
    revenue: number;
  }[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(0, 0, 0, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        displayColors: false,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: function(context: any) {
            return `${context[0].label}`;
          },
          label: function(context: any) {
            return `Receita: R$ ${context.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 10,
        },
        border: {
          display: false,
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            weight: '500',
          },
          padding: 15,
          callback: function(value: any) {
            if (value >= 1000000) {
              return `R$ ${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `R$ ${(value / 1000).toFixed(0)}k`;
            }
            return `R$ ${value}`;
          }
        },
        border: {
          display: false,
        }
      }
    },
    elements: {
      point: {
        radius: 6,
        hoverRadius: 8,
        backgroundColor: '#000000',
        borderColor: '#FFFFFF',
        borderWidth: 3,
        hoverBorderWidth: 4,
      },
      line: {
        tension: 0.4,
        borderWidth: 3,
      }
    }
  };
  
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        data: data.map(item => item.revenue),
        borderColor: '#000000',
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            return null;
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
          gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.15)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.02)');
          
          return gradient;
        },
        fill: true,
        pointBackgroundColor: '#000000',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#333333',
        pointHoverBorderColor: '#FFFFFF',
        pointBorderWidth: 3,
        pointHoverBorderWidth: 4,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 3,
        tension: 0.4,
      }
    ]
  };
  
  return (
    <div className="card p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-neutral-100/50 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Receita Diária</h3>
            <p className="text-sm text-neutral-500 mt-1">Evolução da receita ao longo dos dias</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-black"></div>
            <span className="text-sm text-neutral-600 font-medium">Receita</span>
          </div>
        </div>
        
        <div className="h-64 relative">
          <Line options={options as any} data={chartData} />
        </div>
        
        {/* Stats below chart */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-neutral-100">
          <div className="text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Total</p>
            <p className="text-lg font-bold text-neutral-900">
              R$ {data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Média</p>
            <p className="text-lg font-bold text-neutral-900">
              R$ {(data.reduce((sum, item) => sum + item.revenue, 0) / data.length || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Pico</p>
            <p className="text-lg font-bold text-neutral-900">
              R$ {Math.max(...data.map(item => item.revenue)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;