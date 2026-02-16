import React from 'react';

import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/theme/tokens/colors';
import { radius } from '@/theme/tokens/radius';
import { spacing } from '@/theme/tokens/spacing';
import { fontFamily, fontSize } from '@/theme/tokens/typography';

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

type TabConfig = {
  routeName: string;
  label: string;
  iconFocused: keyof typeof Ionicons.glyphMap;
  iconDefault: keyof typeof Ionicons.glyphMap;
  isCenterAction?: boolean;
};

const TAB_CONFIG: TabConfig[] = [
  {
    routeName: 'Home',
    label: 'Início',
    iconFocused: 'home',
    iconDefault: 'home-outline',
  },
  {
    routeName: 'Folders',
    label: 'Pastas',
    iconFocused: 'folder',
    iconDefault: 'folder-outline',
  },
  {
    routeName: 'Scan',
    label: 'Digitalizar',
    iconFocused: 'scan',
    iconDefault: 'scan-outline',
    isCenterAction: true,
  },
  {
    routeName: 'Search',
    label: 'Buscar',
    iconFocused: 'search',
    iconDefault: 'search-outline',
  },
  {
    routeName: 'Profile',
    label: 'Perfil',
    iconFocused: 'person',
    iconDefault: 'person-outline',
  },
];

const TAB_BAR_HEIGHT = 68;
const CENTER_BUTTON_SIZE = 56;
const CENTER_BUTTON_ELEVATION = 24;
const ICON_SIZE = 22;
const CENTER_ICON_SIZE = 26;

const HORIZONTAL_MARGIN = spacing.lg; // 16
const BOTTOM_MARGIN = spacing.md; // 12
const TAB_BAR_RADIUS = radius['2xl']; // 32
const CENTER_BUTTON_RADIUS = radius.lg; // 16

type TabButtonProps = {
  config: TabConfig;
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

const TabButton: React.FC<TabButtonProps> = ({
  config,
  isFocused,
  onPress,
  onLongPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // ── Botão central (Scan / Digitalizar) ──
  if (config.isCenterAction) {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="button"
        accessibilityLabel={config.label}
        accessibilityState={{ selected: isFocused }}
        accessibilityHint="Iniciar digitalização de documento"
        style={styles.centerButtonWrapper}
      >
        <Animated.View
          style={[
            styles.centerButton,
            isFocused && styles.centerButtonActive,
            animatedStyle,
          ]}
        >
          <Ionicons
            name={isFocused ? config.iconFocused : config.iconDefault}
            size={CENTER_ICON_SIZE}
            color={colors.white}
          />
        </Animated.View>
      </Pressable>
    );
  }

  // ── Botões regulares ──
  const iconName = isFocused ? config.iconFocused : config.iconDefault;
  const iconColor = isFocused ? colors.primary[500] : colors.typography[400];
  const labelColor = isFocused ? colors.primary[500] : colors.typography[400];

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityLabel={config.label}
      accessibilityState={{ selected: isFocused }}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.tabButtonInner, animatedStyle]}>
        <Ionicons name={iconName} size={ICON_SIZE} color={iconColor} />
        <Animated.Text
          style={[
            styles.tabLabel,
            { color: labelColor },
            isFocused && styles.tabLabelActive,
          ]}
          numberOfLines={1}
        >
          {config.label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors: _descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  /**
   * O bottom padding garante que em dispositivos com barra
   * de gestos (iPhone X+, Android 10+ com gestos) a tab bar
   * não fique grudada na borda inferior.
   */
  const bottomPadding = Math.max(insets.bottom, BOTTOM_MARGIN);

  return (
    <View style={[styles.outerContainer, { paddingBottom: bottomPadding }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[index];
          if (!config) return null;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TabButton
              key={route.key}
              config={config}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container externo – posiciona a bar flutuante na parte inferior
  outerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_MARGIN,
  },

  // Container da tab bar – fundo branco, bordas arredondadas, sombra
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: TAB_BAR_HEIGHT,
    backgroundColor: colors.white,
    borderRadius: TAB_BAR_RADIUS,

    // Sombra suave para profundidade (iOS)
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,

    // Elevação Android
    elevation: 10,

    paddingHorizontal: spacing.sm,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
    minWidth: 48,
  },

  tabButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },

  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize['2xs'],
    letterSpacing: 0.2,
  },

  tabLabelActive: {
    fontFamily: fontFamily.semibold,
  },

  // ── Botão central ──
  centerButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
    paddingHorizontal: spacing.sm,
  },

  centerButton: {
    width: CENTER_BUTTON_SIZE,
    height: CENTER_BUTTON_SIZE,
    borderRadius: CENTER_BUTTON_RADIUS,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',

    // Eleva o botão acima da barra
    marginTop: -CENTER_BUTTON_ELEVATION,

    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,

    // Borda branca sutil para criar separação visual
    ...Platform.select({
      ios: {
        borderWidth: 3,
        borderColor: colors.white,
      },
      android: {
        borderWidth: 3,
        borderColor: colors.white,
      },
    }),
  },

  centerButtonActive: {
    backgroundColor: colors.primary[600],
  },
});

export default CustomTabBar;
