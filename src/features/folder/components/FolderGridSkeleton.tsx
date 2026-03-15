import { View } from 'react-native';

import { AppContainer } from '@/components/base/AppContainer';

import { FolderCardSkeleton } from './FolderCardSkeleton';

export const FolderGridSkeleton = () => (
  <AppContainer
    direction="row"
    wrap
    spacing="sm"
    paddingHorizontal="2xl"
    paddingVertical="none"
    className="pt-2xl"
  >
    {Array.from({ length: 4 }).map((_, i) => (
      <View key={i} className="flex-1 min-w-[45%]">
        <FolderCardSkeleton />
      </View>
    ))}
  </AppContainer>
);
