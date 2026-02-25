import { AppContainer } from '@/components/base/AppContainer';
import { AppInput } from '@/components/base/AppInput';
import { AppText } from '@/components/base/AppText';
import { SearchIcon } from '@/components/ui/icon';

type HeaderProps = {
  searchText: string;
  onSearchChange: (text: string) => void;
};

const Header = ({ searchText, onSearchChange }: HeaderProps) => {
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
        value={searchText}
        placeholder="Pesquise pelo nome ou conteúdo"
        leftIcon={SearchIcon}
        onChangeText={onSearchChange}
        className="mt-4"
      />
    </AppContainer>
  );
};

export default Header;
