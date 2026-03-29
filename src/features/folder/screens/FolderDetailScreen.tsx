import { useState } from 'react';

import { Alert, Pressable, ScrollView, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FolderOpen, FolderPlus } from 'lucide-react-native';
import { RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import DocumentCard from '@/components/shared/DocumentCard';
import { DocumentCardSkeleton } from '@/components/shared/DocumentCardSkeleton';
import { useDeleteDocument } from '@/features/document/hooks/useDeleteDocument';
import { useDownloadDocument } from '@/features/document/hooks/useDownloadDocument';
import { useFindDocumentsByFolder } from '@/features/document/hooks/useFindDocumentsByFolder';
import { useRefreshThumbnail } from '@/features/document/hooks/useRefreshThumbnail';
import { useViewOriginal } from '@/features/document/hooks/useViewOriginal';
import { StorageProvider } from '@/features/document/types';
import { useAppNavigation, useAppToast, useAuth } from '@/hooks';
import type { FolderStackParamList } from '@/navigation';
import { colors } from '@/theme';

import { CreateFolderModal } from '../components/CreateFolderModal';
import FolderCard from '../components/FolderCard';
import { FolderGridSkeleton } from '../components/FolderGridSkeleton';
import Header from '../components/Header';
import { useCreateFolder } from '../hooks/useCreateFolder';
import { useDeleteFolder } from '../hooks/useDeleteFolder';
import { useFolders } from '../hooks/useFolders';

import type { StackScreenProps } from '@react-navigation/stack';

type FolderDetailScreenRouteProp = StackScreenProps<
  FolderStackParamList,
  'FolderDetail'
>;

const FolderDetailEmptyState = () => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
    className="w-full"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <FolderOpen size={28} color={colors.typography[400]} />
    </View>
    <AppText variant="h5" color="default" align="center">
      Esta pasta está vazia
    </AppText>
    <AppText variant="body" color="muted" align="center">
      Digitalize documentos para começar.
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

const FolderDetailScreen = ({ route }: FolderDetailScreenRouteProp) => {
  const navigation = useAppNavigation();
  const { folderName, folderPath } = route.params;
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();
  const { error: showError } = useAppToast();
  const isMaster = user?.role === 'MASTER';
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const {
    data: subfolders = [],
    isLoading: isLoadingFolders,
    isRefetching,
    refetch: refetchFolders,
  } = useFolders(StorageProvider.sharepoint, folderPath);

  const {
    data: documents = [],
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments,
  } = useFindDocumentsByFolder(folderPath);

  const refreshThumbnail = useRefreshThumbnail();
  const viewOriginal = useViewOriginal();
  const { download, downloadingId } = useDownloadDocument();
  const createFolder = useCreateFolder();
  const deleteFolder = useDeleteFolder();
  const deleteDocument = useDeleteDocument();

  const isLoading = isLoadingFolders || isLoadingDocuments;
  const isEmpty =
    !isLoading && subfolders.length === 0 && documents.length === 0;
  const hasOddGrid = (subfolders.length + 1) % 2 !== 0;

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleOpenFolder = (
    subfolderId: string,
    subfolderName: string,
    subfolderPath: string
  ) => {
    navigation.navigate('App', {
      screen: 'AppTabs',
      params: {
        screen: 'Folders',
        params: {
          screen: 'FolderDetail',
          params: {
            folderId: subfolderId,
            folderName: subfolderName,
            folderPath: subfolderPath,
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
      <Header title={folderName} onBack={handleBack} />

      <AppContainer
        flex
        className="w-full"
        paddingHorizontal="none"
        paddingVertical="none"
      >
        {isLoadingFolders ? (
          <FolderGridSkeleton />
        ) : isEmpty ? (
          <FolderDetailEmptyState />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: tabBarHeight + 48 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={handleRefresh}
              />
            }
            className="w-full"
          >
            {subfolders.length > 0 && (
              <>
                <AppContainer
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingHorizontal="2xl"
                  paddingVertical="none"
                  className="pt-2xl pb-sm"
                >
                  <AppText variant="h5" color="default">
                    Subpastas
                  </AppText>
                  <AppText variant="bodySmall" color="muted">
                    {subfolders.length === 1
                      ? '1 item'
                      : `${subfolders.length} itens`}
                  </AppText>
                </AppContainer>
                <AppContainer
                  direction="row"
                  wrap
                  spacing="sm"
                  paddingHorizontal="2xl"
                  paddingVertical="none"
                >
                  {subfolders.map(subfolder => (
                    <View key={subfolder.id} className="flex-1 min-w-[45%]">
                      <FolderCard
                        name={subfolder.name}
                        onPress={() =>
                          handleOpenFolder(
                            subfolder.id,
                            subfolder.name,
                            subfolder.path
                          )
                        }
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
                                        itemId: subfolder.id,
                                        currentName: subfolder.name,
                                        storageProvider:
                                          StorageProvider.sharepoint,
                                        folderPath: subfolder.path,
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
                                  `Deseja excluir "${subfolder.name}"?`,
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
                                            itemId: subfolder.id,
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
            ) : documents.length > 0 ? (
              <>
                <AppContainer
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  paddingHorizontal="2xl"
                  paddingVertical="none"
                  className="pt-2xl pb-sm"
                >
                  <AppText variant="h5" color="default">
                    Documentos
                  </AppText>
                  <AppText variant="bodySmall" color="muted">
                    {documents.length === 1
                      ? '1 item'
                      : `${documents.length} itens`}
                  </AppText>
                </AppContainer>
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
                      onDelete={
                        isMaster
                          ? () =>
                              Alert.alert(
                                'Excluir documento',
                                `Deseja excluir "${document.title}"?`,
                                [
                                  { text: 'Cancelar', style: 'cancel' },
                                  {
                                    text: 'Excluir',
                                    style: 'destructive',
                                    onPress: () =>
                                      deleteDocument.mutate(document.id),
                                  },
                                ]
                              )
                          : undefined
                      }
                    />
                  ))}
                </AppContainer>
              </>
            ) : (
              <AppContainer
                paddingHorizontal="2xl"
                paddingVertical="none"
                className="pt-2xl"
              >
                <AppSpacer size="sm" />
                <AppText variant="body" color="muted" align="center">
                  Nenhum documento nesta pasta.
                </AppText>
              </AppContainer>
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
              parentPath: folderPath,
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

export default FolderDetailScreen;
