import { useEffect, useRef, useState } from 'react';

import { View } from 'react-native';

import { useAppNavigation } from '@/hooks';

import { SaveDocumentModal } from '../components/SaveDocumentModal';
import { useDocumentScanner } from '../hooks/useDocumentScanner';
import { useLocalSaveDocument } from '../hooks/useLocalSaveDocument';
import { useUploadScannedDocument } from '../hooks/useUploadScannedDocument';

import type { ScannedPage } from '../types';

const ScanScreen = () => {
  const navigation = useAppNavigation();
  const { scan, status, pages, reset } = useDocumentScanner();
  const [modalVisible, setModalVisible] = useState(false);
  const [frozenPages, setFrozenPages] = useState<ScannedPage[]>([]);

  const { upload, isLoading: isUploading } = useUploadScannedDocument();
  const { save, isLoading: isSaving } = useLocalSaveDocument();

  // Rastreia o status anterior para distinguir "idle inicial"
  // de "idle pós-cancelamento" (o hook volta para idle ao cancelar).
  const prevStatus = useRef<string | null>(null);

  // Inicia a câmera assim que a tela monta (i.e. ao abrir o modal).
  // O cleanup garante que o estado do scanner seja resetado ao fechar.
  useEffect(() => {
    scan();
    return () => {
      reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'done') {
      // Congela as páginas antes de abrir o modal para que o reset()
      // posterior não esvazie a lista enquanto o modal ainda está aberto.
      setFrozenPages(pages);
      setModalVisible(true);
    } else if (status === 'idle' && prevStatus.current === 'scanning') {
      navigation.goBack();
    }

    prevStatus.current = status;
  }, [status, pages, navigation]);

  const handleModalClose = () => {
    reset();
    navigation.goBack();
  };

  const handleSaveSuccess = () => {
    reset();
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-transparent">
      <SaveDocumentModal
        visible={modalVisible}
        pages={frozenPages}
        onClose={handleModalClose}
        onSuccess={handleSaveSuccess}
        upload={upload}
        save={save}
        isUploading={isUploading}
        isSaving={isSaving}
      />
    </View>
  );
};

export default ScanScreen;
