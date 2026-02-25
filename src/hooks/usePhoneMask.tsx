import { useState } from 'react';

export const usePhoneMask = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);

  const applyMask = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 11);
    let masked = digits;

    if (digits.length > 0) masked = `(${digits.slice(0, 2)}`;
    if (digits.length > 2) masked += `) ${digits.slice(2, 7)}`;
    if (digits.length > 7) masked += `-${digits.slice(7, 11)}`;

    setValue(masked);
  };

  const rawValue = value.replace(/\D/g, '');

  return { value, rawValue, applyMask };
};
