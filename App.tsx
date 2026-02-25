import './global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AppBootstrap } from './src/components/base/AppBootstrap';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  },
});
/**
 * - INSPIRAÇÃO DE DESIGN: https://doc-scanner--adrianphcampana.replit.app
 *
 */

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider mode="light">
        <AppBootstrap />
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}
