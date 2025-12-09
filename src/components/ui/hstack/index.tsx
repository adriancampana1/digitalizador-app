import React from 'react';

import { View } from 'react-native';
import type { ViewProps } from 'react-native';

import { hstackStyle } from './styles';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

type IHStackProps = ViewProps & VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ComponentRef<typeof View>, IHStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <View
        className={hstackStyle({
          space,
          reversed: reversed as boolean,
          class: className,
        })}
        {...props}
        ref={ref}
      />
    );
  }
);

HStack.displayName = 'HStack';

export { HStack };
