import { useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import DocumentCard from '@/components/shared/DocumentCard';
import { DocumentCardSkeleton } from '@/components/shared/DocumentCardSkeleton';
import { useDownloadDocument } from '@/features/document/hooks/useDownloadDocument';
import { useFindDocumentsByFolder } from '@/features/document/hooks/useFindDocumentsByFolder';
import { useRefreshThumbnail } from '@/features/document/hooks/useRefreshThumbnail';
import { useViewOriginal } from '@/features/document/hooks/useViewOriginal';
import { StorageProvider } from '@/features/document/types';
import { useAppNavigation } from '@/hooks';
import type { FolderStackParamList } from '@/navigation';

import { CreateFolderModal } from '../components/CreateFolderModal';
import FolderCard from '../components/FolderCard';
import { FolderGridSkeleton } from '../components/FolderGridSkeleton';
import Header from '../components/Header';
import { useFolders } from '../hooks/useFolders';

import type { StackScreenProps } from '@react-navigation/stack';

const FolderDetailEmptyState = ({
  onCreateFolder,
}: {
  onCreateFolder?: () => void;
}) => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <AppText variant="h2">📂</AppText>
    </View>
    <AppText variant="h5" color="default" align="center">
      Esta pasta está vazia
    </AppText>
    <AppText variant="body" color="muted" align="center">
      Crie subpastas ou digitalize documentos para começar.
    </AppText>
    {onCreateFolder && (
      <Pressable
        onPress={onCreateFolder}
        className="mt-sm px-lg py-md rounded-xl bg-background-dark"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <AppText variant="bodySmall" color="inverted" bold>
          Criar subpasta
        </AppText>
      </Pressable>
    )}
  </AppContainer>
);

const DocumentsSkeleton = () => (
  <View className="gap-sm">
    {Array.from({ length: 2 }).map((_, index) => (
      <DocumentCardSkeleton key={index} />
    ))}
  </View>
);

type FolderDetailScreenRouteProp = StackScreenProps<
  FolderStackParamList,
  'FolderDetail'
>;

const FolderDetailScreen = ({ route }: FolderDetailScreenRouteProp) => {
  const navigation = useAppNavigation();
  const { folderName, folderPath } = route.params;
  const tabBarHeight = useBottomTabBarHeight();
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

  const isLoading = isLoadingFolders || isLoadingDocuments;
  const isEmpty =
    !isLoading && subfolders.length === 0 && documents.length === 0;
  const hasOddGrid = (subfolders.length + 1) % 2 !== 0;

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleCreateFolder = () => setCreateModalVisible(true);

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
    >
      <Header
        title={folderName}
        onBack={handleBack}
        onCreateFolder={handleCreateFolder}
      />

      {isLoadingFolders ? (
        <FolderGridSkeleton />
      ) : isEmpty ? (
        <FolderDetailEmptyState onCreateFolder={handleCreateFolder} />
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
          className="w-full mt-4"
        >
          {subfolders.length > 0 && (
            <>
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
                paddingHorizontal="2xl"
                paddingVertical="md"
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

      <CreateFolderModal
        visible={createModalVisible}
        provider={StorageProvider.sharepoint}
        folderPath={folderPath}
        onClose={() => setCreateModalVisible(false)}
      />
    </AppContainer>
  );
};

export default FolderDetailScreen;
