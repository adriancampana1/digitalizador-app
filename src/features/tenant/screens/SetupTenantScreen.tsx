/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { useRoute } from '@react-navigation/native';

import { AppButton } from '@/components/base/AppButton';
import { AppContainer } from '@/components/base/AppContainer';
import { AppInput } from '@/components/base/AppInput';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import { useAppNavigation, useAppToast, useAuth } from '@/hooks';
import { isApiError } from '@/utils/api';

import { tenantHttpService } from '../http/tenantHttpService';

const SetupTenantScreen = () => {
  const route = useRoute();
  const navigation = useAppNavigation();
  const { logout, skipSetup, updateUser } = useAuth();
  const { error: showError, success: showSuccess } = useAppToast();

  const isInAppSetup = route.name === 'SetupEnvironment';

  const [institutionName, setInstitutionName] = useState('');
  const [baseFolderPath, setBaseFolderPath] = useState('');
  const [clientId, setClientId] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [driveId, setDriveId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [setupTenantId, setSetupTenantId] = useState<string | null>(null);

  const handleSetup = async () => {
    if (!institutionName || !clientId || !tenantId || !secretKey || !driveId) {
      showError('Preencha todos os campos obrigatórios.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await tenantHttpService.setup({
        name: institutionName,
        storageProvider: 'sharepoint',
        baseFolderPath: baseFolderPath || undefined,
        credentials: { clientId, tenantId, secretKey, driveId },
      });
      setAccessCode(response.accessCode);
      setSetupTenantId(response.tenantId);
      showSuccess('Ambiente configurado com sucesso!');
    } catch (err) {
      if (isApiError(err)) {
        showError(err.message);
      } else {
        showError(
          'Falha ao configurar ambiente. Verifique as credenciais e tente novamente.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (setupTenantId) {
      await updateUser({ tenantId: setupTenantId });
      if (isInAppSetup) {
        navigation.goBack();
      }
      // For gate flow: RootNavigator reacts to user.tenantId change automatically
    } else {
      await logout();
    }
  };

  if (accessCode) {
    return (
      <AppContainer
        flex
        justifyContent="center"
        alignItems="center"
        backgroundColor="background-light"
      >
        <View className="w-full rounded-3xl border border-success-100 bg-success-50 p-8 items-center gap-4">
          <AppText variant="h3" color="success-700" align="center">
            Ambiente configurado!
          </AppText>
          <AppText variant="body" color="muted" align="center">
            Compartilhe o código abaixo com os usuários da sua instituição:
          </AppText>
          <View className="rounded-2xl bg-white border border-success-200 px-8 py-4">
            <AppText variant="h2" color="primary-500" align="center" bold>
              {accessCode}
            </AppText>
          </View>
          <AppText variant="bodySmall" color="muted" align="center">
            Guarde este código com segurança. Você pode visualizá-lo novamente
            na aba Perfil.
          </AppText>
          <AppButton
            title="Continuar para o app"
            fullWidth
            onPress={handleContinue}
            className="rounded-2xl"
          />
        </View>
      </AppContainer>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppContainer
          flex
          backgroundColor="background-light"
          alignItems="stretch"
          paddingVertical="3xl"
        >
          <AppText variant="h2" color="primary-500" className="mt-8">
            Configurar ambiente
          </AppText>
          <AppSpacer size="xs" />
          <AppText variant="body" color="muted">
            Configure a conexão com o SharePoint da sua instituição. Após isso,
            você receberá um código de acesso para compartilhar com os usuários.
          </AppText>
          <AppSpacer size="2xl" />

          <AppContainer
            paddingHorizontal="none"
            paddingVertical="none"
            direction="col"
            spacing="md"
            backgroundColor="background-light"
          >
            <AppText variant="label" color="muted">
              Informações da instituição
            </AppText>

            <AppInput
              label="Nome da instituição *"
              placeholder="Ex: Igreja CCB Zona Sul"
              value={institutionName}
              onChangeText={setInstitutionName}
            />

            <AppInput
              label="Pasta base (opcional)"
              placeholder="Ex: /Documentos/Digitalizados"
              value={baseFolderPath}
              onChangeText={setBaseFolderPath}
            />

            <AppSpacer size="sm" />
            <AppText variant="label" color="muted">
              Credenciais SharePoint (Azure AD)
            </AppText>

            <AppInput
              label="Client ID *"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={clientId}
              onChangeText={setClientId}
              autoCapitalize="none"
            />
            <AppInput
              label="Tenant ID *"
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              value={tenantId}
              onChangeText={setTenantId}
              autoCapitalize="none"
            />
            <AppInput
              label="Secret Key *"
              placeholder="Chave secreta do app registration"
              value={secretKey}
              onChangeText={setSecretKey}
              secureTextEntry
              autoCapitalize="none"
            />
            <AppInput
              label="Drive ID *"
              placeholder="ID do drive SharePoint"
              value={driveId}
              onChangeText={setDriveId}
              autoCapitalize="none"
            />
          </AppContainer>

          <AppSpacer size="xl" />

          <AppButton
            title="Configurar ambiente"
            fullWidth
            onPress={handleSetup}
            isLoading={isLoading}
            isDisabled={isLoading}
            className="rounded-2xl shadow-md"
          />

          {!isInAppSetup && (
            <Pressable
              onPress={skipSetup}
              className="mt-4 items-center py-2 active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel="Configurar depois"
            >
              <AppText variant="body" color="muted">
                Configurar depois
              </AppText>
            </Pressable>
          )}
        </AppContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SetupTenantScreen;
