import { useMemo, useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ArrowLeft, ChevronRight, LogOut, Settings } from 'lucide-react-native';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import { env } from '@/configs/env';
import { useAppNavigation, useAppToast, useAuth } from '@/hooks';
import { colors } from '@/theme';
import { formatPhone } from '@/utils';

import { LogoutModal } from '../components/LogoutModal';
import { getUserInitials } from '../utils';

const FALLBACK_USER_NAME = 'Usuário';

const SoonBadge = () => (
  <View className="bg-primary-50 rounded-full px-2 py-0.5">
    <AppText variant="caption" color="primary-500">
      Em breve
    </AppText>
  </View>
);

const ProfileScreen = () => {
  const navigation = useAppNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, logout } = useAuth();
  const { error } = useAppToast();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const userName = user?.name?.trim() || FALLBACK_USER_NAME;
  const phone = useMemo(() => formatPhone(user?.phone), [user?.phone]);
  const userInitials = useMemo(() => getUserInitials(userName), [userName]);
  const bottomSpacingClass = tabBarHeight > 72 ? 'pb-28' : 'pb-24';

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('App', {
      screen: 'AppTabs',
      params: { screen: 'Home' },
    });
  };

  const handleLogoutConfirm = async () => {
    try {
      setIsLoggingOut(true);
      await Promise.resolve(logout());
    } catch {
      error('Falha ao sair', 'Não foi possível encerrar a sessão.');
    } finally {
      setIsLoggingOut(false);
      setLogoutModalVisible(false);
    }
  };

  return (
    <AppContainer
      flex
      backgroundColor="background-light"
      paddingHorizontal="none"
      paddingVertical="none"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        <View className={`flex-1 ${bottomSpacingClass}`}>
          <AppContainer
            variant="safeAreaView"
            backgroundColor="background-dark"
            className="w-full rounded-br-3xl rounded-bl-3xl shadow-lg"
            paddingHorizontal="2xl"
            paddingVertical="none"
            alignItems="center"
          >
            <AppContainer
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing="none"
              backgroundColor="transparent"
              paddingHorizontal="none"
              paddingVertical="none"
              className="w-full pt-6"
            >
              <Pressable
                onPress={handleBack}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center active:opacity-70"
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Voltar"
              >
                <ArrowLeft size={20} color={colors.white} />
              </Pressable>

              <AppContainer
                flex
                backgroundColor="transparent"
                paddingHorizontal="none"
                paddingVertical="none"
                alignItems="center"
                justifyContent="center"
                spacing="none"
              >
                <AppText variant="h3" color="inverted" align="center">
                  Perfil
                </AppText>
              </AppContainer>

              <View className="w-10 h-10" />
            </AppContainer>

            <View className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 items-center justify-center mt-8">
              <AppText variant="h4" color="inverted" bold>
                {userInitials}
              </AppText>
            </View>

            <AppText
              variant="h3"
              color="inverted"
              align="center"
              className="mt-4"
            >
              {userName}
            </AppText>

            <AppText variant="bodyLarge" color="typography-200" align="center">
              {phone}
            </AppText>

            <View className="h-8" />
          </AppContainer>

          <AppContainer
            backgroundColor="background-light"
            className="w-full"
            paddingHorizontal="2xl"
            paddingVertical="2xl"
            spacing="xl"
          >
            <View className="w-full gap-sm">
              <AppText variant="label" color="muted">
                Conta
              </AppText>

              <Pressable
                onPress={() => {}}
                disabled
                className="w-full rounded-2xl bg-background-card px-4 py-4 flex-row items-center"
                accessibilityRole="button"
                accessibilityLabel="Abrir configurações da conta"
              >
                <View className="w-11 h-11 rounded-full bg-background-light items-center justify-center mr-3">
                  <Settings size={19} color={colors.primary[500]} />
                </View>

                <View className="flex-1">
                  <AppText variant="bodyLarge" color="default" bold>
                    Configurações da conta
                  </AppText>
                  <AppText variant="bodySmall" color="muted">
                    Gerencie nome, telefone e senha
                  </AppText>
                </View>

                <SoonBadge />
              </Pressable>
            </View>

            <View className="w-full gap-sm">
              <AppText variant="label" color="muted">
                Sessão
              </AppText>

              <Pressable
                onPress={() => setLogoutModalVisible(true)}
                disabled={isLoggingOut}
                className={`w-full rounded-2xl bg-background-card px-4 py-4 flex-row items-center border border-error-100 active:opacity-75 ${
                  isLoggingOut ? 'opacity-60' : ''
                }`}
                accessibilityRole="button"
                accessibilityLabel="Sair da conta"
              >
                <View className="w-11 h-11 rounded-full bg-error-50 items-center justify-center mr-3">
                  <LogOut size={19} color={colors.error[500]} />
                </View>

                <View className="flex-1">
                  <AppText variant="bodyLarge" color="error" bold>
                    {isLoggingOut ? 'Saindo...' : 'Sair da conta'}
                  </AppText>
                  <AppText variant="bodySmall" color="muted">
                    Encerra a sessão neste dispositivo
                  </AppText>
                </View>

                <ChevronRight size={20} color={colors.error[300]} />
              </Pressable>
            </View>

            <View className="w-full items-center pt-2">
              <AppText variant="caption" color="muted" align="center">
                Versão {env.appVersion}
              </AppText>
            </View>
          </AppContainer>
        </View>
      </ScrollView>

      <LogoutModal
        visible={logoutModalVisible}
        isLoading={isLoggingOut}
        onConfirm={handleLogoutConfirm}
        onClose={() => setLogoutModalVisible(false)}
      />
    </AppContainer>
  );
};

export default ProfileScreen;
