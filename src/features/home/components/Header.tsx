import { AppContainer } from '@/components/layout/AppContainer';
import { AppInput } from '@/components/layout/AppInput';
import { AppText } from '@/components/layout/AppText';
import { SearchIcon } from '@/components/ui/icon';

const Header = () => {
  return (
    <AppContainer
      backgroundColor="white"
      variant="safeAreaView"
      className="pt-6 rounded-br-3xl rounded-bl-3xl shadow-lg"
    >
      <AppText variant="bodyLarge" className="leading-none">
        Bem vindo de volta,
      </AppText>
      <AppText variant="h2" className="leading-none">
        Adrian
      </AppText>
      <AppInput
        value=""
        placeholder="Pesquise pelo nome ou conteúdo"
        leftIcon={SearchIcon}
        onChangeText={() => {}}
        className="mt-4"
      />
    </AppContainer>
  );
};

export default Header;
