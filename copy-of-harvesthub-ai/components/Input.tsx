
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  inputClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, name, error, icon, className = '', inputClassName = '', type = "text", ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          className={`block w-full px-3 py-2 border ${error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-md shadow-sm sm:text-sm ${icon ? 'pl-10' : ''} ${inputClassName}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};


interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  textareaClassName?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, name, error, className = '', textareaClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={4}
        className={`block w-full px-3 py-2 border ${error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-gray-300 focus:ring-primary focus:border-primary'} rounded-md shadow-sm sm:text-sm ${textareaClassName}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  selectClassName?: string;
  // Fix: Add placeholder to SelectProps
  placeholder?: string; 
}

export const Select: React.FC<SelectProps> = ({ label, name, error, options, className = '', selectClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`block w-full px-3 py-2 border ${error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-gray-300 focus:ring-primary focus:border-primary'} bg-white rounded-md shadow-sm sm:text-sm ${selectClassName}`}
        {...props}
      >
        {/* Fix: Check props.placeholder before rendering the placeholder option */}
        {props.placeholder && <option value="">{props.placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}


export default Input;