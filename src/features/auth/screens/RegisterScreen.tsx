import { Pressable, View } from 'react-native';

import { AppButton } from '@/components/layout/AppButton';
import { AppContainer } from '@/components/layout/AppContainer';
import { AppInput } from '@/components/layout/AppInput';
import { AppSpacer } from '@/components/layout/AppSpacer';
import { AppText } from '@/components/layout/AppText';
import { Logo } from '@/components/Logo';
import { ArrowRightIcon, EyeIcon } from '@/components/ui/icon';
import { useAppNavigation } from '@/hooks';

const RegisterScreen = () => {
  const navigation = useAppNavigation();

  const handleNavigateToLogin = () => {
    navigation.goBack();
  };

  return (
    <AppContainer flex justifyContent="space-between" className="bg-white">
      <View className="absolute top-0 left-0 w-1/2 h-72 bg-typography-100 rounded-br-[120px] opacity-60" />

      <AppContainer
        paddingVertical="none"
        paddingHorizontal="none"
        flex
        justifyContent="center"
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
        >
          <AppInput
            label="Telefone"
            placeholder="(99) 99999-9999"
            value=""
            onChangeText={() => {}}
            keyboardType="phone-pad"
          />
          <AppInput
            label="Nome"
            placeholder="Digite seu nome"
            value=""
            onChangeText={() => {}}
            keyboardType="default"
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
          title="Cadastrar"
          fullWidth
          onPress={() => {}}
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
