/**
 * Converte cor hexadecimal para formato RGB (valores separados por espaço)
 * Necessário para compatibilidade com NativeWind/Tailwind CSS variables
 *
 * hexToRgb('#ffffff') // '255 255 255'
 * hexToRgb('#3b82f6') // '59 130 246'
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) {
    console.warn(`[Theme] Invalid hex color: ${hex}`);
    return '0 0 0';
  }
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

/**
 * Gera CSS variables para uma paleta de cores
 * Usado para integração com NativeWind
 *
 * generateColorVars('primary', { 500: '#3b82f6', 600: '#2563eb' })
 * // { '--color-primary-500': '59 130 246', '--color-primary-600': '37 99 235' }
 */
export function generateColorVars(
  prefix: string,
  colorScale: Record<string | number, string>
): Record<string, string> {
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(colorScale)) {
    // Pula cores especiais que não são hex (transparent, etc)
    if (value === 'transparent' || !value.startsWith('#')) {
      continue;
    }
    vars[`--color-${prefix}-${key}`] = hexToRgb(value);
  }

  return vars;
}
