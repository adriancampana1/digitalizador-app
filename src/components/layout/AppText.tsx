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

type AppTextPropsType = {
  children: React.ReactNode;
  variant?: TextVariant;
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
  bold,
  italic = false,
  align = 'left',
  numberOfLines,
  className,
}: AppTextPropsType) => {
  const variantStyle = variant ? variantStyles[variant] : variantStyles.body;
  const alignStyle = align ? alignStyles[align] : alignStyles.left;
  const isTruncated = numberOfLines !== undefined && numberOfLines > 0;

  return (
    <Text
      size={variantStyle.size}
      bold={bold ?? variantStyle.bold}
      isTruncated={isTruncated}
      italic={italic}
      numberOfLines={numberOfLines}
      className={`${alignStyle} ${className || ''}`}
    >
      {children}
    </Text>
  );
};
