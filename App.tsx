import './global.css';

import { AppBootstrap } from './src/components/AppBootstrap';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';

/**
 * - INSPIRAÇÃO DE DESIGN: https://doc-scanner--adrianphcampana.replit.app
 *
 * - [ ] Implementar login e registro
 * - [ ] Implementar tela inicial do App
 */

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <AppBootstrap />
    </GluestackUIProvider>
  );
}
