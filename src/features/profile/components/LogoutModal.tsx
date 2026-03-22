import { useEffect, useMemo } from 'react';

import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  View,
} from 'react-native';

import { LogOut, X } from 'lucide-react-native';

import { AppButton } from '@/components/base/AppButton';
import { AppText } from '@/components/base/AppText';
import { colors } from '@/theme';

export type LogoutModalProps = {
  visible: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export const LogoutModal = ({
  visible,
  isLoading = false,
  onConfirm,
  onClose,
}: LogoutModalProps) => {
  const windowHeight = useMemo(() => Dimensions.get('window').height, []);
  const slideAnim = useMemo(
    () => new Animated.Value(windowHeight),
    [windowHeight]
  );

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(windowHeight);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, windowHeight]);

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Pressable
        className="flex-1 justify-end bg-black/45"
        onPress={handleClose}
      >
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="overflow-hidden rounded-t-3xl border-t border-typography-100 bg-background-card"
        >
          <Pressable>
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-typography-200" />
            </View>

            <View className="px-6 pb-10 pt-4">
              <View className="mb-1 items-start">
                <AppText variant="caption" color="muted" className="px-1">
                  Confirmação
                </AppText>
              </View>

              <View className="mb-5 flex-row items-center justify-between">
                <AppText variant="h5" color="default" bold>
                  Sair da conta
                </AppText>

                <Pressable
                  onPress={handleClose}
                  disabled={isLoading}
                  className="h-10 w-10 items-center justify-center rounded-full border border-typography-100 bg-background-light"
                  hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar modal"
                >
                  <X size={16} color={colors.typography[500]} />
                </Pressable>
              </View>

              <View className="mb-8 rounded-2xl border border-error-100 bg-error-50/40 px-4 py-4">
                <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-error-50">
                  <LogOut size={22} color={colors.error[500]} />
                </View>

                <AppText
                  variant="bodyLarge"
                  color="default"
                  className="font-semibold"
                >
                  Deseja realmente sair?
                </AppText>

                <AppText
                  variant="bodySmall"
                  color="muted"
                  className="mt-1 leading-relaxed"
                >
                  Sua sessão será encerrada neste dispositivo.{'\n'}
                  Você precisará fazer login novamente para acessar o app.
                </AppText>
              </View>

              <View className="gap-3">
                <AppButton
                  title="Cancelar"
                  fullWidth
                  variant="outline"
                  action="secondary"
                  onPress={handleClose}
                  isDisabled={isLoading}
                />

                <AppButton
                  title="Sair"
                  fullWidth
                  variant="solid"
                  action="negative"
                  isLoading={isLoading}
                  loadingText="Saindo…"
                  onPress={onConfirm}
                  isDisabled={isLoading}
                />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};
