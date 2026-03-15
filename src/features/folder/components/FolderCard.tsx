import { Pressable, View } from 'react-native';

import { ChevronRight, Folder } from 'lucide-react-native';

import { AppText } from '@/components/base/AppText';
import { colors } from '@/theme';

export type FolderCardProps = {
  name: string;
  fileCount?: number;
  onPress?: () => void;
};

const FolderCard = ({ name, fileCount, onPress }: FolderCardProps) => {
  const fileCountLabel =
    fileCount === undefined
      ? null
      : fileCount === 1
        ? '1 arquivo'
        : `${fileCount} arquivos`;

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-card rounded-xl p-4 active:opacity-70"
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-background-light items-center justify-center">
          <Folder size={20} color={colors.primary[500]} />
        </View>
        <ChevronRight size={16} color={colors.typography[400]} />
      </View>

      <AppText variant="bodySmall" bold numberOfLines={2} color="default">
        {name}
      </AppText>

      {fileCountLabel && (
        <AppText variant="caption" color="muted" className="mt-0.5">
          {fileCountLabel}
        </AppText>
      )}
    </Pressable>
  );
};

export default FolderCard;
