import { View } from 'react-native';

type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type SpacerDirection = 'horizontal' | 'vertical';

type AppSpacerPropsType = {
  size?: SpacerSize;
  flex?: boolean;
  direction?: SpacerDirection;
};

const sizeStyles: Record<SpacerDirection, Record<SpacerSize, string>> = {
  vertical: {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
    xl: 'h-8',
    '2xl': 'h-10',
    '3xl': 'h-12',
    '4xl': 'h-16',
  },
  horizontal: {
    xs: 'w-1',
    sm: 'w-2',
    md: 'w-4',
    lg: 'w-6',
    xl: 'w-8',
    '2xl': 'w-10',
    '3xl': 'w-12',
    '4xl': 'w-16',
  },
};

export const AppSpacer = ({
  size = 'md',
  flex = false,
  direction = 'vertical',
}: AppSpacerPropsType) => {
  if (flex) {
    return <View className="flex-1" />;
  }

  const sizeClass = sizeStyles[direction][size];

  return <View className={sizeClass} />;
};
