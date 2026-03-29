import { View } from 'react-native';

import { FileSearch, FilePlus } from 'lucide-react-native';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import { colors } from '@/theme';

const NoDocumentsState = () => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
    className="py-16"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <FilePlus size={28} color={colors.typography[400]} strokeWidth={1.5} />
    </View>

    <AppText variant="h5" color="default" align="center">
      Nenhum documento ainda
    </AppText>

    <AppText variant="body" color="muted" align="center" className="max-w-xs">
      Digitalize seu primeiro documento usando o botão abaixo e ele aparecerá
      aqui.
    </AppText>
  </AppContainer>
);

type NoSearchResultsStateProps = {
  query: string;
};

const NoSearchResultsState = ({ query }: NoSearchResultsStateProps) => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
    className="py-16"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <FileSearch size={28} color={colors.typography[400]} strokeWidth={1.5} />
    </View>

    <AppText variant="h5" color="default" align="center">
      Nenhum resultado
    </AppText>

    <AppText variant="body" color="muted" align="center" className="max-w-xs">
      Não encontramos documentos para{' '}
      <AppText variant="body" color="default" bold>
        {query}
      </AppText>
      . Tente outros termos.
    </AppText>
  </AppContainer>
);

type HomeEmptyStateProps = {
  isSearching: boolean;
  searchQuery?: string;
};

export const HomeEmptyState = ({
  isSearching,
  searchQuery = '',
}: HomeEmptyStateProps) => {
  if (isSearching) {
    return <NoSearchResultsState query={searchQuery} />;
  }

  return <NoDocumentsState />;
};
