
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions, onClick }) => {
  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : '';
  return (
    <div 
      className={`bg-white shadow-lg rounded-xl overflow-hidden ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          {title && <h3 className="text-xl font-semibold text-gray-800">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
    