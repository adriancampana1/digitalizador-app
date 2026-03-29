import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';

import { FolderPlus } from 'lucide-react-native';

import { AppButton } from '@/components/base/AppButton';
import { AppText } from '@/components/base/AppText';
import { colors } from '@/theme';

type Props = {
  visible: boolean;
  isLoading?: boolean;
  onConfirm: (name: string) => void;
  onClose: () => void;
};

export const CreateFolderModal = ({
  visible,
  isLoading = false,
  onConfirm,
  onClose,
}: Props) => {
  const [folderName, setFolderName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const windowHeight = useMemo(() => Dimensions.get('window').height, []);
  const slideAnim = useMemo(
    () => new Animated.Value(windowHeight),
    [windowHeight]
  );

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : windowHeight,
      duration: visible ? 300 : 220,
      easing: visible ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;

      if (visible) {
        inputRef.current?.focus();
        return;
      }

      setFolderName('');
      setIsFocused(false);
    });
  }, [visible, slideAnim, windowHeight]);

  const handleConfirm = () => {
    if (folderName.trim()) onConfirm(folderName.trim());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
          <Animated.View
            className="bg-background-card rounded-t-3xl overflow-hidden"
            style={{ transform: [{ translateY: slideAnim }] }}
          >
            <Pressable>
              {/* Drag handle */}
              <View className="items-center pt-3 pb-2">
                <View className="w-9 h-1 rounded-full bg-typography-200" />
              </View>

              {/* Content */}
              <View className="px-6 pt-2 pb-10 gap-7">
                {/* Icon + heading block */}
                <View className="flex-row items-start gap-[14px]">
                  <View className="w-11 h-11 rounded-[14px] bg-primary-50 items-center justify-center mt-0.5">
                    <FolderPlus size={20} color={colors.primary[500]} />
                  </View>
                  <View className="flex-1 gap-1">
                    <AppText variant="h4" color="default">
                      Nova pasta
                    </AppText>
                    <AppText variant="caption" color="muted" className="mt-0.5">
                      Dê um nome para organizar seus documentos.
                    </AppText>
                  </View>
                </View>

                {/* Input field */}
                <View className="gap-2.5">
                  <AppText
                    variant="caption"
                    color="muted"
                    bold
                    className="tracking-widest"
                  >
                    NOME DA PASTA
                  </AppText>
                  <View
                    className={`pb-2.5 border-b-[1.5px] ${
                      isFocused ? 'border-primary-500' : 'border-typography-200'
                    }`}
                  >
                    <TextInput
                      ref={inputRef}
                      placeholder="Ex: Contratos, Clientes 2024..."
                      placeholderTextColor={colors.typography[300]}
                      value={folderName}
                      onChangeText={setFolderName}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      returnKeyType="done"
                      onSubmitEditing={handleConfirm}
                      maxLength={120}
                      style={{
                        color: colors.typography[800],
                        fontSize: 17,
                        fontFamily: 'LexendDeca_400Regular',
                        padding: 0,
                        lineHeight: 24,
                      }}
                    />
                  </View>
                </View>

                {/* CTA */}
                <AppButton
                  title="Criar pasta"
                  fullWidth
                  isLoading={isLoading}
                  isDisabled={isLoading || !folderName.trim()}
                  onPress={handleConfirm}
                  className="rounded-2xl"
                />
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
