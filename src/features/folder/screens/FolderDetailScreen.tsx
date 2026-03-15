import { useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { RefreshControl } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import { StorageProvider } from '@/features/document/types';
import { useAppNavigation } from '@/hooks';
import type { FolderStackParamList } from '@/navigation';

import { CreateFolderModal } from '../components/CreateFolderModal';
import FolderCard from '../components/FolderCard';
import { FolderGridSkeleton } from '../components/FolderGridSkeleton';
import Header from '../components/Header';
import { NewFolderCard } from '../components/NewFolderCard';
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
      Crie subpastas para organizar melhor seus documentos.
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

type FolderDetailScreenRouteProp = StackScreenProps<
  FolderStackParamList,
  'FolderDetail'
>;

const FolderDetailScreen = ({ route }: FolderDetailScreenRouteProp) => {
  const navigation = useAppNavigation();
  const { folderName, folderPath } = route.params;
  const tabBarHeight = useBottomTabBarHeight();
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // TODO: tornar dinâmico por provider quando o seletor de provider for implementado
  const {
    data: subfolders = [],
    isLoading,
    isRefetching,
    refetch,
  } = useFolders(StorageProvider.sharepoint, folderPath);

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

  const hasOddGrid = (subfolders.length + 1) % 2 !== 0;

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

      {isLoading ? (
        <FolderGridSkeleton />
      ) : subfolders.length === 0 ? (
        <FolderDetailEmptyState onCreateFolder={handleCreateFolder} />
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
              {subfolders.length === 1
                ? '1 subpasta'
                : `${subfolders.length} subpastas`}
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
                />
              </View>
            ))}

            <View className="flex-1 min-w-[45%]">
              <NewFolderCard onPress={handleCreateFolder} />
            </View>

            {hasOddGrid && <View className="flex-1 min-w-[45%]" />}
          </AppContainer>
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
