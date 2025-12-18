import { LexendDeca_300Light } from '@expo-google-fonts/lexend-deca/300Light';
import { LexendDeca_400Regular } from '@expo-google-fonts/lexend-deca/400Regular';
import { LexendDeca_500Medium } from '@expo-google-fonts/lexend-deca/500Medium';
import { LexendDeca_600SemiBold } from '@expo-google-fonts/lexend-deca/600SemiBold';
import { LexendDeca_700Bold } from '@expo-google-fonts/lexend-deca/700Bold';
import { useFonts as useExpoFonts } from '@expo-google-fonts/lexend-deca/useFonts';

export const useFonts = () => {
  const [fontsLoaded, fontError] = useExpoFonts({
    LexendDeca_300Light,
    LexendDeca_400Regular,
    LexendDeca_500Medium,
    LexendDeca_600SemiBold,
    LexendDeca_700Bold,
  });

  return {
    fontsLoaded,
    fontError,
  };
};

export const fontFamily = {
  light: 'LexendDeca_300Light',
  regular: 'LexendDeca_400Regular',
  medium: 'LexendDeca_500Medium',
  semibold: 'LexendDeca_600SemiBold',
  bold: 'LexendDeca_700Bold',
} as const;
