import { useEffect, useMemo, useState } from 'react';

import { Pressable, ScrollView, Share, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  LogOut,
  Settings,
  Share2,
} from 'lucide-react-native';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import { env } from '@/configs/env';
import { tenantHttpService } from '@/features/tenant/http/tenantHttpService';
import {
  useAppNavigation,
  useAppToast,
  useAuth,
  useViewOnlyMode,
} from '@/hooks';
import type { AppStackParamList, AppTabParamList } from '@/navigation/types';
import { colors } from '@/theme';
import { formatPhone } from '@/utils';

import { LogoutModal } from '../components/LogoutModal';
import { getUserInitials } from '../utils';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';

const FALLBACK_USER_NAME = 'Usuário';

const ProfileScreen = () => {
  const navigation = useAppNavigation();
  const tabBarHeight = useBottomTabBarHeight();
  const { user, logout } = useAuth();
  const { error } = useAppToast();
  const { isViewOnly } = useViewOnlyMode();
  const tabNavigation =
    useNavigation<BottomTabNavigationProp<AppTabParamList>>();

  const handleConfigureEnvironment = () =>
    tabNavigation
      .getParent<StackNavigationProp<AppStackParamList>>()
      ?.navigate('SetupEnvironment');

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [isLoadingCode, setIsLoadingCode] = useState(false);

  const userName = user?.name?.trim() || FALLBACK_USER_NAME;
  const phone = useMemo(() => formatPhone(user?.phone), [user?.phone]);
  const userInitials = useMemo(() => getUserInitials(userName), [userName]);
  const isMaster = user?.role === 'MASTER';
  const bottomSpacingClass = tabBarHeight > 72 ? 'pb-28' : 'pb-24';

  useEffect(() => {
    if (!isMaster || isViewOnly) return;
    setIsLoadingCode(true);
    tenantHttpService
      .getMyTenant()
      .then(tenant => setAccessCode(tenant.accessCode))
      .catch(() => setAccessCode(null))
      .finally(() => setIsLoadingCode(false));
  }, [isMaster, isViewOnly]);

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

  const handleShareCode = async () => {
    if (!accessCode) return;
    try {
      await Share.share({
        message: `Código de acesso: ${accessCode}`,
        title: 'Código de acesso',
      });
    } catch {
      // dismissed
    }
  };

  const handleCopyCode = async () => {
    if (!accessCode) return;
    try {
      await Share.share({ message: accessCode, title: 'Código de acesso' });
    } catch {
      // dismissed
    }
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
      <AppContainer
        variant="safeAreaView"
        backgroundColor="background-card"
        paddingHorizontal="none"
        paddingVertical="none"
        spacing="none"
        className="bg-primary-500 pb-8 w-full"
      >
        <View className="px-6 pt-4 pb-6">
          <Pressable
            onPress={handleBack}
            className="w-9 h-9 rounded-full bg-white/15 items-center justify-center"
            hitSlop={8}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={18} color={colors.white} />
          </Pressable>
        </View>

        <View className="w-full items-center px-6">
          <View className="w-[72px] h-[72px] rounded-2xl bg-white/15 items-center justify-center">
            <AppText variant="h3" color="inverted" bold>
              {userInitials}
            </AppText>
          </View>

          <AppText
            variant="h4"
            color="inverted"
            align="center"
            className="mt-4"
            numberOfLines={1}
          >
            {userName}
          </AppText>

          <AppText
            variant="bodySmall"
            color="inverted"
            align="center"
            className="mt-1 opacity-60"
          >
            {phone}
          </AppText>

          <View className="flex-row gap-2 mt-3">
            <View className="rounded-full bg-white/15 px-3 py-1">
              <AppText variant="caption" color="inverted">
                {isMaster ? 'Administrador' : 'Usuário'}
              </AppText>
            </View>
            <View className="rounded-full bg-success-500/25 px-3 py-1">
              <AppText variant="caption" className="text-success-300">
                Conta ativa
              </AppText>
            </View>
          </View>
        </View>
      </AppContainer>

      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        <View className={`px-6 pt-6 gap-4 ${bottomSpacingClass}`}>
          {isMaster &&
            (isViewOnly ? (
              <View className="rounded-2xl border border-typography-100 bg-background-card overflow-hidden">
                <Pressable
                  onPress={handleConfigureEnvironment}
                  className="flex-row items-center gap-3 px-4 py-4 active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel="Configurar ambiente"
                >
                  <View className="w-10 h-10 rounded-xl bg-primary-50 items-center justify-center">
                    <Settings size={18} color={colors.primary[500]} />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <AppText variant="bodySmall" bold color="default">
                      Configurar ambiente
                    </AppText>
                    <AppText variant="caption" color="muted">
                      Configure o SharePoint para liberar todas as funções
                    </AppText>
                  </View>
                  <ChevronRight size={16} color={colors.typography[300]} />
                </Pressable>
              </View>
            ) : (
              <View className="rounded-2xl border border-typography-100 bg-background-card px-5 py-5 gap-4">
                <View className="gap-1">
                  <AppText
                    variant="label"
                    color="muted"
                    bold
                    className="tracking-widest uppercase"
                  >
                    Código de acesso
                  </AppText>
                  <AppText variant="caption" color="muted">
                    Compartilhe com os membros da sua instituição para que
                    possam se registrar.
                  </AppText>
                </View>

                {isLoadingCode ? (
                  <View className="h-14 items-center justify-center rounded-xl bg-background-light">
                    <AppText variant="caption" color="muted">
                      Carregando...
                    </AppText>
                  </View>
                ) : accessCode ? (
                  <View className="gap-3">
                    <View className="rounded-xl border border-primary-100 bg-primary-50 items-center py-4">
                      <AppText
                        variant="h3"
                        color="primary-500"
                        bold
                        className="tracking-widest"
                      >
                        {accessCode}
                      </AppText>
                    </View>

                    <View className="flex-row gap-2">
                      <Pressable
                        onPress={handleCopyCode}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-typography-100 bg-background-light py-3 active:opacity-70"
                        accessibilityRole="button"
                        accessibilityLabel="Copiar código"
                      >
                        <Copy size={15} color={colors.typography[600]} />
                        <AppText
                          variant="bodySmall"
                          color="default"
                          className="font-medium"
                        >
                          Copiar
                        </AppText>
                      </Pressable>

                      <Pressable
                        onPress={handleShareCode}
                        className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-primary-100 bg-primary-50 py-3 active:opacity-70"
                        accessibilityRole="button"
                        accessibilityLabel="Compartilhar código"
                      >
                        <Share2 size={15} color={colors.primary[500]} />
                        <AppText
                          variant="bodySmall"
                          color="primary-500"
                          className="font-medium"
                        >
                          Compartilhar
                        </AppText>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View className="h-12 items-center justify-center rounded-xl border border-error-100 bg-error-50">
                    <AppText variant="caption" color="error">
                      Não foi possível carregar o código
                    </AppText>
                  </View>
                )}
              </View>
            ))}

          <View className="rounded-2xl border border-error-100 bg-error-50/40 overflow-hidden">
            <Pressable
              onPress={() => setLogoutModalVisible(true)}
              disabled={isLoggingOut}
              className={`flex-row items-center gap-3 px-4 py-4 ${isLoggingOut ? 'opacity-60' : 'active:opacity-70'}`}
              accessibilityRole="button"
              accessibilityLabel="Sair da conta"
            >
              <View className="w-10 h-10 rounded-xl bg-error-50 items-center justify-center">
                <LogOut size={18} color={colors.error[500]} />
              </View>
              <AppText variant="bodySmall" bold color="error">
                {isLoggingOut ? 'Saindo...' : 'Sair da conta'}
              </AppText>
            </Pressable>
          </View>

          <View className="items-center pt-4">
            <AppText variant="caption" color="muted" align="center">
              Versão {env.appVersion}
            </AppText>
          </View>
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
