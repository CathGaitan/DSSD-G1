import React from 'react';

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  error?: string;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ 
  label, 
  name, 
  value, 
  onChange, 
  required, 
  placeholder, 
  rows = 4,
  error
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}  // ✅ Estilo condicional agregado
    />
    {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
      <span>⚠️</span> {error}
    </p>}  {/* ✅ Mensaje de error agregado */}
  </div>
);