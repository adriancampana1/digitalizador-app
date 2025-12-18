import { useNavigation } from '@react-navigation/native';

import type { RootStackParamList } from '@/navigation';

import type { NavigationProp } from '@react-navigation/native';

export const useAppNavigation = () =>
  useNavigation<NavigationProp<RootStackParamList>>();
