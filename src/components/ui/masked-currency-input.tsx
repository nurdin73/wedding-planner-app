import React from 'react';
import { maskCurrency, unmaskCurrency } from '../../utils/mask.utils';

export interface MaskedCurrencyInputProps {
  value: string;
  onChange: (masked: string, rawNumber: number) => void;
  placeholder?: string;
  hasError?: boolean;
  dataTestId?: string;
  className?: string;
  autoFocus?: boolean;
  id?: string;
}

export const MaskedCurrencyInput: React.FC<MaskedCurrencyInputProps> = ({
  value,
  onChange,
  placeholder = '0',
  hasError = false,
  dataTestId,
  className = '',
  autoFocus = false,
  id,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const masked = maskCurrency(rawInput);
    const rawNumber = unmaskCurrency(masked);
    onChange(masked, rawNumber);
  };

  return (
    <div className={`relative flex items-center rounded-lg bg-[#FAF8F5] border transition-colors ${
      hasError ? 'border-rose-400 focus-within:border-rose-500' : 'border-[#ECE5DE] focus-within:border-secondary'
    } ${className}`}>
      <span className="pl-3 pr-1 text-xs font-semibold text-[#A89B95] select-none">
        Rp
      </span>
      <input
        id={id}
        data-testid={dataTestId}
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        autoFocus={autoFocus}
        className="w-full py-2 pr-3 pl-1 text-sm bg-transparent text-[#3A302C] placeholder-[#A89B95] focus:outline-none tabular-nums font-medium"
      />
    </div>
  );
};
