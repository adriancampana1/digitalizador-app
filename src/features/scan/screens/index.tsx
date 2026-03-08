import { useEffect, useRef, useState } from 'react';

import { View } from 'react-native';

import { useAppNavigation } from '@/hooks';

import { SaveDocumentModal } from '../components/SaveDocumentModal';
import { useDocumentScanner } from '../hooks/useDocumentScanner';

import type { ScannedPage } from '../types';

const ScanScreen = () => {
  const navigation = useAppNavigation();
  const { scan, status, pages, reset } = useDocumentScanner();
  const [modalVisible, setModalVisible] = useState(false);
  const [frozenPages, setFrozenPages] = useState<ScannedPage[]>([]);

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

    /**
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     * - [ ] PDFs não estão exibindo thumbnail
     * - [ ] Excluir Storages que não estão disponíveis ainda, deixar somente Sharepoint no momento (é o único com implementação pronta)
     * - [ ] Analisar se vai deixar opção de PDF ou JPEG, ou se força um tipo único de arquivo
     * - [ ] Corrigir opção para Baixar arquivo localmente. Atualmente quebra o app e fecha sozinho
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     *
     */

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
      />
    </View>
  );
};

export default ScanScreen;
