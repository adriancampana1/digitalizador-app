import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import DocumentDetailScreen from '@/features/document/screens/DocumentDetailScreen';
import DocumentListScreen from '@/features/document/screens/DocumentListScreen';
import FolderEditScreen from '@/features/folder/screens/FolderEditScreen';
import FolderListScreen from '@/features/folder/screens/FolderListScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';

import FolderDetailScreen from '../features/folder/screens/FolderDetailScreen';

import type {
  AppTabParamList,
  DocumentStackParamList,
  FolderStackParamList,
} from './types';

const DocumentStack = createStackNavigator<DocumentStackParamList>();
const DocumentNavigator = () => {
  return (
    <DocumentStack.Navigator screenOptions={{ headerShown: false }}>
      <DocumentStack.Screen
        name="DocumentList"
        component={DocumentListScreen}
      />
      <DocumentStack.Screen
        name="DocumentDetail"
        component={DocumentDetailScreen}
      />
    </DocumentStack.Navigator>
  );
};

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

const Tab = createBottomTabNavigator<AppTabParamList>();
const AppTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Documents"
        component={DocumentNavigator}
        options={{ tabBarLabel: 'Documentos' }}
      />
      <Tab.Screen
        name="Folders"
        component={FolderNavigator}
        options={{ tabBarLabel: 'Pastas' }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
