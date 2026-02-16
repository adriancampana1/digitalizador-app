import type { ViewStyle } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import type { theme } from '@/hooks';

import { Box } from '../ui/box';

type AppContainerVariant = 'safeAreaView' | 'view';
type FlexDirection = 'row' | 'col';
type Spacing = keyof typeof theme.spacing;

type JustifyContent =
  | 'center'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around';

type AlignItems = 'center' | 'flex-start' | 'flex-end' | 'stretch';

const justifyMap: Record<JustifyContent, string> = {
  center: 'justify-center',
  'flex-start': 'justify-start',
  'flex-end': 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
};

const alignMap: Record<AlignItems, string> = {
  center: 'items-center',
  'flex-start': 'items-start',
  'flex-end': 'items-end',
  stretch: 'items-stretch',
};

type AppContainerPropsType = {
  children: React.ReactNode;
  variant?: AppContainerVariant;
  direction?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
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
      ${justifyContent ? justifyMap[justifyContent] : ''}
      ${alignItems ? alignMap[alignItems] : ''}
      ${spacing ? `gap-${spacing}` : ''}
      ${wrap ? 'flex-wrap' : ''}`}
      style={style}
    >
      {children}
    </Container>
  );
};
