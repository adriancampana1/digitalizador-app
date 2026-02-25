import { useCallback, useEffect } from 'react';

import { ActivityIndicator, View } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';

import { useApp, useFonts } from '@/hooks';
import { RootNavigator } from '@/navigation';

SplashScreen.preventAutoHideAsync();

export const AppBootstrap = () => {
  const initializeApp = useApp(state => state.initializeApp);
  const isAppReady = useApp(state => state.isAppReady);
  const { fontsLoaded, fontError } = useFonts();

  useEffect(() => {
    const bootstrap = async () => {
      await initializeApp();
    };
    bootstrap();
  }, [initializeApp]);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady, fontsLoaded]);

  if (fontError) {
    console.error('Erro ao carregar fontes:', fontError);
  }

  if (!isAppReady || !fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View className="flex-1" onLayout={onLayoutRootView}>
      <RootNavigator />
    </View>
  );
};
