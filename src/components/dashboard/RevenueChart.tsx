import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  data: {
    month: string;
    revenue: number;
  }[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1A1A1A',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#333333',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `R$ ${context.raw.toLocaleString()}`;
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
          color: '#999999',
        }
      },
      y: {
        grid: {
          color: '#333333',
        },
        ticks: {
          color: '#999999',
          callback: function(value: number) {
            if (value >= 1000) {
              return `R$${value / 1000}k`;
            }
            return `R$${value}`;
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 4,
      }
    }
  };
  
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        data: data.map(item => item.revenue),
        backgroundColor: '#FF6B00',
        hoverBackgroundColor: '#FF8733',
      }
    ]
  };
  
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Receita Mensal</h3>
      <div className="h-64">
        <Bar options={options as any} data={chartData} />
      </div>
    </div>
  );
};

export default RevenueChart;