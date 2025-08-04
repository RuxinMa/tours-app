import type { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label 
        htmlFor={props.id} 
        className="block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          className={`
            block w-full pl-4 pr-3 py-3 
            border border-gray-300 rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
            transition duration-200 text-gray-900 placeholder-gray-500
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;