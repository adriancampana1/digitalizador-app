import type { ViewProps } from 'react-native';

import { Box } from './ui/box';

type ContainerPropsType = ViewProps & {
  children: React.ReactNode;
  horizontal?: boolean;
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
};

const Container = ({
  children,
  horizontal,
  justifyContent,
  alignItems,
  ...props
}: ContainerPropsType) => (
  <Box
    className={`
      ${horizontal ? 'flex-row' : 'flex-col'}
      ${justifyContent ? `justify-${justifyContent}` : 'justify-normal'}
      ${alignItems ? `items-${alignItems}` : 'items-start'}

      `}
    {...props}
  >
    {children}
  </Box>
);

export default Container;
