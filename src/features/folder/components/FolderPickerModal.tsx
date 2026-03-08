import { useEffect, useMemo } from 'react';

import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/base/AppButton';
import { AppText } from '@/components/base/AppText';
import type { StorageProvider } from '@/features/document/types';

import { useFolderPicker } from '../hooks/useFolderPicker';

import type { FolderOption } from '../types';

export type FolderPickerModalProps = {
  visible: boolean;
  provider: StorageProvider;
  /** Caminho inicialmente selecionado (para re-abrir no estado anterior). */
  initialPath?: string;
  onConfirm: (path: string) => void;
  onClose: () => void;
};

type FolderItemProps = {
  folder: FolderOption;
  onPress: () => void;
  onEnter: () => void;
};

const FolderItem = ({ folder, onPress, onEnter }: FolderItemProps) => (
  <Pressable
    onPress={onPress}
    className="flex-row items-center py-3 px-1 border-b border-typography-100"
  >
    <View className="w-9 h-9 rounded-lg bg-primary-50 items-center justify-center mr-3">
      <Ionicons name="folder-outline" size={20} color="#003D5C" />
    </View>

    <AppText variant="body" className="flex-1" numberOfLines={1}>
      {folder.name}
    </AppText>

    {folder.hasChildren && (
      <Pressable
        onPress={onEnter}
        hitSlop={12}
        className="w-8 h-8 items-center justify-center"
      >
        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
      </Pressable>
    )}
  </Pressable>
);

type BreadcrumbEntry = { label: string; path: string };

type BreadcrumbBarProps = {
  breadcrumb: BreadcrumbEntry[];
  onNavigate: (index: number) => void;
};

const BreadcrumbBar = ({ breadcrumb, onNavigate }: BreadcrumbBarProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="flex-row"
    contentContainerClassName="flex-row items-center gap-1 py-1"
  >
    <Pressable onPress={() => onNavigate(-1)} hitSlop={8}>
      <AppText
        variant="caption"
        color={breadcrumb.length === 0 ? 'primary-500' : 'muted'}
        bold={breadcrumb.length === 0}
      >
        Raiz
      </AppText>
    </Pressable>

    {breadcrumb.map((entry, index) => (
      <View key={entry.path} className="flex-row items-center gap-1">
        <Ionicons name="chevron-forward" size={12} color="#9ca3af" />
        <Pressable onPress={() => onNavigate(index)} hitSlop={8}>
          <AppText
            variant="caption"
            color={index === breadcrumb.length - 1 ? 'primary-500' : 'muted'}
            bold={index === breadcrumb.length - 1}
            numberOfLines={1}
          >
            {entry.label}
          </AppText>
        </Pressable>
      </View>
    ))}
  </ScrollView>
);

const EmptyState = () => (
  <View className="flex-1 items-center justify-center py-12">
    <View className="w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center mb-3">
      <Ionicons name="folder-open-outline" size={28} color="#9ca3af" />
    </View>
    <AppText variant="body" color="muted" align="center">
      Nenhuma pasta encontrada
    </AppText>
    <AppText variant="caption" color="muted" align="center" className="mt-1">
      Este local não contém sub-pastas.
    </AppText>
  </View>
);

export const FolderPickerModal = ({
  visible,
  provider,
  initialPath: _initialPath,
  onConfirm,
  onClose,
}: FolderPickerModalProps) => {
  const {
    folders,
    breadcrumb,
    currentPath,
    isLoading,
    enterFolder,
    navigateTo,
    initialize,
  } = useFolderPicker();

  const slideAnim = useMemo(() => new Animated.Value(700), []);

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(700);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
      initialize(provider);
    } else {
      Animated.timing(slideAnim, {
        toValue: 700,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, provider, slideAnim, initialize]);

  const handleSelectCurrent = () => {
    onConfirm(currentPath);
  };

  const handleSelectFolder = (folder: FolderOption) => {
    onConfirm(folder.path);
  };

  const confirmLabel =
    breadcrumb.length === 0 ? 'Salvar na raiz' : `Salvar aqui`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/60 justify-end" onPress={onClose}>
        <Animated.View
          style={{ transform: [{ translateY: slideAnim }] }}
          className="bg-background-card rounded-t-3xl overflow-hidden"
        >
          <Pressable>
            <View className="items-center pt-3 pb-1">
              <View className="w-10 h-1 rounded-full bg-typography-200" />
            </View>

            <View className="flex-row items-center px-6 pt-4 pb-3">
              <View className="flex-1">
                <AppText variant="h5" bold>
                  Selecionar pasta
                </AppText>
                <AppText variant="caption" color="muted" className="mt-0.5">
                  Escolha onde o documento será salvo
                </AppText>
              </View>
              <Pressable
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                hitSlop={8}
              >
                <Ionicons name="close" size={18} color="#6B7280" />
              </Pressable>
            </View>

            <View className="px-6 pb-2 border-b border-typography-100">
              <BreadcrumbBar breadcrumb={breadcrumb} onNavigate={navigateTo} />
            </View>

            <View className="px-6 min-h-60 max-h-96">
              {isLoading ? (
                <View className="flex-1 items-center justify-center py-12">
                  <ActivityIndicator color="#003D5C" />
                  <AppText variant="caption" color="muted" className="mt-2">
                    Carregando pastas…
                  </AppText>
                </View>
              ) : folders.length === 0 ? (
                <EmptyState />
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {folders.map(folder => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      onPress={() => handleSelectFolder(folder)}
                      onEnter={() => enterFolder(folder)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View className="px-6 pt-4 pb-8 border-t border-typography-100">
              <AppButton
                title={confirmLabel}
                fullWidth
                onPress={handleSelectCurrent}
                isDisabled={isLoading}
                leftIcon={ConfirmIcon}
              />
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const ConfirmIcon = () => <Ionicons name="checkmark" size={18} color="#fff" />;
