import { colors, type Colors } from './tokens/colors';
import { radius, type Radius } from './tokens/radius';
import { spacing, type Spacing } from './tokens/spacing';
import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  type Typography,
} from './tokens/typography';

export interface AppTheme {
  colors: Colors;
  spacing: Spacing;
  radius: Radius;
  typography: Typography;
}

export const appTheme: AppTheme = {
  colors,
  spacing,
  radius,
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
  },
} as const;

export { colors, fontSize, fontWeight, radius, spacing };

export type { Colors, Radius, Spacing, Typography };
