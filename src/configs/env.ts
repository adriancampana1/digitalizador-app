import ExpoConstants from 'expo-constants';

type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiUrl: string;
  environment: Environment;
  timeout: number;
  AUTH_TOKEN_KEY: string;
  AUTH_USER_KEY: string;
}

const extra = ExpoConstants.expoConfig?.extra as
  | {
      apiUrl?: string;
      environment?: Environment;
      AUTH: {
        TOKEN_KEY?: string;
        USER_KEY?: string;
      };
    }
  | undefined;

export const env: EnvConfig = {
  apiUrl: extra?.apiUrl ?? 'http://192.168.0.161:8080',
  environment: extra?.environment ?? 'development',
  timeout: 30000, // 30 seconds
  AUTH_TOKEN_KEY: extra?.AUTH.TOKEN_KEY ?? 'auth_token',
  AUTH_USER_KEY: extra?.AUTH.USER_KEY ?? 'auth_user',
};

export const isDevelopment = env.environment === 'development';
export const isStaging = env.environment === 'staging';
export const isProduction = env.environment === 'production';
