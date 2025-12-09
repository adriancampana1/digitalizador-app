import React from 'react';

import { hstackStyle } from './styles';

import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';

type IHStackProps = React.ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof hstackStyle>;

const HStack = React.forwardRef<React.ComponentRef<'div'>, IHStackProps>(
  ({ className, space, reversed, ...props }, ref) => {
    return (
      <div
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
