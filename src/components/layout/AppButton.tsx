/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '../ui/button';

type ButtonVariant = 'solid' | 'outline' | 'link';
type ButtonAction =
  | 'primary'
  | 'secondary'
  | 'positive'
  | 'negative'
  | 'default';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

type AppButtonPropsType = {
  title: string;
  variant?: ButtonVariant;
  action?: ButtonAction;
  onPress?: () => void;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  isDisabled?: boolean;
  leftIcon?: React.ComponentType<any>;
  rightIcon?: React.ComponentType<any>;
  fullWidth?: boolean;
  className?: string;
};

export const AppButton = ({
  title,
  variant = 'solid',
  action = 'primary',
  onPress,
  size = 'md',
  isLoading = false,
  loadingText,
  isDisabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
}: AppButtonPropsType) => {
  const fullWidthClass = fullWidth ? 'w-full' : '';
  const combinedClassName =
    `${fullWidthClass} rounded-lg h-16 ${className ?? ''}`.trim();

  return (
    <Button
      disabled={isDisabled || isLoading}
      onPress={onPress}
      variant={variant}
      action={action}
      size={size}
      className={combinedClassName || undefined}
    >
      {isLoading && <ButtonSpinner />}
      {!isLoading && leftIcon && <ButtonIcon as={leftIcon} />}
      <ButtonText className="text-lg mx-1">
        {isLoading && loadingText ? loadingText : title}
      </ButtonText>
      {!isLoading && rightIcon && <ButtonIcon as={rightIcon} />}
    </Button>
  );
};
