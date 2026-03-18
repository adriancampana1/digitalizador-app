export const formatPhone = (value?: string): string => {
  if (!value) return '(00) 00000-0000';
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 11)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  if (digits.length === 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return value;
};
