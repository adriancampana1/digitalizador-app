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
      className="pt-6 rounded-br-3xl rounded-bl-3xl shadow-lg w-full"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Pressable
        onPress={onBack}
        className="w-10 h-10 rounded-full bg-background-light items-center justify-center"
        hitSlop={8}
        style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
      >
        <ArrowLeft size={20} color={colors.typography[700]} />
      </Pressable>

      <AppText variant="h3" className="leading-none">
        {title || 'Pastas'}
      </AppText>

      <View className="w-10 h-10" />
    </AppContainer>
  );
};

export default Header;
