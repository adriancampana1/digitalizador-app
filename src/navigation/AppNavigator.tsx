import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import CustomTabBar from '@/components/navigation/BottomTabBar';
import FolderEditScreen from '@/features/folder/screens/FolderEditScreen';
import FolderListScreen from '@/features/folder/screens/FolderListScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';
import ProfileScreen from '@/features/profile/screens';
import ScanScreen from '@/features/scan/screens';
import SearchScreen from '@/features/search/screens/SearchScreen';

import FolderDetailScreen from '../features/folder/screens/FolderDetailScreen';

import type {
  AppStackParamList,
  AppTabParamList,
  FolderStackParamList,
} from './types/types';
import type { StackNavigationProp } from '@react-navigation/stack';

// ─── Stack Navigators ────────────────────────────────────────
const FolderStack = createStackNavigator<FolderStackParamList>();
const FolderNavigator = () => {
  return (
    <FolderStack.Navigator screenOptions={{ headerShown: false }}>
      <FolderStack.Screen name="FolderList" component={FolderListScreen} />
      <FolderStack.Screen name="FolderDetail" component={FolderDetailScreen} />
      <FolderStack.Screen name="FolderEdit" component={FolderEditScreen} />
    </FolderStack.Navigator>
  );
};

// ─── Tab Navigator ───────────────────────────────────────────
const Tab = createBottomTabNavigator<AppTabParamList>();

const ScanTabPlaceholder = () => null;

const renderTabBar = (props: React.ComponentProps<typeof CustomTabBar>) => (
  <CustomTabBar {...props} />
);

const AppTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Folders"
        component={FolderNavigator}
        options={{ tabBarLabel: 'Pastas' }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanTabPlaceholder}
        listeners={({ navigation }) => ({
          tabPress: e => {
            e.preventDefault();
            navigation
              .getParent<StackNavigationProp<AppStackParamList>>()
              ?.navigate('ScanFlow');
          },
        })}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Buscar' }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppStack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => (
  <AppStack.Navigator screenOptions={{ headerShown: false }}>
    <AppStack.Screen name="AppTabs" component={AppTabNavigator} />
    <AppStack.Screen
      name="ScanFlow"
      component={ScanScreen}
      options={{
        presentation: 'modal',
        cardStyle: { backgroundColor: 'transparent' },
      }}
    />
  </AppStack.Navigator>
);

export default AppNavigator;
