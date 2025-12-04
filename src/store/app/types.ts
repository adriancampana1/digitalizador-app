export interface AppState {
  isAppReady: boolean;
  isFirstLaunch: boolean;
  isOnline: boolean;
}

export interface AppActions {
  setAppReady: (ready: boolean) => void;
  setFirstLaunch: (firstLaunch: boolean) => void;
  setOnlineStatus: (online: boolean) => void;
  initializeApp: () => Promise<void>;
}

export type AppStore = AppState & AppActions;
