import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

export const FolderCardSkeleton = () => (
  <View className="bg-background-card rounded-2xl border border-typography-100 p-4">
    <View className="w-9 h-9 rounded-xl overflow-hidden mb-3">
      <Skeleton />
    </View>

    <View className="h-3.5 w-[65%] rounded-md overflow-hidden mb-2">
      <Skeleton />
    </View>

    <View className="h-2.5 w-[40%] rounded-md overflow-hidden">
      <Skeleton />
    </View>
  </View>
);
