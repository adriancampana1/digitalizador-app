import { useEffect, useMemo } from 'react';

import { Animated, Dimensions, Modal, Pressable, View } from 'react-native';

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
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 220,
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
        className="flex-1 bg-black/50 justify-end"
        onPress={handleClose}
      >
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="bg-background-card rounded-t-3xl overflow-hidden"
        >
          <Pressable>
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-typography-200" />
            </View>

            <View className="px-6 pt-4 pb-10">
              <View className="flex-row items-center justify-between mb-6">
                <AppText variant="h5" bold>
                  Sair da conta
                </AppText>

                <Pressable
                  onPress={handleClose}
                  disabled={isLoading}
                  className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
                  hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar modal"
                >
                  <X size={18} color={colors.typography[400]} />
                </Pressable>
              </View>

              <View className="items-center mb-8">
                <View className="w-16 h-16 rounded-full bg-error-50 items-center justify-center mb-5">
                  <LogOut size={28} color={colors.error[500]} />
                </View>

                <AppText
                  variant="body"
                  color="muted"
                  align="center"
                  className="leading-relaxed"
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
                  onPress={handleClose}
                  isDisabled={isLoading}
                />

                <AppButton
                  title="Sair"
                  fullWidth
                  variant="solid"
                  isLoading={isLoading}
                  loadingText="Saindo…"
                  onPress={onConfirm}
                  isDisabled={isLoading}
                  className="bg-error-500"
                />
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};
