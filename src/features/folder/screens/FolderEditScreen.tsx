import { useState } from 'react';

import { Pressable, View } from 'react-native';

import { ArrowLeft } from 'lucide-react-native';

import { AppButton } from '@/components/base/AppButton';
import { AppContainer } from '@/components/base/AppContainer';
import { AppInput } from '@/components/base/AppInput';
import { AppSpacer } from '@/components/base/AppSpacer';
import { AppText } from '@/components/base/AppText';
import { useAppNavigation, useAppToast } from '@/hooks';
import type { FolderStackParamList } from '@/navigation';
import { colors } from '@/theme';

import { useRenameFolder } from '../hooks/useRenameFolder';

import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<FolderStackParamList, 'FolderEdit'>;

const FolderEditScreen = ({ route }: Props) => {
  const { itemId, currentName, storageProvider } = route.params;
  const navigation = useAppNavigation();
  const { success, error: showError } = useAppToast();
  const [name, setName] = useState(currentName);
  const rename = useRenameFolder();

  const handleSave = async () => {
    if (!name.trim() || name.trim() === currentName) return;
    try {
      await rename.mutateAsync({
        storageProvider,
        itemId,
        newName: name.trim(),
      });
      success('Pasta renomeada com sucesso!');
      navigation.goBack();
    } catch {
      showError('Não foi possível renomear a pasta.');
    }
  };

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <AppContainer
      flex
      backgroundColor="background-light"
      paddingHorizontal="none"
      paddingVertical="none"
    >
      {/* Header */}
      <AppContainer
        backgroundColor="background-card"
        variant="safeAreaView"
        paddingHorizontal="2xl"
        className="w-full border-b border-typography-100 pb-4"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Pressable
          onPress={handleBack}
          disabled={rename.isPending}
          className="w-9 h-9 rounded-full bg-background-section items-center justify-center"
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
        >
          <ArrowLeft size={18} color={colors.typography[700]} />
        </Pressable>

        <AppText variant="h5" color="default">
          Renomear pasta
        </AppText>

        <View className="w-9 h-9" />
      </AppContainer>

      {/* Content */}
      <AppContainer
        flex
        paddingHorizontal="2xl"
        paddingVertical="none"
        alignItems="stretch"
        className="pt-2xl w-full"
      >
        <AppInput label="Nome da pasta *" value={name} onChangeText={setName} />
        <AppSpacer size="xl" />
        <AppButton
          title="Salvar"
          fullWidth
          onPress={handleSave}
          isLoading={rename.isPending}
          isDisabled={
            rename.isPending || !name.trim() || name.trim() === currentName
          }
          className="rounded-2xl"
        />
      </AppContainer>
    </AppContainer>
  );
};

export default FolderEditScreen;
