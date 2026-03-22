import { useEffect, useMemo, useState } from 'react';

import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/base/AppButton';
import { AppInput } from '@/components/base/AppInput';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import { StorageProvider } from '@/features/document/types';
import { FolderPickerModal } from '@/features/folder/components/FolderPickerModal';

import { generateDocumentName } from '../utils/scanUtils';

import type { LocalSaveInput } from '../hooks/useLocalSaveDocument';
import type { UploadScannedDocumentInput } from '../hooks/useUploadScannedDocument';
import type { OutputFormat, SaveDestinationType, ScannedPage } from '../types';

type ProviderOption = {
  id: StorageProvider;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
};

type FormatOption = {
  id: OutputFormat;
  label: string;
  description: string;
};

const PROVIDER_OPTIONS: ProviderOption[] = [
  {
    id: StorageProvider.sharepoint,
    label: 'SharePoint',
    description: 'Armazenar no SharePoint da organização',
    icon: 'business-outline',
    iconColor: '#7C5CDB',
    iconBg: '#f5f3fc',
  },
];

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'pdf',
    label: 'PDF',
    description: 'Melhor para impressão e arquivamento',
  },
  {
    id: 'jpeg',
    label: 'JPEG',
    description: 'Arquivo de imagem compacto',
  },
];

type SelectableCardProps = {
  selected: boolean;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  description: string;
};

const SelectableCard = ({
  selected,
  onPress,
  icon,
  iconColor,
  iconBg,
  label,
  description,
}: SelectableCardProps) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center rounded-xl p-4 border ${
      selected
        ? 'border-primary-500 bg-primary-50'
        : 'border-typography-200 bg-background-card'
    }`}
  >
    <View
      className="w-10 h-10 rounded-lg items-center justify-center"
      style={{ backgroundColor: iconBg }}
    >
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>

    <View className="flex-1 ml-3">
      <AppText variant="label" bold>
        {label}
      </AppText>
      <AppText variant="caption" color="muted" className="mt-0.5">
        {description}
      </AppText>
    </View>

    <View
      className={`w-5 h-5 rounded-full border-2 items-center justify-center ml-2 ${
        selected ? 'border-primary-500' : 'border-typography-300'
      }`}
    >
      {selected && <View className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
    </View>
  </Pressable>
);

type FormatChipProps = {
  option: FormatOption;
  selected: boolean;
  onPress: () => void;
};

const FormatChip = ({ option, selected, onPress }: FormatChipProps) => (
  <Pressable
    onPress={onPress}
    className={`flex-1 items-center rounded-xl py-3 px-4 border ${
      selected
        ? 'border-primary-500 bg-primary-50'
        : 'border-typography-200 bg-background-card'
    }`}
  >
    <AppText variant="label" bold color={selected ? 'primary-500' : 'default'}>
      {option.label}
    </AppText>
    <AppText
      variant="caption"
      color={selected ? 'primary-500' : 'muted'}
      align="center"
      className="mt-0.5"
    >
      {option.description}
    </AppText>
  </Pressable>
);

const UploadIcon = () => (
  <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
);
const ExportIcon = () => (
  <Ionicons name="share-social-outline" size={18} color="#fff" />
);

export type SaveDocumentModalProps = {
  visible: boolean;
  pages: ScannedPage[];
  onClose: () => void;
  onSuccess: () => void;
  upload: (input: UploadScannedDocumentInput) => Promise<boolean>;
  save: (input: LocalSaveInput) => Promise<boolean>;
  isUploading: boolean;
  isSaving: boolean;
};

export const SaveDocumentModal = ({
  visible,
  pages,
  onClose,
  onSuccess,
  upload,
  isUploading,
  save,
  isSaving,
}: SaveDocumentModalProps) => {
  const [documentName, setDocumentName] = useState('');
  const [destination, setDestination] = useState<SaveDestinationType>('upload');
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider>(
    StorageProvider.sharepoint
  );
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('pdf');
  const [folderPath, setFolderPath] = useState<string>('');
  const [folderPickerVisible, setFolderPickerVisible] = useState(false);

  const windowHeight = useMemo(() => Dimensions.get('window').height, []);
  const slideAnim = useMemo(
    () => new Animated.Value(windowHeight),
    [windowHeight]
  );

  const isLoading = isUploading || isSaving;

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
    Keyboard.dismiss();
    onClose();
  };

  const handleConfirm = async () => {
    let success = false;

    if (destination === 'upload') {
      success = await upload({
        pages,
        documentName,
        storageProvider: selectedProvider,
        outputFormat,
        folderPath: folderPath || undefined,
      });
    } else {
      success = await save({ pages, documentName, outputFormat });
    }

    if (success) {
      onSuccess();
    }
  };

  const placeholder = generateDocumentName();

  return (
    <>
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
            style={{
              transform: [{ translateY: slideAnim }],
              maxHeight: windowHeight * 0.9,
            }}
            className="bg-background-card rounded-t-3xl overflow-hidden"
          >
            <Pressable onPress={() => Keyboard.dismiss()}>
              <View className="items-center pt-3 pb-1">
                <View className="w-10 h-1 rounded-full bg-typography-200" />
              </View>

              <View className="px-6 pt-4 pb-8">
                {/* Header */}
                <View className="flex-row items-center mb-5">
                  <View className="flex-1">
                    <AppText variant="h5" bold>
                      Salvar documento
                    </AppText>
                    <AppText variant="caption" color="muted" className="mt-0.5">
                      {pages.length === 1
                        ? '1 página digitalizada'
                        : `${pages.length} páginas digitalizadas`}
                    </AppText>
                  </View>

                  <Pressable
                    onPress={handleClose}
                    className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center"
                    hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={18} color="#6B7280" />
                  </Pressable>
                </View>

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <AppText variant="label" bold className="mb-2">
                    Nome do documento
                  </AppText>
                  <AppInput
                    value={documentName}
                    onChangeText={setDocumentName}
                    placeholder={placeholder}
                    helperText="Deixe em branco para usar o nome gerado automaticamente."
                  />

                  <AppSpacer size="xl" />

                  <AppText variant="label" bold className="mb-3">
                    Destino
                  </AppText>
                  <View className="flex-row rounded-xl bg-gray-100 p-1 mb-4">
                    <Pressable
                      onPress={() => setDestination('upload')}
                      className={`flex-1 flex-row items-center justify-center rounded-lg py-2.5 gap-2 ${
                        destination === 'upload'
                          ? 'bg-background-card shadow-soft-1'
                          : ''
                      }`}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={16}
                        color={destination === 'upload' ? '#003D5C' : '#6B7280'}
                      />
                      <AppText
                        variant="label"
                        bold={destination === 'upload'}
                        color={
                          destination === 'upload' ? 'primary-500' : 'muted'
                        }
                      >
                        Enviar
                      </AppText>
                    </Pressable>

                    <Pressable
                      onPress={() => setDestination('download')}
                      className={`flex-1 flex-row items-center justify-center rounded-lg py-2.5 gap-2 ${
                        destination === 'download'
                          ? 'bg-background-card shadow-soft-1'
                          : ''
                      }`}
                    >
                      <Ionicons
                        name="share-social-outline"
                        size={16}
                        color={
                          destination === 'download' ? '#003D5C' : '#6B7280'
                        }
                      />
                      <AppText
                        variant="label"
                        bold={destination === 'download'}
                        color={
                          destination === 'download' ? 'primary-500' : 'muted'
                        }
                      >
                        Exportar
                      </AppText>
                    </Pressable>
                  </View>

                  {destination === 'upload' && (
                    <View className="gap-2 mb-4">
                      {PROVIDER_OPTIONS.length > 1 &&
                        PROVIDER_OPTIONS.map(opt => (
                          <SelectableCard
                            key={opt.id}
                            selected={selectedProvider === opt.id}
                            onPress={() => {
                              setSelectedProvider(opt.id);
                              setFolderPath('');
                            }}
                            icon={opt.icon}
                            iconColor={opt.iconColor}
                            iconBg={opt.iconBg}
                            label={opt.label}
                            description={opt.description}
                          />
                        ))}

                      <AppText variant="label" bold className="mt-2 mb-1">
                        Pasta de destino
                      </AppText>
                      <Pressable
                        onPress={() => setFolderPickerVisible(true)}
                        className="flex-row items-center rounded-xl p-4 border border-typography-200 bg-background-card"
                      >
                        <View className="w-10 h-10 rounded-lg bg-primary-50 items-center justify-center mr-3">
                          <Ionicons
                            name="folder-outline"
                            size={20}
                            color="#003D5C"
                          />
                        </View>
                        <View className="flex-1">
                          <AppText variant="caption" color="muted">
                            {folderPath
                              ? 'Pasta selecionada'
                              : 'Salvar na raiz (padrão)'}
                          </AppText>
                          <AppText
                            variant="label"
                            color={folderPath ? 'default' : 'muted'}
                            numberOfLines={1}
                            className="mt-0.5"
                          >
                            {folderPath || 'Toque para selecionar uma pasta'}
                          </AppText>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color="#9ca3af"
                        />
                      </Pressable>
                    </View>
                  )}

                  {destination === 'download' && (
                    <View className="flex-row items-start rounded-xl bg-info-50 border border-info-100 p-4 mb-4">
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color="#2563eb"
                      />
                      <AppText
                        variant="caption"
                        color="info-600"
                        className="flex-1 ml-2"
                      >
                        O arquivo será compartilhado via sistema do dispositivo
                        para que você possa escolher onde armazená-lo.
                      </AppText>
                    </View>
                  )}

                  <AppText variant="label" bold className="mb-2">
                    Formato do arquivo
                  </AppText>
                  <View className="flex-row gap-3 mb-6">
                    {FORMAT_OPTIONS.map(opt => (
                      <FormatChip
                        key={opt.id}
                        option={opt}
                        selected={outputFormat === opt.id}
                        onPress={() => setOutputFormat(opt.id)}
                      />
                    ))}
                  </View>

                  <AppButton
                    title={
                      destination === 'upload'
                        ? 'Enviar documento'
                        : 'Exportar documento'
                    }
                    fullWidth
                    isLoading={isLoading}
                    loadingText={
                      destination === 'upload' ? 'Enviando…' : 'Preparando…'
                    }
                    onPress={handleConfirm}
                    leftIcon={
                      destination === 'upload' ? UploadIcon : ExportIcon
                    }
                  />
                </ScrollView>
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      <FolderPickerModal
        visible={folderPickerVisible}
        provider={selectedProvider}
        initialPath={folderPath}
        onConfirm={path => {
          setFolderPath(path);
          setFolderPickerVisible(false);
        }}
        onClose={() => setFolderPickerVisible(false)}
      />
    </>
  );
};
