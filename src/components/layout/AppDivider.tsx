import { Divider } from '../ui/divider';

type Orientation = 'horizontal' | 'vertical';
type DividerColor = 'primary' | 'secondary' | 'muted' | 'light';
type DividerThickness = 'thin' | 'medium' | 'thick';
type DividerSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';

type AppDividerPropsType = {
  orientation?: Orientation;
  color?: DividerColor;
  thickness?: DividerThickness;
  spacing?: DividerSpacing;
  className?: string;
};

const colorStyles: Record<DividerColor, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-300',
  muted: 'bg-typography-200',
  light: 'bg-typography-100',
};

const thicknessStyles: Record<Orientation, Record<DividerThickness, string>> = {
  horizontal: {
    thin: 'h-px',
    medium: 'h-0.5',
    thick: 'h-1',
  },
  vertical: {
    thin: 'w-px',
    medium: 'w-0.5',
    thick: 'w-1',
  },
};

const spacingStyles: Record<Orientation, Record<DividerSpacing, string>> = {
  horizontal: {
    none: '',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
  },
  vertical: {
    none: '',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6',
    xl: 'mx-8',
  },
};

export const AppDivider = ({
  orientation = 'horizontal',
  color = 'primary',
  thickness = 'thin',
  spacing = 'none',
  className,
}: AppDividerPropsType) => {
  const colorClass = colorStyles[color];
  const thicknessClass = thicknessStyles[orientation][thickness];
  const spacingClass = spacingStyles[orientation][spacing];

  const combinedClassName =
    `${colorClass} ${thicknessClass} ${spacingClass} ${className ?? ''}`.trim();

  return <Divider orientation={orientation} className={combinedClassName} />;
};

/**
 * - [ ] FINALIZAR COMPONENTES DE LAYOUT
 *   - [X] AppDivider
 *   - [ ] AppSpacer
 *   - [ ] AppInput
 */
