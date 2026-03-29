import React, { useState } from 'react';

import { Alert, StatusBar, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import { EnvironmentSetupBanner } from '@/components/base/EnvironmentSetupBanner';
import DocumentCard from '@/components/shared/DocumentCard';
import { DocumentCardSkeleton } from '@/components/shared/DocumentCardSkeleton';
import { useDeleteDocument } from '@/features/document/hooks/useDeleteDocument';
import { useDownloadDocument } from '@/features/document/hooks/useDownloadDocument';
import { useFindAllDocuments } from '@/features/document/hooks/useFindAllDocuments';
import { useRefreshThumbnail } from '@/features/document/hooks/useRefreshThumbnail';
import { useSearchDocuments } from '@/features/document/hooks/useSearchDocuments';
import { useViewOriginal } from '@/features/document/hooks/useViewOriginal';
import type { DocumentResponse } from '@/features/document/types';
import { useAuth, useDebounce, useViewOnlyMode } from '@/hooks';
import type { AppStackParamList, AppTabParamList } from '@/navigation/types';

import { HomeEmptyState } from '../components/EmptyState';
import Header from '../components/Header';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

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

const ListDocumentCardSkeleton = () => (
  <View className="w-full px-2xl gap-sm">
    {Array.from({ length: 3 }).map((_, index) => (
      <DocumentCardSkeleton key={index} />
    ))}
  </View>
);

const renderDocumentListSeparator = () => <AppSpacer size="sm" />;

const HomeScreen = () => {
  const [searchText, setSearchText] = useState<string>('');
  const debouncedSearch = useDebounce(searchText, 300);
  const tabBarHeight = useBottomTabBarHeight();
  const { isViewOnly } = useViewOnlyMode();
  const { user } = useAuth();
  const isMaster = user?.role === 'MASTER';
  const deleteDocument = useDeleteDocument();
  const tabNavigation =
    useNavigation<BottomTabNavigationProp<AppTabParamList>>();

  const handleConfigurePress = () =>
    tabNavigation
      .getParent<StackNavigationProp<AppStackParamList>>()
      ?.navigate('SetupEnvironment');

  const isSearching = debouncedSearch.trim().length > 0;

  const allDocuments = useFindAllDocuments();
  const searchDocuments = useSearchDocuments(debouncedSearch);
  const refreshThumbnail = useRefreshThumbnail();
  const viewOriginal = useViewOriginal();
  const { download, downloadingId } = useDownloadDocument();

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
      {isViewOnly && <EnvironmentSetupBanner onPress={handleConfigurePress} />}

      {activeQuery?.isLoading ? (
        <>
          <ListHeaderComponent />
          <ListDocumentCardSkeleton />
        </>
      ) : (
        <FlatList
          data={documents}
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
                onDelete={
                  isMaster
                    ? () =>
                        Alert.alert(
                          'Excluir documento',
                          `Deseja excluir "${item.title}"?`,
                          [
                            { text: 'Cancelar', style: 'cancel' },
                            {
                              text: 'Excluir',
                              style: 'destructive',
                              onPress: () => deleteDocument.mutate(item.id),
                            },
                          ]
                        )
                    : undefined
                }
              />
            </AppContainer>
          )}
          refreshControl={
            <RefreshControl
              refreshing={activeQuery.isRefetching}
              onRefresh={activeQuery.refetch}
            />
          }
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={
            <HomeEmptyState
              isSearching={isSearching}
              searchQuery={debouncedSearch}
            />
          }
          ItemSeparatorComponent={renderDocumentListSeparator}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 40 }}
          showsVerticalScrollIndicator={false}
          className="w-full bg-background-light"
        />
      )}
    </AppContainer>
  );
};

export default HomeScreen;
