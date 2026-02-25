import { Pressable } from 'react-native';

import { Card } from '../ui/card';

type CardVariant = 'elevated' | 'outline' | 'filled' | 'ghost';
type CardSize = 'sm' | 'md' | 'lg';

type AppCardPropsType = {
  children: React.ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  pressable?: boolean;
  onPress?: () => void;
  className?: string;
};

export const AppCard = ({
  children,
  variant = 'elevated',
  size = 'md',
  pressable = false,
  onPress,
  className,
}: AppCardPropsType) => {
  const cardContent = (
    <Card variant={variant} size={size} className={className}>
      {children}
    </Card>
  );

  if (pressable && onPress) {
    return <Pressable onPress={onPress}>{cardContent}</Pressable>;
  }

  return cardContent;
};
