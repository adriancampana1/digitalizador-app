import ExpoConstants from 'expo-constants';

type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiUrl: string;
  environment: Environment;
  timeout: number;
}

const extra = ExpoConstants.expoConfig?.extra as
  | {
      apiUrl?: string;
      environment?: Environment;
    }
  | undefined;

export const env: EnvConfig = {
  apiUrl: extra?.apiUrl ?? 'http://localhost:3000',
  environment: extra?.environment ?? 'development',
  timeout: 30000, // 30 seconds
};

export const isDevelopment = env.environment === 'development';
export const isStaging = env.environment === 'staging';
export const isProduction = env.environment === 'production';
