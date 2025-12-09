import React from 'react';

import type { ViewProps } from 'react-native';
import { View } from 'react-native';

import { cardStyle } from './styles';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

type ICardProps = ViewProps &
  VariantProps<typeof cardStyle> & { className?: string };

const Card = React.forwardRef<React.ComponentRef<typeof View>, ICardProps>(
  ({ className, size = 'md', variant = 'elevated', ...props }, ref) => {
    return (
      <View
        className={cardStyle({ size, variant, class: className })}
        {...props}
        ref={ref}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };
