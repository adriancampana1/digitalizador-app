import type { theme } from '@/hooks';

import { Text } from '../ui/text';

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'bodySmall'
  | 'bodyLarge'
  | 'caption'
  | 'label'
  | 'button';
type TextAlign = 'left' | 'center' | 'right' | 'justify';

type TextColorSemantic =
  | 'default' // typography-800  — texto principal
  | 'muted' // typography-500  — texto secundário
  | 'inverted' // typography-0   — texto sobre fundo escuro
  | 'link' // primary-500    — links e ações
  | 'success' // success-600    — feedback positivo
  | 'error' // error-500      — feedback negativo
  | 'warning'; // warning-600    — feedback de alerta

type TextColorScale =
  | `primary-${keyof typeof theme.colors.primary}`
  | `secondary-${keyof typeof theme.colors.secondary}`
  | `tertiary-${keyof typeof theme.colors.tertiary}`
  | `accent-${keyof typeof theme.colors.accent}`
  | `typography-${keyof typeof theme.colors.typography}`
  | `success-${keyof typeof theme.colors.success}`
  | `error-${keyof typeof theme.colors.error}`
  | `warning-${keyof typeof theme.colors.warning}`
  | `info-${keyof typeof theme.colors.info}`
  | `gray-${keyof typeof theme.colors.gray}`;

type TextColor = TextColorSemantic | TextColorScale;

/** Mapeia atalhos semânticos para classes NativeWind */
const semanticColorMap: Record<TextColorSemantic, string> = {
  default: 'text-typography-800',
  muted: 'text-typography-500',
  inverted: 'text-typography-0',
  link: 'text-primary-500',
  success: 'text-success-600',
  error: 'text-error-500',
  warning: 'text-warning-600',
};

function getColorClass(color?: TextColor): string {
  if (!color) return '';
  if (color in semanticColorMap) {
    return semanticColorMap[color as TextColorSemantic];
  }
  return `text-${color}`;
}

type AppTextPropsType = {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  bold?: boolean;
  italic?: boolean;
  align?: TextAlign;
  numberOfLines?: number;
  className?: string;
};

const alignStyles: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const variantStyles: Record<
  TextVariant,
  { size: keyof typeof theme.typography.fontSize; bold: boolean }
> = {
  h1: { size: '4xl', bold: true },
  h2: { size: '3xl', bold: true },
  h3: { size: '2xl', bold: true },
  h4: { size: 'xl', bold: true },
  h5: { size: 'lg', bold: true },
  h6: { size: 'md', bold: true },
  body: { size: 'md', bold: false },
  bodySmall: { size: 'sm', bold: false },
  bodyLarge: { size: 'lg', bold: false },
  caption: { size: 'xs', bold: false },
  label: { size: 'sm', bold: false },
  button: { size: 'md', bold: true },
};

export const AppText = ({
  children,
  variant,
  color,
  bold,
  italic = false,
  align = 'left',
  numberOfLines,
  className,
}: AppTextPropsType) => {
  const variantStyle = variant ? variantStyles[variant] : variantStyles.body;
  const alignStyle = align ? alignStyles[align] : alignStyles.left;
  const colorStyle = getColorClass(color);
  const isTruncated = numberOfLines !== undefined && numberOfLines > 0;

  return (
    <Text
      size={variantStyle.size}
      bold={bold ?? variantStyle.bold}
      isTruncated={isTruncated}
      italic={italic}
      numberOfLines={numberOfLines}
      className={`${alignStyle} ${colorStyle} ${className || ''}`}
    >
      {children}
    </Text>
  );
};
