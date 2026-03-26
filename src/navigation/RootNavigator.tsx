import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SetupTenantScreen from '@/features/tenant/screens/SetupTenantScreen';
import { useAuth } from '@/hooks';
import { useAppStore } from '@/store/app';

import AppTabNavigator from './AppNavigator';
import AuthStackNavigator from './AuthNavigator';

import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, user } = useAuth();
  const { isAppReady } = useAppStore();

  if (!isAppReady) return null;

  const isMasterWithoutTenant =
    isAuthenticated && user?.role === 'MASTER' && !user?.tenantId;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        ) : isMasterWithoutTenant ? (
          <Stack.Screen name="SetupTenant" component={SetupTenantScreen} />
        ) : (
          <Stack.Screen name="App" component={AppTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
