import './global.css';

import { AppBootstrap } from './src/components/layout/AppBootstrap';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';

/**
 * - INSPIRAÇÃO DE DESIGN: https://doc-scanner--adrianphcampana.replit.app
 *
 * - [x] Implementar login e registro
 * - [ ] Implementar tela inicial do App
 */

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <AppBootstrap />
    </GluestackUIProvider>
  );
}
