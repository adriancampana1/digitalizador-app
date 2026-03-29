import { useState } from 'react';

import { Alert, Pressable, ScrollView, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FolderOpen, FolderPlus } from 'lucide-react-native';
import { RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import DocumentCard from '@/components/shared/DocumentCard';
import { DocumentCardSkeleton } from '@/components/shared/DocumentCardSkeleton';
import { useDownloadDocument } from '@/features/document/hooks/useDownloadDocument';
import { useFindDocumentsByFolder } from '@/features/document/hooks/useFindDocumentsByFolder';
import { useRefreshThumbnail } from '@/features/document/hooks/useRefreshThumbnail';
import { useViewOriginal } from '@/features/document/hooks/useViewOriginal';
import { StorageProvider } from '@/features/document/types';
import { useAppNavigation, useAppToast, useAuth } from '@/hooks';
import { colors } from '@/theme';

import { CreateFolderModal } from '../components/CreateFolderModal';
import FolderCard from '../components/FolderCard';
import { FolderGridSkeleton } from '../components/FolderGridSkeleton';
import Header from '../components/Header';
import { useCreateFolder } from '../hooks/useCreateFolder';
import { useDeleteFolder } from '../hooks/useDeleteFolder';
import { useFolderList } from '../hooks/useFolderList';
import { ROOT_FOLDER_PATH, type FolderOption } from '../types';

const EmptyState = () => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <FolderOpen size={28} color={colors.typography[400]} />
    </View>
    <AppText variant="h5" color="default" align="center">
      Nenhuma pasta ainda
    </AppText>
    <AppText variant="body" color="muted" align="center">
      Organize seus documentos criando sua primeira pasta.
    </AppText>
  </AppContainer>
);

const DocumentsSkeleton = () => (
  <View className="gap-sm">
    {Array.from({ length: 2 }).map((_, index) => (
      <DocumentCardSkeleton key={index} />
    ))}
  </View>
);

const SectionHeader = ({ title, count }: { title: string; count: number }) => (
  <AppContainer
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    paddingHorizontal="2xl"
    paddingVertical="none"
    className="pt-2xl pb-sm"
  >
    <AppText variant="h5" color="default">
      {title}
    </AppText>
    <AppText variant="bodySmall" color="muted">
      {count === 1 ? '1 item' : `${count} itens`}
    </AppText>
  </AppContainer>
);

const FolderListScreen = () => {
  const navigation = useAppNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();
  const { error: showError } = useAppToast();
  const isMaster = user?.role === 'MASTER';
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const {
    data: folders = [],
    isLoading: isLoadingFolders,
    isRefetching,
    refetch: refetchFolders,
  } = useFolderList(StorageProvider.sharepoint, ROOT_FOLDER_PATH);

  const {
    data: documents = [],
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments,
  } = useFindDocumentsByFolder(ROOT_FOLDER_PATH);

  const refreshThumbnail = useRefreshThumbnail();
  const viewOriginal = useViewOriginal();
  const { download, downloadingId } = useDownloadDocument();
  const createFolder = useCreateFolder();
  const deleteFolder = useDeleteFolder();

  const isEmpty =
    !isLoadingFolders &&
    !isLoadingDocuments &&
    folders.length === 0 &&
    documents.length === 0;

  const hasOddGrid = (folders.length + 1) % 2 !== 0;

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleOpenFolder = (folder: FolderOption) => {
    navigation.navigate('App', {
      screen: 'AppTabs',
      params: {
        screen: 'Folders',
        params: {
          screen: 'FolderDetail',
          params: {
            folderId: folder.id,
            folderName: folder.name,
            folderPath: folder.path,
          },
        },
      },
    });
  };

  const handleRefresh = () => {
    refetchFolders();
    refetchDocuments();
  };

  return (
    <AppContainer
      flex
      backgroundColor="background-light"
      paddingHorizontal="none"
      paddingVertical="none"
      className="w-full"
    >
      <Header onBack={handleBack} />

      <AppContainer
        flex
        className="w-full"
        paddingHorizontal="none"
        paddingVertical="none"
      >
        {isLoadingFolders ? (
          <FolderGridSkeleton />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: tabBarHeight + 32 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
              />
            }
            className="w-full"
          >
            {folders.length > 0 && (
              <>
                <SectionHeader title="Pastas" count={folders.length} />
                <AppContainer
                  direction="row"
                  wrap
                  spacing="sm"
                  paddingHorizontal="2xl"
                  paddingVertical="none"
                >
                  {folders.map(folder => (
                    <View key={folder.id} className="flex-1 min-w-[45%]">
                      <FolderCard
                        name={folder.name}
                        onPress={() => handleOpenFolder(folder)}
                        onEdit={
                          isMaster
                            ? () =>
                                navigation.navigate('App', {
                                  screen: 'AppTabs',
                                  params: {
                                    screen: 'Folders',
                                    params: {
                                      screen: 'FolderEdit',
                                      params: {
                                        itemId: folder.id,
                                        currentName: folder.name,
                                        storageProvider:
                                          StorageProvider.sharepoint,
                                        folderPath: folder.path,
                                      },
                                    },
                                  },
                                })
                            : undefined
                        }
                        onDelete={
                          isMaster
                            ? () =>
                                Alert.alert(
                                  'Excluir pasta',
                                  `Deseja excluir "${folder.name}"?`,
                                  [
                                    { text: 'Cancelar', style: 'cancel' },
                                    {
                                      text: 'Excluir',
                                      style: 'destructive',
                                      onPress: async () => {
                                        try {
                                          await deleteFolder.mutateAsync({
                                            storageProvider:
                                              StorageProvider.sharepoint,
                                            itemId: folder.id,
                                          });
                                        } catch (e: any) {
                                          showError(
                                            e?.message ??
                                              'Não foi possível excluir a pasta.'
                                          );
                                        }
                                      },
                                    },
                                  ]
                                )
                            : undefined
                        }
                      />
                    </View>
                  ))}

                  {hasOddGrid && <View className="flex-1 min-w-[45%]" />}
                </AppContainer>
              </>
            )}

            {isLoadingDocuments ? (
              <>
                <AppContainer paddingHorizontal="2xl" paddingVertical="none">
                  <DocumentsSkeleton />
                </AppContainer>
              </>
            ) : (
              documents.length > 0 && (
                <>
                  <SectionHeader title="Documentos" count={documents.length} />
                  <AppContainer
                    paddingHorizontal="2xl"
                    paddingVertical="none"
                    spacing="sm"
                  >
                    {documents.map(document => (
                      <DocumentCard
                        key={document.id}
                        document={document}
                        onThumbnailRefresh={refreshThumbnail}
                        onViewOriginal={() => viewOriginal(document.storageUrl)}
                        onDownload={() =>
                          download(
                            document.id,
                            document.fileMetadata?.originalFileName ??
                              document.title
                          )
                        }
                        isDownloading={downloadingId === document.id}
                      />
                    ))}
                  </AppContainer>
                </>
              )
            )}
          </ScrollView>
        )}

        {isMaster && (
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            className="absolute right-6 w-14 h-14 rounded-full bg-primary-500 items-center justify-center shadow-lg active:opacity-80"
            style={{ bottom: tabBarHeight + 48 }}
            accessibilityRole="button"
            accessibilityLabel="Criar pasta"
          >
            <FolderPlus size={22} color="white" />
          </Pressable>
        )}
      </AppContainer>

      <CreateFolderModal
        visible={createModalVisible}
        isLoading={createFolder.isPending}
        onClose={() => setCreateModalVisible(false)}
        onConfirm={async name => {
          try {
            await createFolder.mutateAsync({
              storageProvider: StorageProvider.sharepoint,
              parentPath: ROOT_FOLDER_PATH,
              folderName: name,
            });
            setCreateModalVisible(false);
          } catch {
            showError('Não foi possível criar a pasta.');
          }
        }}
      />
    </AppContainer>
  );
};

export default FolderListScreen;
