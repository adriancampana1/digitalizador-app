import React from 'react';

import {
  Image,
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const LogoImage = require('../../assets/logo-ccb.png');

const LOGO_SIZES = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
  '2xl': 96,
  '3xl': 128,
  '4xl': 160,
} as const;

type LogoSizeKey = keyof typeof LOGO_SIZES;

export interface LogoProps {
  size?: LogoSizeKey;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  style,
  imageStyle,
}) => {
  const baseSize = LOGO_SIZES[size];
  return (
    <View style={[style]} accessibilityRole="image">
      <Image
        source={LogoImage}
        style={[
          styles.image,
          { width: baseSize, height: baseSize },
          imageStyle,
        ]}
        resizeMode="contain"
        accessible={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
  },
});
