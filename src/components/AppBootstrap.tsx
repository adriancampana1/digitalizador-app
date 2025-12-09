import { useEffect } from 'react';

import { ActivityIndicator, View } from 'react-native';

import { useApp } from '@/hooks';
import { RootNavigator } from '@/navigation';

export const AppBootstrap = () => {
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <RootNavigator />;
};
