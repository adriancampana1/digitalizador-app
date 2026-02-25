import { AppContainer } from '@/components/base/AppContainer';
import { AppInput } from '@/components/base/AppInput';
import { AppText } from '@/components/base/AppText';
import { SearchIcon } from '@/components/ui/icon';

const Header = () => {
  return (
    <AppContainer
      backgroundColor="background-card"
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
