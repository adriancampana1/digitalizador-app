import { useCallback, useMemo, useRef, useState } from 'react';

import type { TextInput } from 'react-native';
import { InteractionManager, Pressable, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Search as SearchIcon } from 'lucide-react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppInput } from '@/components/base/AppInput';
import { AppText } from '@/components/base/AppText';
import DocumentCard from '@/components/shared/DocumentCard';
import { DocumentCardSkeleton } from '@/components/shared/DocumentCardSkeleton';
import { SearchIcon as AppSearchIcon } from '@/components/ui/icon';
import { useDownloadDocument } from '@/features/document/hooks/useDownloadDocument';
import { useRefreshThumbnail } from '@/features/document/hooks/useRefreshThumbnail';
import { useSearchDocuments } from '@/features/document/hooks/useSearchDocuments';
import { useViewOriginal } from '@/features/document/hooks/useViewOriginal';
import type { DocumentResponse } from '@/features/document/types';
import { useAppNavigation, useDebounce } from '@/hooks';
import { colors } from '@/theme';

const SearchResultSkeleton = () => (
  <View className="w-full px-2xl gap-sm pt-sm">
    {Array.from({ length: 3 }).map((_, index) => (
      <DocumentCardSkeleton key={index} />
    ))}
  </View>
);

const SearchInitialState = () => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
    backgroundColor="background-light"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <SearchIcon size={28} color={colors.typography[400]} />
    </View>

    <AppText variant="h5" align="center" color="default">
      Comece sua busca
    </AppText>

    <AppText variant="bodySmall" align="center" color="muted">
      Encontre documentos por título ou conteúdo indexado.
    </AppText>
  </AppContainer>
);

const SearchEmptyState = ({ searchText }: { searchText: string }) => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <SearchIcon size={26} color={colors.typography[400]} />
    </View>

    <AppText variant="h5" align="center" color="default">
      Nenhum resultado
    </AppText>

    <AppText variant="bodySmall" align="center" color="muted">
      Não encontramos documentos para{' '}
      <AppText variant="bodySmall" color="default" bold>
        {searchText}
      </AppText>
      . Tente outros termos.
    </AppText>
  </AppContainer>
);

const SearchScreen = () => {
  const navigation = useAppNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const inputRef = useRef<TextInput>(null);

  const [searchText, setSearchText] = useState('');
  const debouncedSearch = useDebounce(searchText, 300);

  const trimmedInput = useMemo(() => searchText.trim(), [searchText]);
  const normalizedSearch = useMemo(
    () => debouncedSearch.trim(),
    [debouncedSearch]
  );
  const hasText = trimmedInput.length > 0;
  const isWaitingDebounce = hasText && trimmedInput !== normalizedSearch;

  const searchQuery = useSearchDocuments(normalizedSearch);
  const documents: DocumentResponse[] = searchQuery.data ?? [];

  const refreshThumbnail = useRefreshThumbnail();
  const viewOriginal = useViewOriginal();
  const { download, downloadingId } = useDownloadDocument();

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        inputRef.current?.focus();
      });

      return () => {
        task.cancel();
      };
    }, [])
  );

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('App', {
      screen: 'AppTabs',
      params: { screen: 'Home' },
    });
  };

  const showInitialState = !hasText;
  const showLoadingState = isWaitingDebounce || searchQuery.isLoading;
  const showEmptyState = hasText && !showLoadingState && documents.length === 0;

  return (
    <AppContainer
      flex
      backgroundColor="background-light"
      paddingHorizontal="none"
      paddingVertical="none"
    >
      <AppContainer
        backgroundColor="background-card"
        variant="safeAreaView"
        paddingHorizontal="2xl"
        paddingVertical="none"
        spacing="none"
        className="w-full border-b border-typography-100 pb-4"
      >
        <AppContainer
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing="md"
          paddingHorizontal="none"
          paddingVertical="none"
          className="w-full pt-5 pb-4"
          backgroundColor="background-card"
        >
          <Pressable
            onPress={handleBack}
            className="w-9 h-9 rounded-full bg-background-section items-center justify-center"
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            accessibilityLabel="Voltar"
            accessibilityRole="button"
          >
            <ArrowLeft size={18} color={colors.typography[700]} />
          </Pressable>

          <AppText variant="h5" color="default">
            Buscar
          </AppText>
        </AppContainer>

        <AppInput
          ref={inputRef}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar documentos ou conteúdo..."
          leftIcon={AppSearchIcon}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Campo de busca"
        />
      </AppContainer>

      {showInitialState ? (
        <SearchInitialState />
      ) : showLoadingState ? (
        <SearchResultSkeleton />
      ) : showEmptyState ? (
        <SearchEmptyState searchText={trimmedInput} />
      ) : (
        <FlatList
          data={documents}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AppContainer paddingVertical="none">
              <DocumentCard
                document={item}
                onThumbnailRefresh={refreshThumbnail}
                onViewOriginal={() => viewOriginal(item.storageUrl)}
                onDownload={() =>
                  download(
                    item.id,
                    item.fileMetadata?.originalFileName ?? item.title
                  )
                }
                isDownloading={downloadingId === item.id}
              />
            </AppContainer>
          )}
          refreshControl={
            <RefreshControl
              refreshing={searchQuery.isRefetching}
              onRefresh={searchQuery.refetch}
            />
          }
          contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}
          showsVerticalScrollIndicator={false}
          className="w-full bg-background-light"
        />
      )}
    </AppContainer>
  );
};

export default SearchScreen;
