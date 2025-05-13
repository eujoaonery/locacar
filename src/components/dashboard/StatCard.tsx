import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary'
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  };
  
  return (
    <div className="card p-6 animate-fade-in transition-all duration-300 hover:transform hover:translate-y-[-5px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-white">{value}</h3>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 text-xs ml-1">from last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;