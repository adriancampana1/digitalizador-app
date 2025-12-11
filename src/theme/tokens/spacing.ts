export const spacing = {
  none: 0,
  '2xs': 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
} as const;

/**
 * Gera CSS variables para spacing
 * Formato: { '--spacing-sm': '8px', '--spacing-md': '12px', ... }
 */
export function generateSpacingVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(spacing)) {
    vars[`--spacing-${key}`] = `${value}px`;
  }
  return vars;
}

/**
 * Gera objeto para Tailwind theme.extend.spacing
 * Formato: { 'sm': 'var(--spacing-sm)', 'md': 'var(--spacing-md)', ... }
 */
export function getTailwindSpacing(): Record<string, string> {
  const tailwindSpacing: Record<string, string> = {};
  for (const key of Object.keys(spacing)) {
    tailwindSpacing[key] = `var(--spacing-${key})`;
  }
  return tailwindSpacing;
}

export type Spacing = typeof spacing;
export type SpacingKey = keyof Spacing;
