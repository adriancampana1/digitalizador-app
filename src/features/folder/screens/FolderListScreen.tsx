import { useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import { StorageProvider } from '@/features/document/types';
import { useAppNavigation } from '@/hooks';

import { CreateFolderModal } from '../components/CreateFolderModal';
import FolderCard from '../components/FolderCard';
import { FolderGridSkeleton } from '../components/FolderGridSkeleton';
import Header from '../components/Header';
import { NewFolderCard } from '../components/NewFolderCard';
import { useFolderList } from '../hooks/useFolderList';
import { ROOT_FOLDER_PATH, type FolderOption } from '../types';

const EmptyState = ({ onCreateFolder }: { onCreateFolder?: () => void }) => (
  <AppContainer
    flex
    justifyContent="center"
    alignItems="center"
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
  >
    <View className="w-16 h-16 rounded-2xl bg-background-section items-center justify-center mb-xs">
      <AppText variant="h2">📁</AppText>
    </View>
    <AppText variant="h5" color="default" align="center">
      Nenhuma pasta ainda
    </AppText>
    <AppText variant="body" color="muted" align="center">
      Organize seus documentos criando sua primeira pasta.
    </AppText>
    {onCreateFolder && (
      <Pressable
        onPress={onCreateFolder}
        className="mt-sm px-lg py-md rounded-xl bg-background-dark"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
      >
        <AppText variant="bodySmall" color="inverted" bold>
          Criar pasta
        </AppText>
      </Pressable>
    )}
  </AppContainer>
);

const FolderListScreen = () => {
  const navigation = useAppNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // TODO: tornar dinâmico por provider quando o seletor de provider for implementado
  const {
    data: folders = [],
    isLoading,
    isRefetching,
    refetch,
  } = useFolderList(StorageProvider.sharepoint);

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  const handleCreateFolder = () => setCreateModalVisible(true);

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

  return (
    <AppContainer
      flex
      backgroundColor="background-light"
      paddingHorizontal="none"
      paddingVertical="none"
    >
      <Header onBack={handleBack} onCreateFolder={handleCreateFolder} />

      {isLoading ? (
        <FolderGridSkeleton />
      ) : folders.length === 0 ? (
        <EmptyState onCreateFolder={handleCreateFolder} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          className="w-full"
        >
          <AppContainer
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            paddingHorizontal="2xl"
            paddingVertical="none"
            className="pt-2xl pb-sm"
          >
            <AppText variant="h5" color="default">
              {folders.length === 1 ? '1 pasta' : `${folders.length} pastas`}
            </AppText>
          </AppContainer>

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
                />
              </View>
            ))}

            <View className="flex-1 min-w-[45%]">
              <NewFolderCard onPress={handleCreateFolder} />
            </View>

            {(folders.length + 1) % 2 !== 0 && (
              <View className="flex-1 min-w-[45%]" />
            )}
          </AppContainer>
        </ScrollView>
      )}
      <CreateFolderModal
        visible={createModalVisible}
        provider={StorageProvider.sharepoint}
        folderPath={ROOT_FOLDER_PATH}
        onClose={() => setCreateModalVisible(false)}
      />
    </AppContainer>
  );
};

export default FolderListScreen;
