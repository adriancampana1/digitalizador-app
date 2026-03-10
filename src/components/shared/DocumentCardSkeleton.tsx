import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

import { AppCard } from '../base/AppCard';

export const DocumentCardSkeleton = () => (
  <AppCard variant="elevated" className="w-full shadow-sm bg-background-card">
    <View className="flex-row items-center gap-3">
      {/* Thumbnail: w-14 = 56px, h-[68px] — espelha DocumentCard */}
      <View className="w-14 h-[68px] rounded-lg overflow-hidden">
        <Skeleton />
      </View>

      {/* Conteúdo — gap-1 espelha DocumentCard */}
      <View className="flex-1 gap-1">
        {/* Título */}
        <View className="h-3.5 w-[70%] rounded-md overflow-hidden">
          <Skeleton />
        </View>

        {/* Badge do provedor + tamanho do arquivo */}
        <View className="flex-row items-center gap-2 mt-0.5">
          <View className="h-[18px] w-[72px] rounded overflow-hidden">
            <Skeleton />
          </View>
          <View className="h-2.5 w-11 rounded-md overflow-hidden">
            <Skeleton />
          </View>
        </View>

        {/* Data */}
        <View className="h-2.5 w-1/2 rounded-md overflow-hidden">
          <Skeleton />
        </View>
      </View>

      {/* Botão de menu (more-vertical) */}
      <View className="self-start p-1">
        <View className="w-5 h-5 rounded overflow-hidden">
          <Skeleton />
        </View>
      </View>
    </View>
  </AppCard>
);
