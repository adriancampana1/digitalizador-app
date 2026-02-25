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

const RegisterScreen = () => {
  const { register, isLoading } = useAuth();
  const { error: showError } = useAppToast();

  const { value: maskedPhone, rawValue: phone, applyMask } = usePhoneMask();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useAppNavigation();

  const handleRegister = async () => {
    try {
      await register(phone, name, password);
    } catch (err) {
      if (isApiError(err)) {
        showError(err.message);
      } else {
        showError('Erro ao registrar usuário. Por favor, tente novamente.');
      }
    }
  };

  const handleNavigateToLogin = () => {
    navigation.goBack();
  };

  return (
    <AppContainer
      flex
      justifyContent="space-between"
      backgroundColor="background-light"
      alignItems="stretch"
    >
      <View className="absolute top-0 left-0 w-1/2 h-72 bg-typography-100 rounded-br-[120px] opacity-60" />

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
          Criar conta
        </AppText>
        <AppSpacer size="xs" />

        <AppText variant="body">
          Preencha os dados para começar a digitalizar seus documentos.
        </AppText>

        <AppSpacer size="3xl" />

        <AppContainer
          paddingHorizontal="none"
          paddingVertical="none"
          direction="col"
          spacing="md"
          backgroundColor="background-light"
        >
          <AppInput
            label="Telefone"
            placeholder="(99) 99999-9999"
            value={maskedPhone}
            onChangeText={applyMask}
            keyboardType="phone-pad"
          />
          <AppInput
            label="Nome"
            placeholder="Digite seu nome"
            value={name}
            onChangeText={setName}
            keyboardType="default"
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
          title="Cadastrar"
          fullWidth
          onPress={handleRegister}
          rightIcon={ArrowRightIcon}
          isLoading={isLoading}
          isDisabled={isLoading}
          className="rounded-2xl shadow-md"
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
        backgroundColor="background-light"
      >
        <AppText variant="bodySmall" className="text-typography-500">
          Já possui uma conta?
        </AppText>
        <Pressable onPress={handleNavigateToLogin}>
          <AppText variant="button" className="text-primary-500 underline">
            Entrar
          </AppText>
        </Pressable>
      </AppContainer>
    </AppContainer>
  );
};

export default RegisterScreen;
