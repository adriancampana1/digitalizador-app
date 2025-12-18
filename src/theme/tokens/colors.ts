export const colors = {
  // Paleta Primária - Azul Escuro (#003D5C)
  // Uso: Cor principal - cabeçalhos, botões primários, títulos
  primary: {
    50: '#e6f0f5',
    100: '#cce1eb',
    200: '#99c3d7',
    300: '#66a5c3',
    400: '#3387af',
    500: '#003D5C', // Cor principal
    600: '#003651',
    700: '#002f46',
    800: '#00283b',
    900: '#002130',
    950: '#001a25',
  },

  // Paleta Secundária - Azul Médio (#004B73)
  // Uso: Cor secundária - elementos de destaque
  secondary: {
    50: '#e6f2f8',
    100: '#cce5f1',
    200: '#99cbe3',
    300: '#66b1d5',
    400: '#3397c7',
    500: '#004B73', // Cor secundária
    600: '#004367',
    700: '#003b5b',
    800: '#00334f',
    900: '#002b43',
    950: '#002337',
  },

  // Paleta de Acento - Laranja (#D97706)
  // Uso: Links de cadastro e textos de destaque
  tertiary: {
    0: '#fffbf5',
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#D97706', // Laranja principal
    600: '#c2690a',
    700: '#9a5308',
    800: '#7c4307',
    900: '#653705',
    950: '#4d2904',
  },

  // Paleta de Acento - Roxo (#7C5CDB)
  // Uso: Botões de cookies e CTAs secundários
  accent: {
    50: '#f5f3fc',
    100: '#ebe7f9',
    200: '#d7cff3',
    300: '#c3b7ed',
    400: '#af9fe7',
    500: '#7C5CDB', // Roxo principal
    600: '#6a4bc8',
    700: '#583ab5',
    800: '#4629a2',
    900: '#34188f',
    950: '#22077c',
  },

  // Tipografia
  // Texto principal: #1F2937 | Texto secundário: #6B7280
  typography: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6B7280', // Texto secundário/muted
    600: '#4b5563',
    700: '#374151',
    800: '#1F2937', // Texto principal
    900: '#111827',
    950: '#030712',
  },

  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },

  // Cinzas - Baseado na identidade visual
  // Fundo geral: #F5F5F5 | Fundo cards: #E8E8E8 | Ícones: #B8C5D0
  gray: {
    50: '#F5F5F5', // Fundo geral das páginas
    100: '#E8E8E8', // Fundo dos cards e seções
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#B8C5D0', // Background dos círculos de ícones
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },

  // Cores de background semânticas
  background: {
    light: '#F5F5F5', // Fundo geral das páginas
    card: '#FFFFFF', // Fundo de cards, modais e áreas de conteúdo
    section: '#E8E8E8', // Fundo dos cards e seções
    icon: '#B8C5D0', // Background dos círculos de ícones
    dark: '#003D5C', // Fundo escuro (primário)
  },

  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

export type Colors = typeof colors;
export type ColorKey = keyof Colors;
