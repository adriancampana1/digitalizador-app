import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

export const FolderCardSkeleton = () => (
  <View className="bg-background-card rounded-xl p-4">
    <View className="flex-row justify-between items-start mb-3">
      <View className="w-10 h-10 rounded-full overflow-hidden">
        <Skeleton />
      </View>
      <View className="w-4 h-4 rounded overflow-hidden">
        <Skeleton />
      </View>
    </View>

    <View className="h-3.5 w-[65%] rounded-md overflow-hidden mb-2">
      <Skeleton />
    </View>

    <View className="h-2.5 w-[40%] rounded-md overflow-hidden">
      <Skeleton />
    </View>
  </View>
);
