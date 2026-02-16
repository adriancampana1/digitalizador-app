import React from 'react';

import { StatusBar, View } from 'react-native';

import { AppContainer } from '@/components/layout/AppContainer';
import { AppText } from '@/components/layout/AppText';

import DocumentCard from '../components/DocumentCard';
import Header from '../components/Header';

import type { DocumentCardProps } from '../components/DocumentCard';

const documentMockList: DocumentCardProps[] = [
  {
    documentName: 'Recibo de luz',
    documentSize: '2.3 MB',
    provider: 'SHAREPOINT',
    uploadDate: '12 de setembro de 2024',
  },
  {
    documentName: 'Contrato de aluguel',
    documentSize: '1.8 MB',
    provider: 'GOOGLE_DRIVE',
    uploadDate: '5 de setembro de 2024',
  },
  {
    documentName: 'Nota fiscal - compra supermercado',
    documentSize: '500 KB',
    provider: 'DROPBOX',
    uploadDate: '20 de agosto de 2024',
  },
];

const HomeScreen = () => {
  return (
    <View>
      <StatusBar translucent />
      <Header />
      <AppContainer>
        <AppContainer
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="none"
          paddingVertical="none"
          className="w-full mt-2"
        >
          <AppText variant="h5">Documentos recentes</AppText>
          <AppText variant="body" align="right" color="secondary-400">
            Ver todos
          </AppText>
        </AppContainer>

        {documentMockList.map((doc, index) => (
          <DocumentCard key={index} {...doc} />
        ))}
      </AppContainer>
    </View>
  );
};

export default HomeScreen;
