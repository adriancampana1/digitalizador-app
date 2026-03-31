import React, { useCallback } from 'react';

import { ActivityIndicator, Alert, Pressable, View } from 'react-native';

import { ArrowLeft } from 'lucide-react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import DocumentCard from '@/components/shared/DocumentCard';
import { DocumentCardSkeleton } from '@/components/shared/DocumentCardSkeleton';
import { useDeleteDocument } from '@/features/document/hooks/useDeleteDocument';
import { useDownloadDocument } from '@/features/document/hooks/useDownloadDocument';
import { useInfiniteDocuments } from '@/features/document/hooks/useInfiniteDocuments';
import { useRefreshThumbnail } from '@/features/document/hooks/useRefreshThumbnail';
import { useViewOriginal } from '@/features/document/hooks/useViewOriginal';
import type { DocumentResponse } from '@/features/document/types';
import { useAppNavigation, useAuth } from '@/hooks';
import { colors } from '@/theme';

const Header = ({ onBack }: { onBack: () => void }) => (
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
      Todos os documentos
    </AppText>

    <View className="w-9 h-9" />
  </AppContainer>
);

const renderSeparator = () => <AppSpacer size="sm" />;

const LoadingFooter = ({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
}) => {
  if (!isFetchingNextPage) return null;
  return (
    <View className="py-md items-center">
      <ActivityIndicator />
    </View>
  );
};

const ListDocumentCardSkeleton = () => (
  <View className="w-full px-2xl gap-sm">
    {Array.from({ length: 5 }).map((_, index) => (
      <DocumentCardSkeleton key={index} />
    ))}
  </View>
);

const AllDocumentsScreen = () => {
  const { user } = useAuth();
  const isMaster = user?.role === 'MASTER';

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = useInfiniteDocuments();

  const deleteDocument = useDeleteDocument();
  const refreshThumbnail = useRefreshThumbnail();
  const viewOriginal = useViewOriginal();
  const { download, downloadingId } = useDownloadDocument();
  const navigation = useAppNavigation();

  const documents: DocumentResponse[] =
    data?.pages.flatMap(page => page.content) ?? [];

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <AppContainer
      paddingVertical="none"
      paddingHorizontal="none"
      flex
      backgroundColor="background-light"
    >
      <Header onBack={() => navigation.goBack()} />
      {isLoading ? (
        <>
          <View className="px-2xl pt-lg pb-sm">
            <AppText variant="h5" color="default">
              Todos os documentos
            </AppText>
          </View>
          <ListDocumentCardSkeleton />
        </>
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
          ListHeaderComponent={
            <View className="px-2xl pt-lg pb-sm">
              <AppText variant="h5" color="default">
                Todos os documentos
              </AppText>
            </View>
          }
          ItemSeparatorComponent={renderSeparator}
          ListFooterComponent={
            <LoadingFooter isFetchingNextPage={isFetchingNextPage} />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          showsVerticalScrollIndicator={false}
          className="w-full bg-background-light pb-10"
        />
      )}
    </AppContainer>
  );
};

export default AllDocumentsScreen;
