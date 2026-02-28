type LogoutCallback = () => Promise<void>;

let logoutCallback: LogoutCallback | null = null;

export function registerLogoutCallback(cb: LogoutCallback): void {
  logoutCallback = cb;
}

export async function triggerLogout(): Promise<void> {
  if (logoutCallback) {
    await logoutCallback();
  }
}
