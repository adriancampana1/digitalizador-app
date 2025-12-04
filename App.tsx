import { useEffect } from 'react';

import { ActivityIndicator, View } from 'react-native';

import { useApp } from '@/hooks';
import { RootNavigator } from '@/navigation';

/**
 * ESTRUTURA DE API CLIENT CRIADA
 * useAuth e useApp CRIADOS
 *
 * - [ ] IMPLEMENTAR BASE DE DESIGN SYSTEM DO APP
 * - [ ] IMPLEMENTAR COMPONENTES DE TRATAMENTO DE ERROS (TOAST, MODAL, ETC)
 */
export default function App() {
  const initializeApp = useApp(state => state.initializeApp);
  const isAppReady = useApp(state => state.isAppReady);

  useEffect(() => {
    const bootstrap = async () => {
      await initializeApp();
    };
    bootstrap();
  }, [initializeApp]);

  if (!isAppReady) {
    return (
      <View>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return <RootNavigator />;
}
