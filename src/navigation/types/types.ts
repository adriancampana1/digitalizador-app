import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackScreenProps } from '@react-navigation/stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Folders: NavigatorScreenParams<FolderStackParamList>;
  Scan: undefined;
  Search: undefined;
  Profile: undefined;
};

export type DocumentStackParamList = {
  DocumentList: undefined;
  DocumentDetail: { documentId: string };
};

export type FolderStackParamList = {
  FolderList: undefined;
  FolderDetail: { folderId: string; folderName: string; folderPath: string };
  FolderEdit: { folderId: string };
};

// AppStack: contém o AppTabNavigator e o ScanFlow (modal).
// RootStackParamList.App aponta para este stack, não diretamente para AppTabParamList.
export type AppStackParamList = {
  AppTabs: NavigatorScreenParams<AppTabParamList>;
  ScanFlow: undefined;
  SetupEnvironment: undefined;
  AllDocuments: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppTabScreenProps<T extends keyof AppTabParamList> =
  BottomTabScreenProps<AppTabParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  StackScreenProps<AppStackParamList, T>;

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
