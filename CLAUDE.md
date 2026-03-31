# App Digitalizador - Claude Code Guide

## 🎯 Tier 1: Essencial (Sempre Carregado)

**Projeto**: App React Native (Expo) para digitalizar documentos via câmera/galeria e fazer upload.

**Stack**: React Native 0.81 | TypeScript | Expo 54 | React Navigation | Gluestack UI | React Query | Zustand | NativeWind/Tailwind

### Comandos Críticos

```bash
npm start                    # Inicia dev client (Ctrl+J web, Ctrl+I iOS, Ctrl+A Android)
npm run android             # Build + run no Android
npm run ios                 # Build + run no iOS
npm run web                 # Abre app no navegador
npm run prepare             # Setup Husky hooks
npm test                    # (configure quando necessário)
```

### Regras Essenciais

- **Navegação**: React Navigation (Stack, Tabs, Native Stack). Rotas em `src/navigation/`
- **API**: Axios + React Query (TanStack Query). Queries em `src/api/queries/`, mutations em `src/api/mutations/`
- **State**: Zustand para estado global. Stores em `src/store/`
- **Styling**: Tailwind via NativeWind. Config em `tailwind.config.js`
- **Componentes**: Gluestack UI para base. Custom components em `src/components/`
- **Secure Storage**: Tokens JWT em `expo-secure-store` (não localStorage!)
- **Linting**: ESLint + Prettier com Husky pre-commit

### Estrutura de Arquivos

```
src/
  components/
    base/           # Layout, AppBootstrap, providers
    ui/             # Gluestack provider e wrappers customizados
    screens/        # Telas/páginas do app
    common/         # Componentes reutilizáveis
  api/
    queries.ts      # React Query hooks (GET, list)
    mutations.ts    # React Query hooks (POST, PUT, DELETE)
    client.ts       # Axios instance com interceptadores
  store/            # Zustand stores (auth, documents, etc)
  navigation/       # React Navigation config
  types/            # TypeScript interfaces
  utils/            # Helpers, formatters, validators
assets/             # Imagens, ícones
app.json            # Expo config (nome, versão, buildNumber)
App.tsx             # Root component (Query + UI provider + Bootstrap)
```

### Quick Reference: Principais Telas

| Tela            | Propósito                     | Stack                                                |
| --------------- | ----------------------------- | ---------------------------------------------------- |
| Login           | Autenticação                  | Token armazenado em secure storage                   |
| Camera/Gallery  | Captura/seleção de documentos | expo-document-picker + react-native-document-scanner |
| Document List   | Lista de uploads do usuário   | React Query + pull-to-refresh                        |
| Document Detail | Preview + share/delete        | PDF preview com pdf-lib                              |

### Key Dependencies

- **@tanstack/react-query**: Data fetching, caching, sincronização
- **@react-navigation/\***: Navegação stack/tabs/deep linking
- **@gluestack-ui/core**: Componentes UI acessíveis
- **zustand**: State management (alternativa leve a Redux)
- **axios**: HTTP client com interceptadores
- **expo-secure-store**: Armazenamento seguro de tokens
- **nativewind**: Tailwind no React Native
- **react-native-document-scanner-plugin**: Scanner de documentos

---

## 📚 Tier 2: Sob Demanda (Leia Quando Necessário)

### Autenticação & Tokens

- **JWT**: Armazenado com `expo-secure-store` (chave: `auth_token`)
- **Interceptação**: Axios intercepta requests, adiciona Bearer token, trata 401 (logout)
- **Login**: Chamada em `/auth/login` no backend. Resposta contém token JWT
- **Logout**: Remove token de secure storage, limpa queries React Query
- **Refresh**: Implementar endpoint `/auth/refresh` se houver expiration

### Document Scanning & Upload

- **Capture**: `expo-document-picker` para galeria, `react-native-document-scanner-plugin` para câmera otimizada
- **File**: Use `expo-file-system` para ler/manipular arquivos
- **Upload**: `multipart/form-data` com Axios + FormData
- **Progress**: Implementar `onUploadProgress` para barra de progresso
- **Validação**: Checar tipo MIME, tamanho, dimensões no cliente

### State Management (Zustand)

```typescript
// Exemplo: src/store/authStore.ts
const useAuthStore = create(set => ({
  token: null,
  setToken: token => set({ token }),
  clearToken: () => set({ token: null }),
}));

// Usar: const { token, setToken } = useAuthStore();
```

### React Query Setup

```typescript
// src/api/queries.ts
export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/documents');
      return data;
    },
  });
};
```

### Navegação (React Navigation)

- **Stack Navigator**: Telas sequenciais (Login → Home → Details)
- **Tab Navigator**: Abas inferiores (Docs, Profile, Settings)
- **Deep Linking**: Configure `linking` em `app.json` para URLs
- **Params**: Passe dados via `navigation.navigate('ScreenName', { param: value })`

### Styling com NativeWind

- Tailwind classes aplicadas nativamente: `<View className="flex-1 bg-white p-4">`
- Config em `tailwind.config.js` (cores, spacing, etc)
- Prefixo `dark:` para dark mode
- `nativewind-env.d.ts` auto-completa no IDE

### Documentação de Design

- [Design Inspiration](https://doc-scanner--adrianphcampana.replit.app) — Referência visual
- Cores, espaçamento e componentes estão padronizados em Gluestack

---

## 🔗 Tier 3: Referência (Linkado Quando Necessário)

### Documentação Oficial

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [Gluestack UI](https://www.gluestack.io/)
- [NativeWind](https://www.nativewind.dev/)

### Troubleshooting

#### ❓ Expo start não conecta ao emulador?

```bash
# Limpar cache e reconstruir
expo start --clear
# Se ainda falhar, reinstale o dev client:
eas build --platform android --profile preview
```

#### ❓ Token JWT expirado, usuário vê tela branca?

- Verificar interceptador Axios: deve fazer logout se 401
- Verificar `AppBootstrap.tsx` — token deve ser recarregado de secure storage

#### ❓ React Query não atualiza ao fazer upload?

- Use `queryClient.invalidateQueries(['documents'])` após mutation bem-sucedida
- Ou defina `staleTime: 0` para sempre refetch

#### ❓ NativeWind classes não funcionam no Android?

- Limpar cache: `rm -rf node_modules/.cache`
- Reconstruir: `npm run android -- --reset-cache`

#### ❓ File picker retorna null?

- Verifique permissões no `app.json` (`android.permissions`, `ios.infoPlist`)
- iOS: Certifique-se que `NSPhotoLibraryUsageDescription` está definido

### Próximos Passos (Product Roadmap)

- [ ] Implementar offline mode com React Query persistence
- [ ] Adicionar push notifications (Expo Notifications)
- [ ] Integrar Analytics (Expo Analytics ou Firebase)
- [ ] Melhorar UX do document scanner (filtros, rotação)
- [ ] Implementar batch upload
- [ ] Adicionar dark mode toggle

---

## 💡 Padrões do Projeto

**Custom Hooks**: Abstração de lógica reutilizável

```typescript
// useAuth.ts
export const useAuth = () => {
  const { token, setToken } = useAuthStore();
  const loginMutation = useMutation({
    /* ... */
  });
  return { token, login: loginMutation.mutate };
};
```

**Error Boundaries**: Capture crashes com `react-native-error-boundary` (instalá-lo se necessário)

**Logging**: Use `console.log` (Expo expõe em terminal) ou integre `react-native-logger`

**Testing**: Jest + React Native Testing Library (setup: `npm test` no futuro)

---

## ⚡ Dicas para Economizar Tokens

1. **Reutilize patterns**: Novos endpoints = copiar um hook de query existente
2. **Describe antes de implementar**: Passe a estrutura (tipos, store) sem código todo
3. **Links > Cópia**: Reference docs Expo/RN ao invés de repetir exemplos
4. **Git diff**: Use `git diff main` para mostrar mudanças sem repetir código inteiro
5. **Componente Gluestack**: Antes de customizar, verifique se existe nativo
