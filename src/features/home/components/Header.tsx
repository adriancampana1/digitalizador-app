import { AppContainer } from '@/components/base/AppContainer';
import { AppInput } from '@/components/base/AppInput';
import { AppText } from '@/components/base/AppText';
import { SearchIcon } from '@/components/ui/icon';

type HeaderProps = {
  userName: string;
  searchText: string;
  onSearchChange: (text: string) => void;
};

const Header = ({ userName, searchText, onSearchChange }: HeaderProps) => {
  return (
    <AppContainer
      backgroundColor="background-card"
      variant="safeAreaView"
      paddingVertical="none"
      className="w-full border-b border-typography-100 pb-4"
    >
      <AppContainer
        backgroundColor="background-card"
        paddingHorizontal="none"
        paddingVertical="none"
        spacing="none"
        className="pt-5 pb-4"
      >
        <AppText variant="body" color="muted" className="mb-0.5">
          Bem-vindo de volta
        </AppText>
        <AppText variant="h3" color="default" className="leading-none">
          {userName}
        </AppText>
      </AppContainer>

      <AppContainer
        backgroundColor="background-card"
        paddingHorizontal="none"
        paddingVertical="none"
        spacing="none"
      >
        <AppInput
          value={searchText}
          placeholder="Pesquise pelo nome ou conteúdo"
          leftIcon={SearchIcon}
          onChangeText={onSearchChange}
        />
      </AppContainer>
    </AppContainer>
  );
};

export default Header;
