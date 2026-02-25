import { useState } from 'react';

import { Pressable, View } from 'react-native';

import { AppButton } from '@/components/base/AppButton';
import { AppContainer } from '@/components/base/AppContainer';
import { AppInput } from '@/components/base/AppInput';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import { Logo } from '@/components/Logo';
import { ArrowRightIcon, EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { useAppNavigation, useAppToast, useAuth, usePhoneMask } from '@/hooks';
import { isApiError } from '@/utils/api';

const LoginScreen = () => {
  const { login, isLoading } = useAuth();
  const { error: showError } = useAppToast();
  const { value: maskedPhone, rawValue: phone, applyMask } = usePhoneMask();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useAppNavigation();

  const handleNavigateToRegister = () => {
    navigation.navigate('Auth', {
      screen: 'Register',
    });
  };

  const handleLogin = async () => {
    try {
      await login(phone, password);
    } catch (err) {
      if (isApiError(err)) {
        showError(err.message);
      } else {
        showError('Erro ao fazer login. Por favor, tente novamente.');
      }
    }
    return login(phone, password);
  };
  return (
    <AppContainer
      flex
      justifyContent="space-between"
      className="bg-background-light"
      alignItems="stretch"
    >
      <View className="absolute top-0 right-0 w-1/2 h-72 bg-typography-100 rounded-bl-[120px] opacity-60" />

      <AppContainer
        paddingVertical="none"
        paddingHorizontal="none"
        flex
        justifyContent="center"
        backgroundColor="background-light"
        alignItems="stretch"
      >
        <Logo size="2xl" />

        <AppText variant="h1" className="text-primary-500 leading-tight">
          Digitalizador
        </AppText>
        <AppSpacer size="xs" />

        <AppText variant="body">
          Digitalize seus documentos com precisão e praticidade.
        </AppText>

        <AppSpacer size="3xl" />

        <AppContainer
          paddingHorizontal="none"
          paddingVertical="none"
          direction="col"
          spacing="md"
        >
          <AppInput
            label="Telefone"
            placeholder="(99) 99999-9999"
            value={maskedPhone}
            onChangeText={applyMask}
            keyboardType="phone-pad"
          />
          <AppInput
            label="Senha"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={showPassword ? EyeOffIcon : EyeIcon}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
        </AppContainer>

        <AppSpacer size="sm" />

        <AppButton
          title="Entrar"
          fullWidth
          onPress={handleLogin}
          rightIcon={ArrowRightIcon}
          className="rounded-2xl shadow-md"
          isDisabled={isLoading}
          isLoading={isLoading}
        />
      </AppContainer>

      <AppContainer
        alignItems="center"
        justifyContent="center"
        direction="row"
        wrap
        paddingHorizontal="none"
        spacing="xs"
        className="mb-6"
      >
        <AppText variant="bodySmall" className="text-typography-500">
          {'Não tem uma conta?'}
        </AppText>
        <Pressable onPress={handleNavigateToRegister}>
          <AppText variant="button" className="text-primary-500 underline">
            Cadastre-se aqui
          </AppText>
        </Pressable>
      </AppContainer>
    </AppContainer>
  );
};

export default LoginScreen;
