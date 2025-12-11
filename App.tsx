import './global.css';

import { AppBootstrap } from './src/components/AppBootstrap';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';

/**
 * - [✅] Implementar estrutura base para requisições HTTP
 * - [✅] Implementar service HTTP de pastas
 * - [✅] Implementar customização de temas (cores, fontes, bordas, etc.)
 *
 * - [ ] Implementar componentes de layout do app (Header, Bottom Tabs, etc.)
 */

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <AppBootstrap />
    </GluestackUIProvider>
  );
}
