import { useState } from 'react';

type Rules<T> = Partial<Record<keyof T, (v: string) => string | undefined>>;

export const useFormValidation = <T extends Record<string, string>>(
  fields: T,
  rules: Rules<T>
) => {
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    for (const key in rules) {
      const error = rules[key]?.(fields[key] ?? '');
      if (error) newErrors[key] = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof T) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return { errors, validate, clearError };
};
