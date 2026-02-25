export const authValidations = {
  phone: (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Telefone é obrigatório';
    if (digits.length < 10) return 'Telefone inválido';
  },
  name: (value: string) => {
    if (!value.trim()) return 'Nome é obrigatório';
    if (value.trim().length < 2) return 'Nome muito curto';
  },
  password: (value: string) => {
    if (!value) return 'Senha é obrigatória';
    if (value.length < 6) return 'Senha deve ter no mínimo 6 caracteres';
  },
};
