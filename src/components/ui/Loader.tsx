import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        border-primary 
        border-t-transparent
        animate-spin
        ${className}
      `}
    />
  );
};

export default Loader;