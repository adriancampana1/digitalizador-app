export const radius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
} as const;

export const borderRadius = radius;

/**
 * Gera CSS variables para border-radius
 * Formato: { '--radius-sm': '4px', '--radius-md': '6px', ... }
 */
export function generateRadiusVars(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(radius)) {
    vars[`--radius-${key}`] = `${value}px`;
  }
  return vars;
}

/**
 * Gera objeto para Tailwind theme.extend.borderRadius
 * Formato: { 'sm': 'var(--radius-sm)', 'md': 'var(--radius-md)', ... }
 */
export function getTailwindBorderRadius(): Record<string, string> {
  const tailwindRadius: Record<string, string> = {};
  for (const key of Object.keys(radius)) {
    tailwindRadius[key] = `var(--radius-${key})`;
  }
  return tailwindRadius;
}

export type Radius = typeof radius;
export type RadiusKey = keyof Radius;
