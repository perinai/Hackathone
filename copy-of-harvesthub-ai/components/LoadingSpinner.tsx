
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // e.g. text-primary
  className?: string;
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-primary',
  className = '',
  fullScreen = false,
  message
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-4 border-t-transparent ${sizeClasses[size]} ${color} border-current ${className}`}>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex flex-col items-center justify-center z-50">
        {spinner}
        {message && <p className="mt-4 text-white text-lg font-semibold">{message}</p>}
      </div>
    );
  }

  if(message) {
    return (
        <div className="flex flex-col items-center justify-center">
            {spinner}
            <p className={`mt-2 ${color.replace('text-', 'text-')} text-sm`}>{message}</p>
        </div>
    )
  }

  return spinner;
};

export default LoadingSpinner;
    