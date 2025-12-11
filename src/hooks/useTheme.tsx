import { appTheme, type AppTheme } from '@/theme/app.theme';

export function useTheme(): AppTheme {
  return appTheme;
}

export const theme = appTheme;
