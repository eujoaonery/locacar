import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'accent';
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  description
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 border-primary-100',
    success: 'bg-success-50 text-success-600 border-success-100',
    warning: 'bg-warning-50 text-warning-600 border-warning-100',
    error: 'bg-error-50 text-error-600 border-error-100',
    accent: 'bg-accent-50 text-accent-600 border-accent-100',
  };
  
  return (
    <div className="card card-hover p-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">{value}</h3>
          
          {description && (
            <p className="text-sm text-neutral-500 mb-3">{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center space-x-1">
              {trend.isPositive ? (
                <TrendingUp size={16} className="text-success-500" />
              ) : (
                <TrendingDown size={16} className="text-error-500" />
              )}
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-success-600' : 'text-error-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-neutral-500">vs mês anterior</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-xl border ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;