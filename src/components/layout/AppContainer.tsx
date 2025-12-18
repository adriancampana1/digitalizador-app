import type { ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import type { theme } from '@/hooks';

import { Box } from '../ui/box';

type AppContainerVariant = 'safeAreaView' | 'view';
type FlexDirection = 'row' | 'col';
type Spacing = keyof typeof theme.spacing;

type AppContainerPropsType = {
  children: React.ReactNode;
  variant?: AppContainerVariant;
  direction?: FlexDirection;
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
  spacing?: Spacing;
  wrap?: boolean;
  backgroundColor?: keyof typeof theme.colors | 'transparent';
  flex?: boolean;
  paddingHorizontal?: keyof typeof theme.spacing;
  paddingVertical?: keyof typeof theme.spacing;
  className?: string;
  style?: ViewStyle;
};

export const AppContainer = ({
  children,
  variant = 'view',
  direction = 'col',
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  spacing = 'sm',
  wrap = false,
  backgroundColor = 'transparent',
  flex = false,
  paddingHorizontal = '3xl',
  paddingVertical = 'lg',
  className,
  style,
}: AppContainerPropsType) => {
  const Container = variant === 'safeAreaView' ? SafeAreaView : Box;

  return (
    <Container
      className={`flex-${direction} bg-${backgroundColor} ${
        flex ? 'flex-1' : ''
      } ${paddingHorizontal && paddingHorizontal !== 'none' ? `px-${paddingHorizontal}` : ''} ${
        paddingVertical && paddingVertical !== 'none'
          ? `py-${paddingVertical}`
          : ''
      } ${className || ''}
      ${justifyContent ? `justify-${justifyContent}` : ''}
      ${alignItems ? `items-${alignItems}` : ''}
      ${spacing ? `gap-${spacing}` : ''}
      ${wrap ? 'flex-wrap' : ''}`}
      style={style}
    >
      {children}
    </Container>
  );
};
