import { ScrollView } from 'react-native';

import type { theme } from '@/hooks';

import { Box } from '../ui/box';

type AppScrollViewContainerPropsType = {
  children: React.ReactNode;
  contentPadding?: keyof typeof theme.spacing;
  paddingHorizontal?: keyof typeof theme.spacing;
  paddingVertical?: keyof typeof theme.spacing;
  backgroundColor?: keyof typeof theme.colors;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  className?: string;
  contentClassName?: string;
};

export const AppScrollViewContainer = ({
  children,
  contentPadding = 'md',
  paddingHorizontal = 'none',
  paddingVertical = 'none',
  backgroundColor = 'white',
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  className = '',
  contentClassName = '',
}: AppScrollViewContainerPropsType) => {
  return (
    <ScrollView
      className={`bg-${backgroundColor} ${contentPadding ? `p-${contentPadding}` : ''} ${paddingHorizontal ? `px-${paddingHorizontal}` : ''} ${paddingVertical ? `py-${paddingVertical}` : ''} ${className}`}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      <Box className={contentClassName}>{children}</Box>
    </ScrollView>
  );
};
