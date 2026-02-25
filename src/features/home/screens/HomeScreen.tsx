import React from 'react';

import { StatusBar } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { FlatList } from 'react-native-gesture-handler';

import { AppContainer } from '@/components/base/AppContainer';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import DocumentCard from '@/components/shared/DocumentCard';
import type { DocumentCardProps } from '@/components/shared/DocumentCard';

import Header from '../components/Header';

const documentMockList: DocumentCardProps[] = [
  {
    fileName: 'Recibo de luz',
    fileSize: '2.3 MB',
    thumbnailUri:
      'https://images.unsplash.com/photo-1631651693480-97f1132e333d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRvY3VtZW50fGVufDB8fDB8fHww',
    provider: 'sharepoint',
    uploadDate: '12 de setembro de 2024',
    onDownload: () => undefined,
    onViewOriginal: () => undefined,
  },
  {
    fileName: 'Contrato de aluguel',
    fileSize: '1.8 MB',
    thumbnailUri:
      'https://images.unsplash.com/photo-1518976024611-28bf4b48222e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGRvY3VtZW50fGVufDB8fDB8fHww',
    provider: 'google_drive',
    uploadDate: '5 de setembro de 2024',
    onDownload: () => undefined,
    onViewOriginal: () => undefined,
  },
  {
    fileName: 'Nota fiscal - compra supermercado',
    fileSize: '500 KB',
    provider: 'onedrive',
    uploadDate: '20 de agosto de 2024',
    onDownload: () => undefined,
    onViewOriginal: () => undefined,
  },
  {
    fileName: 'Recibo de luz',
    fileSize: '2.3 MB',
    thumbnailUri:
      'https://images.unsplash.com/photo-1631651693480-97f1132e333d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGRvY3VtZW50fGVufDB8fDB8fHww',
    provider: 'sharepoint',
    uploadDate: '12 de setembro de 2024',
    onDownload: () => undefined,
    onViewOriginal: () => undefined,
  },
  {
    fileName: 'Nota fiscal - compra supermercado',
    fileSize: '500 KB',
    provider: 'onedrive',
    uploadDate: '20 de agosto de 2024',
    onDownload: () => undefined,
    onViewOriginal: () => undefined,
  },
  {
    fileName: 'Contrato de aluguel',
    fileSize: '1.8 MB',
    thumbnailUri:
      'https://images.unsplash.com/photo-1518976024611-28bf4b48222e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGRvY3VtZW50fGVufDB8fDB8fHww',
    provider: 'google_drive',
    uploadDate: '5 de setembro de 2024',
    onDownload: () => undefined,
    onViewOriginal: () => undefined,
  },
  {
    fileName: 'Nota fiscal - compra supermercado',
    fileSize: '500 KB',
    provider: 'onedrive',
    uploadDate: '20 de agosto de 2024',
    onDownload: () => undefined,
    onViewOriginal: () => undefined,
  },
];

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
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <AppContainer
      paddingVertical="none"
      paddingHorizontal="none"
      flex
      backgroundColor="background-light"
    >
      <StatusBar translucent />
      <Header />

      <FlatList
        data={documentMockList}
        renderItem={({ item }) => (
          <AppContainer paddingVertical="none">
            <DocumentCard {...item} />
          </AppContainer>
        )}
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
