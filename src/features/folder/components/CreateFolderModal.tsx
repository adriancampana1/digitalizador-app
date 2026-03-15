import { useEffect, useMemo, useRef } from 'react';

import type { TextInput } from 'react-native';
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';

import { AppButton } from '@/components/base/AppButton';
import { AppInput } from '@/components/base/AppInput';
import { AppText } from '@/components/base/AppText';
import { type StorageProvider } from '@/features/document/types';
import { useAppToast } from '@/hooks';

import { useCreateFolder } from '../hooks/useCreateFolder';
import { useFolderNameInput } from '../hooks/useFolderNameInput';

export type CreateFolderModalProps = {
  visible: boolean;
  provider: StorageProvider;
  folderPath: string;
  onClose: () => void;
};

export const CreateFolderModal = ({
  visible,
  provider,
  folderPath,
  onClose,
}: CreateFolderModalProps) => {
  const { success: showSuccess, error: showError } = useAppToast();
  const { mutateAsync: createFolder, isPending } = useCreateFolder();
  const { folderName, setFolderName, trimmedName, reset } =
    useFolderNameInput();

  const windowHeight = useMemo(() => Dimensions.get('window').height, []);
  const slideAnim = useMemo(
    () => new Animated.Value(windowHeight),
    [windowHeight]
  );
  const keyboardOffsetAnim = useMemo(() => new Animated.Value(0), []);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(windowHeight);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }).start(() => inputRef.current?.focus());
    } else {
      Animated.timing(slideAnim, {
        toValue: windowHeight,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, windowHeight]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, event => {
      if (Platform.OS !== 'android') return;

      Animated.timing(keyboardOffsetAnim, {
        toValue: -(event.endCoordinates?.height ?? 0),
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      if (Platform.OS !== 'android') return;

      Animated.timing(keyboardOffsetAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardOffsetAnim]);

  const handleClose = () => {
    if (isPending) return;
    Keyboard.dismiss();
    reset();
    onClose();
  };

  const handleConfirm = async () => {
    if (!trimmedName) return;

    try {
      Keyboard.dismiss();
      await createFolder({ provider, folderPath, folderName: trimmedName });
      showSuccess('Pasta criada!', `"${trimmedName}" foi criada com sucesso.`);
      reset();
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Erro ao criar pasta.');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={handleClose}
        >
          <Animated.View
            style={{
              transform: [
                { translateY: Animated.add(slideAnim, keyboardOffsetAnim) },
              ],
            }}
            className="bg-background-card rounded-t-3xl overflow-hidden"
          >
            <Pressable onPress={Keyboard.dismiss}>
              <View className="items-center pt-3 pb-1">
                <View className="w-10 h-1 rounded-full bg-typography-200" />
              </View>

              <View className="px-6 pt-4 pb-10">
                <View className="flex-row items-center justify-between mb-6">
                  <AppText variant="h5" bold>
                    Nova pasta
                  </AppText>
                  <Pressable
                    onPress={handleClose}
                    className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
                    hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
                  >
                    <AppText variant="body" color="muted">
                      ✕
                    </AppText>
                  </Pressable>
                </View>

                <AppText variant="label" bold className="mb-2">
                  Nome da pasta
                </AppText>
                <AppInput
                  ref={inputRef}
                  value={folderName}
                  onChangeText={setFolderName}
                  placeholder="ex: contratos-2025"
                  returnKeyType="done"
                  onSubmitEditing={handleConfirm}
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                <View className="mt-6">
                  <AppButton
                    title="Criar pasta"
                    fullWidth
                    isLoading={isPending}
                    loadingText="Criando…"
                    onPress={handleConfirm}
                    isDisabled={!trimmedName || isPending}
                  />
                </View>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
