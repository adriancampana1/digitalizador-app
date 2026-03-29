import { Pressable, View } from 'react-native';

import { AlertTriangle, ChevronRight } from 'lucide-react-native';

import { colors } from '@/theme';

import { AppText } from './AppText';

type Props = {
  onPress: () => void;
};

export const EnvironmentSetupBanner = ({ onPress }: Props) => (
  <Pressable
    onPress={onPress}
    className="mx-2xl mb-sm flex-row items-center rounded-2xl border border-warning-200 bg-warning-50 px-4 py-3 active:opacity-80"
    accessibilityRole="button"
    accessibilityLabel="Configurar ambiente"
  >
    <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-warning-100">
      <AlertTriangle size={18} color={colors.warning[600]} />
    </View>

    <View className="flex-1">
      <AppText variant="bodySmall" color="warning" className="font-semibold">
        Ambiente não configurado
      </AppText>
      <AppText variant="caption" color="muted">
        Toque para configurar e liberar todas as funções
      </AppText>
    </View>

    <ChevronRight size={16} color={colors.warning[500]} />
  </Pressable>
);
