/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef } from 'react';

import { Pressable, TextInput, type TextInputProps, View } from 'react-native';

import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '../ui/form-control';
import { AlertCircleIcon, Icon } from '../ui/icon';

type InputVariant = 'outline' | 'underlined' | 'rounded';
type KeyboardType = 'default' | 'email-address' | 'numeric' | 'phone-pad';

type AppInputPropsType = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'placeholder' | 'keyboardType' | 'secureTextEntry'
> & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  variant?: InputVariant;
  isDisabled?: boolean;
  isRequired?: boolean;
  keyboardType?: KeyboardType;
  secureTextEntry?: boolean;
  leftIcon?: React.ComponentType<any>;
  rightIcon?: React.ComponentType<any>;
  onRightIconPress?: () => void;
  className?: string;
  inputClassName?: string;
};

const variantStyles: Record<InputVariant, string> = {
  outline: 'border border-typography-300 rounded-md bg-transparent',
  underlined: 'border-b border-typography-300 bg-transparent rounded-none',
  rounded: 'border border-typography-300 rounded-full bg-transparent',
};

export const AppInput = forwardRef<TextInput, AppInputPropsType>(
  (
    {
      value,
      onChangeText,
      placeholder,
      label,
      error,
      helperText,
      variant = 'outline',
      isDisabled = false,
      isRequired = false,
      keyboardType = 'default',
      secureTextEntry = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconPress,
      className,
      inputClassName,
      ...inputProps
    },
    ref
  ) => {
    const isInvalid = !!error;
    const variantStyle = variantStyles[variant];
    const inputBaseStyle = `
    ${variantStyle}
    ${isInvalid ? 'border-error-500' : ''}
    ${isDisabled ? 'opacity-50' : ''}
    flex-row items-center
    rounded-lg
    h-14
  `.trim();

    return (
      <FormControl
        isInvalid={isInvalid}
        isDisabled={isDisabled}
        isRequired={isRequired}
        className={className}
      >
        {label && (
          <FormControlLabel>
            <FormControlLabelText>{label}</FormControlLabelText>
          </FormControlLabel>
        )}

        <View
          className={`px-4 ${inputBaseStyle} ${inputClassName ?? ''} w-full`}
        >
          {LeftIcon && (
            <Icon
              as={LeftIcon}
              size="lg"
              className="text-typography-500 mr-3"
            />
          )}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            editable={!isDisabled}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            className={`flex-1 text-typography-900`}
            placeholderTextColor="#a3a3a3"
            {...inputProps}
          />

          {RightIcon && (
            <Pressable onPress={onRightIconPress} hitSlop={8}>
              <Icon
                as={RightIcon}
                size="lg"
                className="text-typography-500 ml-3"
              />
            </Pressable>
          )}
        </View>

        {helperText && !isInvalid && (
          <FormControlHelper>
            <FormControlHelperText>{helperText}</FormControlHelperText>
          </FormControlHelper>
        )}

        {isInvalid && error && (
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>{error}</FormControlErrorText>
          </FormControlError>
        )}
      </FormControl>
    );
  }
);

AppInput.displayName = 'AppInput';
