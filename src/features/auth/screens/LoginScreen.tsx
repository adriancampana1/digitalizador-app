import { Pressable, View } from 'react-native';

import { AppButton } from '@/components/layout/AppButton';
import { AppContainer } from '@/components/layout/AppContainer';
import { AppInput } from '@/components/layout/AppInput';
import { AppSpacer } from '@/components/layout/AppSpacer';
import { AppText } from '@/components/layout/AppText';
import { Logo } from '@/components/Logo';
import { ArrowRightIcon, EyeIcon } from '@/components/ui/icon';
import { useAppNavigation, useAuth } from '@/hooks';

const LoginScreen = () => {
  const navigation = useAppNavigation();
  const { login } = useAuth();

  const handleNavigateToRegister = () => {
    navigation.navigate('Auth', {
      screen: 'Register',
    });
  };

  const handleLogin = () => {
    return login('43999999999', 'password');
  };
  return (
    <AppContainer flex justifyContent="space-between" className="bg-white">
      <View className="absolute top-0 right-0 w-1/2 h-72 bg-typography-100 rounded-bl-[120px] opacity-60" />

      <AppContainer
        paddingVertical="none"
        paddingHorizontal="none"
        flex
        justifyContent="center"
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
            value=""
            onChangeText={() => {}}
            keyboardType="phone-pad"
          />
          <AppInput
            label="Senha"
            placeholder="••••••••"
            value=""
            onChangeText={() => {}}
            secureTextEntry
            rightIcon={EyeIcon}
          />
        </AppContainer>

        <AppSpacer size="3xl" />

        <AppButton
          title="Entrar"
          fullWidth
          onPress={handleLogin}
          rightIcon={ArrowRightIcon}
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
