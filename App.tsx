import './global.css';

import { AppBootstrap } from './src/components/AppBootstrap';
import { GluestackUIProvider } from './src/components/ui/gluestack-ui-provider';

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <AppBootstrap />
    </GluestackUIProvider>
  );
}
