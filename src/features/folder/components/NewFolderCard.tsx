import { Pressable, View } from 'react-native';

import { AppText } from '@/components/base/AppText';

type NewFolderCardProps = {
  onPress?: () => void;
};

export const NewFolderCard = ({ onPress }: NewFolderCardProps) => (
  <Pressable
    onPress={onPress}
    className="rounded-xl border-2 border-dashed border-typography-200 p-4 items-center justify-center gap-xs min-h-[100px]"
    style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
    accessibilityLabel="Criar nova pasta"
    accessibilityRole="button"
  >
    <View className="w-8 h-8 rounded-full bg-background-section items-center justify-center">
      <AppText variant="h5" color="muted">
        +
      </AppText>
    </View>
    <AppText variant="caption" color="muted" align="center">
      Nova pasta
    </AppText>
  </Pressable>
);
