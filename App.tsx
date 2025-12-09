import './global.css';

import { AppBootstrap } from './src/components/AppBootstrap';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';

/**
 * - [✅] Implementar estrutura base para requisições HTTP
 * - [✅] Implementar service HTTP de pastas
 *
 * - [ ] Implementar customização de temas (cores, fontes, bordas, etc.)
 *    - Precisa ser simples de implementar, mas que deixe simples caso precise alterar o estilo do app futuramente
 *
 * - [ ] Implementar componentes de layout do app (Header, Bottom Tabs, etc.)
 */

export default function App() {
  return (
    <GluestackUIProvider mode="dark">
      <AppBootstrap />
    </GluestackUIProvider>
  );
}
