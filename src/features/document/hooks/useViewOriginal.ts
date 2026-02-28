import { useCallback } from 'react';

import { Linking, Alert } from 'react-native';

export function useViewOriginal() {
  return useCallback(async (storageUrl: string | null) => {
    if (!storageUrl) {
      Alert.alert('Indisponível', 'Este documento não possui URL de origem.');
      return;
    }

    const canOpen = await Linking.canOpenURL(storageUrl);
    if (!canOpen) {
      Alert.alert('Erro', 'Não foi possível abrir o link do documento.');
      return;
    }

    await Linking.openURL(storageUrl);
  }, []);
}
