'use client';
import { vars } from 'nativewind';

import { colors } from '@/theme/tokens/colors';
import { generateRadiusVars } from '@/theme/tokens/radius';
import { generateSpacingVars } from '@/theme/tokens/spacing';
import { hexToRgb } from '@/theme/utils';

// Gera CSS variables a partir dos tokens de cores
function generateColorVarsFromTokens() {
  return {
    // Primary (dos tokens)
    '--color-primary-0': hexToRgb(colors.primary[50]),
    '--color-primary-50': hexToRgb(colors.primary[50]),
    '--color-primary-100': hexToRgb(colors.primary[100]),
    '--color-primary-200': hexToRgb(colors.primary[200]),
    '--color-primary-300': hexToRgb(colors.primary[300]),
    '--color-primary-400': hexToRgb(colors.primary[400]),
    '--color-primary-500': hexToRgb(colors.primary[500]),
    '--color-primary-600': hexToRgb(colors.primary[600]),
    '--color-primary-700': hexToRgb(colors.primary[700]),
    '--color-primary-800': hexToRgb(colors.primary[800]),
    '--color-primary-900': hexToRgb(colors.primary[900]),
    '--color-primary-950': hexToRgb(colors.primary[950]),

    // Secondary (dos tokens)
    '--color-secondary-0': hexToRgb(colors.secondary[50]),
    '--color-secondary-50': hexToRgb(colors.secondary[50]),
    '--color-secondary-100': hexToRgb(colors.secondary[100]),
    '--color-secondary-200': hexToRgb(colors.secondary[200]),
    '--color-secondary-300': hexToRgb(colors.secondary[300]),
    '--color-secondary-400': hexToRgb(colors.secondary[400]),
    '--color-secondary-500': hexToRgb(colors.secondary[500]),
    '--color-secondary-600': hexToRgb(colors.secondary[600]),
    '--color-secondary-700': hexToRgb(colors.secondary[700]),
    '--color-secondary-800': hexToRgb(colors.secondary[800]),
    '--color-secondary-900': hexToRgb(colors.secondary[900]),
    '--color-secondary-950': hexToRgb(colors.secondary[950]),

    // Tertiary (dos tokens)
    '--color-tertiary-0': hexToRgb(colors.tertiary[0]),
    '--color-tertiary-50': hexToRgb(colors.tertiary[50]),
    '--color-tertiary-100': hexToRgb(colors.tertiary[100]),
    '--color-tertiary-200': hexToRgb(colors.tertiary[200]),
    '--color-tertiary-300': hexToRgb(colors.tertiary[300]),
    '--color-tertiary-400': hexToRgb(colors.tertiary[400]),
    '--color-tertiary-500': hexToRgb(colors.tertiary[500]),
    '--color-tertiary-600': hexToRgb(colors.tertiary[600]),
    '--color-tertiary-700': hexToRgb(colors.tertiary[700]),
    '--color-tertiary-800': hexToRgb(colors.tertiary[800]),
    '--color-tertiary-900': hexToRgb(colors.tertiary[900]),
    '--color-tertiary-950': hexToRgb(colors.tertiary[950]),

    // Typography (dos tokens)
    '--color-typography-0': hexToRgb(colors.typography[0]),
    '--color-typography-50': hexToRgb(colors.typography[50]),
    '--color-typography-100': hexToRgb(colors.typography[100]),
    '--color-typography-200': hexToRgb(colors.typography[200]),
    '--color-typography-300': hexToRgb(colors.typography[300]),
    '--color-typography-400': hexToRgb(colors.typography[400]),
    '--color-typography-500': hexToRgb(colors.typography[500]),
    '--color-typography-600': hexToRgb(colors.typography[600]),
    '--color-typography-700': hexToRgb(colors.typography[700]),
    '--color-typography-800': hexToRgb(colors.typography[800]),
    '--color-typography-900': hexToRgb(colors.typography[900]),
    '--color-typography-950': hexToRgb(colors.typography[950]),

    // Success (dos tokens)
    '--color-success-0': hexToRgb(colors.success[50]),
    '--color-success-50': hexToRgb(colors.success[50]),
    '--color-success-100': hexToRgb(colors.success[100]),
    '--color-success-200': hexToRgb(colors.success[200]),
    '--color-success-300': hexToRgb(colors.success[300]),
    '--color-success-400': hexToRgb(colors.success[400]),
    '--color-success-500': hexToRgb(colors.success[500]),
    '--color-success-600': hexToRgb(colors.success[600]),
    '--color-success-700': hexToRgb(colors.success[700]),
    '--color-success-800': hexToRgb(colors.success[800]),
    '--color-success-900': hexToRgb(colors.success[900]),
    '--color-success-950': hexToRgb(colors.success[950]),

    // Error (dos tokens)
    '--color-error-0': hexToRgb(colors.error[50]),
    '--color-error-50': hexToRgb(colors.error[50]),
    '--color-error-100': hexToRgb(colors.error[100]),
    '--color-error-200': hexToRgb(colors.error[200]),
    '--color-error-300': hexToRgb(colors.error[300]),
    '--color-error-400': hexToRgb(colors.error[400]),
    '--color-error-500': hexToRgb(colors.error[500]),
    '--color-error-600': hexToRgb(colors.error[600]),
    '--color-error-700': hexToRgb(colors.error[700]),
    '--color-error-800': hexToRgb(colors.error[800]),
    '--color-error-900': hexToRgb(colors.error[900]),
    '--color-error-950': hexToRgb(colors.error[950]),

    // Warning (dos tokens)
    '--color-warning-0': hexToRgb(colors.warning[50]),
    '--color-warning-50': hexToRgb(colors.warning[50]),
    '--color-warning-100': hexToRgb(colors.warning[100]),
    '--color-warning-200': hexToRgb(colors.warning[200]),
    '--color-warning-300': hexToRgb(colors.warning[300]),
    '--color-warning-400': hexToRgb(colors.warning[400]),
    '--color-warning-500': hexToRgb(colors.warning[500]),
    '--color-warning-600': hexToRgb(colors.warning[600]),
    '--color-warning-700': hexToRgb(colors.warning[700]),
    '--color-warning-800': hexToRgb(colors.warning[800]),
    '--color-warning-900': hexToRgb(colors.warning[900]),
    '--color-warning-950': hexToRgb(colors.warning[950]),

    // Info (dos tokens)
    '--color-info-0': hexToRgb(colors.info[50]),
    '--color-info-50': hexToRgb(colors.info[50]),
    '--color-info-100': hexToRgb(colors.info[100]),
    '--color-info-200': hexToRgb(colors.info[200]),
    '--color-info-300': hexToRgb(colors.info[300]),
    '--color-info-400': hexToRgb(colors.info[400]),
    '--color-info-500': hexToRgb(colors.info[500]),
    '--color-info-600': hexToRgb(colors.info[600]),
    '--color-info-700': hexToRgb(colors.info[700]),
    '--color-info-800': hexToRgb(colors.info[800]),
    '--color-info-900': hexToRgb(colors.info[900]),
    '--color-info-950': hexToRgb(colors.info[950]),

    // Gray (dos tokens)
    '--color-gray-50': hexToRgb(colors.gray[50]),
    '--color-gray-100': hexToRgb(colors.gray[100]),
    '--color-gray-200': hexToRgb(colors.gray[200]),
    '--color-gray-300': hexToRgb(colors.gray[300]),
    '--color-gray-400': hexToRgb(colors.gray[400]),
    '--color-gray-500': hexToRgb(colors.gray[500]),
    '--color-gray-600': hexToRgb(colors.gray[600]),
    '--color-gray-700': hexToRgb(colors.gray[700]),
    '--color-gray-800': hexToRgb(colors.gray[800]),
    '--color-gray-900': hexToRgb(colors.gray[900]),
    '--color-gray-950': hexToRgb(colors.gray[950]),
  };
}

// Variáveis estáticas que não vêm dos tokens (mantidas do Gluestack original)
const staticVars = {
  /* Outline */
  '--color-outline-0': '253 254 254',
  '--color-outline-50': '243 243 243',
  '--color-outline-100': '230 230 230',
  '--color-outline-200': '221 220 219',
  '--color-outline-300': '211 211 211',
  '--color-outline-400': '165 163 163',
  '--color-outline-500': '140 141 141',
  '--color-outline-600': '115 116 116',
  '--color-outline-700': '83 82 82',
  '--color-outline-800': '65 65 65',
  '--color-outline-900': '39 38 36',
  '--color-outline-950': '26 23 23',

  /* Background */
  '--color-background-0': '255 255 255',
  '--color-background-50': '246 246 246',
  '--color-background-100': '242 241 241',
  '--color-background-200': '220 219 219',
  '--color-background-300': '213 212 212',
  '--color-background-400': '162 163 163',
  '--color-background-500': '142 142 142',
  '--color-background-600': '116 116 116',
  '--color-background-700': '83 82 82',
  '--color-background-800': '65 64 64',
  '--color-background-900': '39 38 37',
  '--color-background-950': '18 18 18',

  /* Background Special */
  '--color-background-error': '254 241 241',
  '--color-background-warning': '255 243 234',
  '--color-background-success': '237 252 242',
  '--color-background-muted': '247 248 247',
  '--color-background-info': '235 248 254',

  /* Focus Ring Indicator */
  '--color-indicator-primary': '55 55 55',
  '--color-indicator-info': '83 153 236',
  '--color-indicator-error': '185 28 28',
};

// Variáveis estáticas para dark mode
const staticVarsDark = {
  /* Outline */
  '--color-outline-0': '26 23 23',
  '--color-outline-50': '39 38 36',
  '--color-outline-100': '65 65 65',
  '--color-outline-200': '83 82 82',
  '--color-outline-300': '115 116 116',
  '--color-outline-400': '140 141 141',
  '--color-outline-500': '165 163 163',
  '--color-outline-600': '211 211 211',
  '--color-outline-700': '221 220 219',
  '--color-outline-800': '230 230 230',
  '--color-outline-900': '243 243 243',
  '--color-outline-950': '253 254 254',

  /* Background */
  '--color-background-0': '18 18 18',
  '--color-background-50': '39 38 37',
  '--color-background-100': '65 64 64',
  '--color-background-200': '83 82 82',
  '--color-background-300': '116 116 116',
  '--color-background-400': '142 142 142',
  '--color-background-500': '162 163 163',
  '--color-background-600': '213 212 212',
  '--color-background-700': '229 228 228',
  '--color-background-800': '242 241 241',
  '--color-background-900': '246 246 246',
  '--color-background-950': '255 255 255',

  /* Background Special */
  '--color-background-error': '66 43 43',
  '--color-background-warning': '65 47 35',
  '--color-background-success': '28 43 33',
  '--color-background-muted': '51 51 51',
  '--color-background-info': '26 40 46',

  /* Focus Ring Indicator */
  '--color-indicator-primary': '247 247 247',
  '--color-indicator-info': '161 199 245',
  '--color-indicator-error': '232 70 69',
};

// Gera as variáveis dos tokens
const tokenVars = generateColorVarsFromTokens();
const spacingVars = generateSpacingVars();
const radiusVars = generateRadiusVars();

// Combina tokens com variáveis estáticas
export const config = {
  light: vars({
    ...tokenVars,
    ...spacingVars,
    ...radiusVars,
    ...staticVars,
  }),
  dark: vars({
    ...tokenVars,
    ...spacingVars,
    ...radiusVars,
    ...staticVarsDark,
  }),
};
