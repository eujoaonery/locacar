import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  color?: 'primary' | 'white' | 'neutral';
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  className = '',
  color = 'primary'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
    neutral: 'border-neutral-300 border-t-neutral-600',
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        border-2
        ${colorClasses[color]}
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Carregando"
    />
  );
};

export default Loader;