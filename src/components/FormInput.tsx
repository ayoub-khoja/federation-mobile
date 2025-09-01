"use client";

interface FormInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isRtl?: boolean;
  required?: boolean;
}

export default function FormInput({ 
  type, 
  placeholder, 
  value, 
  onChange, 
  isRtl = false, 
  required = false 
}: FormInputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-gray-700 placeholder-gray-400 ${isRtl ? 'text-right font-arabic' : 'text-left'}`}
      required={required}
      dir={isRtl ? 'rtl' : 'ltr'}
    />
  );
}












