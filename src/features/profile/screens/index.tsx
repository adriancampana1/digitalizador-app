import { useMemo, useState } from 'react';

import { Pressable, ScrollView, View } from 'react-native';

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ArrowLeft, ChevronRight, LogOut } from 'lucide-react-native';

import { AppContainer } from '@/components/base/AppContainer';
import { AppText } from '@/components/base/AppText';
import { env } from '@/configs/env';
import { useAppNavigation, useAppToast, useAuth } from '@/hooks';
import { colors } from '@/theme';
import { formatPhone } from '@/utils';

import { LogoutModal } from '../components/LogoutModal';
import { getUserInitials } from '../utils';

const FALLBACK_USER_NAME = 'Usuário';

type ProfileActionRowProps = {
  title: string;
  description: string;
  onPress: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  trailing?: React.ReactNode;
};

const ProfileActionRow = ({
  title,
  description,
  onPress,
  icon,
  disabled = false,
  destructive = false,
  trailing,
}: ProfileActionRowProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    className={`w-full flex-row items-center rounded-2xl border px-4 py-4 ${
      destructive
        ? 'border-error-100 bg-error-50/40'
        : 'border-typography-100 bg-background-card'
    } ${disabled ? 'opacity-60' : 'active:opacity-80'}`}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <View
      className={`mr-3 h-11 w-11 items-center justify-center rounded-full ${
        destructive ? 'bg-error-50' : 'bg-background-light'
      }`}
    >
      {icon}
    </View>

    <View className="flex-1 gap-0.5">
      <AppText
        variant="bodyLarge"
        color={destructive ? 'error' : 'default'}
        className="font-semibold"
      >
        {title}
      </AppText>
      <AppText variant="bodySmall" color="muted">
        {description}
      </AppText>
    </View>

    {trailing ?? (
      <ChevronRight
        size={18}
        color={destructive ? colors.error[300] : colors.typography[300]}
      />
    )}
  </Pressable>
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
      <AppContainer
        variant="safeAreaView"
        backgroundColor="background-light"
        paddingHorizontal="2xl"
        paddingVertical="none"
        className="w-full border-b border-typography-100 pb-3"
      >
        <AppContainer
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing="none"
          backgroundColor="transparent"
          paddingHorizontal="none"
          paddingVertical="none"
          className="w-full pt-4"
        >
          <Pressable
            onPress={handleBack}
            className="h-10 w-10 items-center justify-center rounded-full border border-typography-100 bg-background-card active:opacity-70"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={18} color={colors.typography[700]} />
          </Pressable>

          <AppText variant="h4" color="default" align="center">
            Perfil
          </AppText>

          <View className="h-10 w-10" />
        </AppContainer>
      </AppContainer>

      <ScrollView showsVerticalScrollIndicator={false} className="w-full">
        <View className={`flex-1 px-2xl pt-xl ${bottomSpacingClass}`}>
          <View className="w-full rounded-3xl border border-typography-100 bg-background-card px-5 py-6">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-50 self-center">
              <AppText variant="h4" color="primary-500" bold>
                {userInitials}
              </AppText>
            </View>

            <AppText
              variant="h4"
              color="default"
              align="center"
              className="mt-4"
              numberOfLines={1}
            >
              {userName}
            </AppText>

            <AppText
              variant="body"
              color="muted"
              align="center"
              className="mt-1"
            >
              {phone}
            </AppText>

            <View className="mt-4 self-center rounded-full border border-success-100 bg-success-50 px-3 py-1">
              <AppText
                variant="caption"
                color="success-700"
                className="font-medium"
              >
                Conta ativa
              </AppText>
            </View>
          </View>

          <View className="mt-lg w-full gap-sm">
            <AppText variant="label" color="muted" className="px-1">
              Sessão
            </AppText>

            <ProfileActionRow
              title={isLoggingOut ? 'Saindo...' : 'Sair da conta'}
              description="Encerra a sessão neste dispositivo"
              onPress={() => setLogoutModalVisible(true)}
              disabled={isLoggingOut}
              destructive
              icon={<LogOut size={19} color={colors.error[500]} />}
            />
          </View>

          <View className="w-full items-center pt-2xl">
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
