import { Pressable, View } from 'react-native';

import { ArrowLeft } from 'lucide-react-native';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import { colors } from '@/theme';

type HeaderProps = {
  title?: string;
  onBack?: () => void;
};

const Header = ({ title, onBack }: HeaderProps) => {
  return (
    <AppContainer
      backgroundColor="background-card"
      variant="safeAreaView"
      paddingHorizontal="2xl"
      className="w-full border-b border-typography-100 pb-4"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Pressable
        onPress={onBack}
        className="w-9 h-9 rounded-full bg-background-section items-center justify-center"
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
      >
        <ArrowLeft size={18} color={colors.typography[700]} />
      </Pressable>

      <AppText variant="h5" color="default">
        {title || 'Pastas'}
      </AppText>

      <View className="w-9 h-9" />
    </AppContainer>
  );
};

export default Header;
