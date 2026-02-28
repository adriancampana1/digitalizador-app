import React, { useState } from 'react';

import { StatusBar } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import DocumentCard from '@/components/shared/DocumentCard';
import { useFindAllDocuments } from '@/features/document/hooks/useFindAllDocuments';
import { useRefreshThumbnail } from '@/features/document/hooks/useRefreshThumbnail';
import { useSearchDocuments } from '@/features/document/hooks/useSearchDocuments';
import { useViewOriginal } from '@/features/document/hooks/useViewOriginal';
import type { DocumentResponse } from '@/features/document/types';
import { useDebounce } from '@/hooks';

import Header from '../components/Header';

const ListHeaderComponent = () => (
  <AppContainer backgroundColor="background-light">
    <AppContainer
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="none"
      paddingVertical="none"
      className="w-full mt-2"
    >
      <AppText variant="h4">Documentos recentes</AppText>
      <AppText variant="body" align="right" color="secondary-400">
        Ver todos
      </AppText>
    </AppContainer>
  </AppContainer>
);

const renderDocumentListSeparator = () => <AppSpacer size="sm" />;

const HomeScreen = () => {
  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearch = useDebounce(searchText, 300);
  const tabBarHeight = useBottomTabBarHeight();

  const isSearching = debouncedSearch.trim().length > 0;

  const allDocuments = useFindAllDocuments();
  const searchDocuments = useSearchDocuments(debouncedSearch);
  const refreshThumbnail = useRefreshThumbnail();
  const viewOriginal = useViewOriginal();

  const activeQuery = isSearching ? searchDocuments : allDocuments;
  const documents: DocumentResponse[] = activeQuery.data ?? [];

  return (
    <AppContainer
      paddingVertical="none"
      paddingHorizontal="none"
      flex
      backgroundColor="background-light"
    >
      <StatusBar translucent />
      <Header searchText={searchText} onSearchChange={setSearchText} />

      <FlatList
        data={documents}
        renderItem={({ item }) => (
          <AppContainer paddingVertical="none">
            <DocumentCard
              document={item}
              onThumbnailRefresh={refreshThumbnail}
              onViewOriginal={() => viewOriginal(item.storageUrl)}
            />
          </AppContainer>
        )}
        refreshControl={
          <RefreshControl
            refreshing={activeQuery.isLoading}
            onRefresh={activeQuery.refetch}
          />
        }
        ListHeaderComponent={ListHeaderComponent}
        ItemSeparatorComponent={renderDocumentListSeparator}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}
        showsVerticalScrollIndicator={false}
        className="w-full bg-background-light"
      />
    </AppContainer>
  );
};

export default HomeScreen;
