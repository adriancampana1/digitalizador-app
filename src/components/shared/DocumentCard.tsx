import { useCallback, useRef, useState } from 'react';

import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text as RNText,
  View,
} from 'react-native';

import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { AppText } from '@/components/base/AppText';
import type { DocumentResponse } from '@/features/document/types';
import {
  formatFileSize,
  getFileExtension,
  getFileTypeIconName,
  getProviderConfig,
} from '@/features/document/utils/document';
import { colors } from '@/theme';

import { AppCard } from '../base/AppCard';

export type DocumentCardProps = {
  document: DocumentResponse;
  onViewOriginal?: () => void;
  onDownload?: () => void;
  onPress?: () => void;
  onThumbnailRefresh?: (id: string) => void;
  isDownloading?: boolean;
};

const THUMBNAIL_WIDTH = 56;
const THUMBNAIL_HEIGHT = 68;

type MenuAction = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const DocumentThumbnail = ({
  document: { id, thumbnailUrl, title, fileMetadata },
  onThumbnailRefresh,
}: Pick<DocumentCardProps, 'document'> & {
  onThumbnailRefresh?: (id: string) => void;
}) => {
  const [imageError, setImageError] = useState(false);

  const mimeType = fileMetadata?.mimeType ?? 'application/octet-stream';
  const iconName = getFileTypeIconName(
    mimeType
  ) as keyof typeof Feather.glyphMap;
  const extension = getFileExtension(title);

  const handleImageError = useCallback(() => {
    setImageError(true);
    onThumbnailRefresh?.(id);
  }, [id, onThumbnailRefresh]);

  if (thumbnailUrl && !imageError) {
    return (
      <Image
        source={{ uri: thumbnailUrl }}
        style={styles.thumbnailImage}
        resizeMode="cover"
        accessibilityLabel={`Miniatura de ${title}`}
        onError={handleImageError}
      />
    );
  }

  return (
    <View style={styles.thumbnailPlaceholder}>
      <Feather name={iconName} size={24} color={colors.primary[400]} />
      {extension ? (
        <AppText variant="caption" color="primary-500" bold className="mt-1">
          {extension}
        </AppText>
      ) : null}
    </View>
  );
};

const ProviderBadge = ({ provider }: { provider: string }) => {
  const config = getProviderConfig(provider);

  return (
    <View style={[styles.badge, { backgroundColor: config.bgColor }]}>
      <RNText style={[styles.badgeText, { color: config.textColor }]}>
        {config.label.toUpperCase()}
      </RNText>
    </View>
  );
};

const DocumentCard = ({
  document,
  onViewOriginal,
  onDownload,
  onPress,
  onThumbnailRefresh,
  isDownloading,
}: DocumentCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef<View>(null);

  const openMenu = useCallback(() => {
    menuButtonRef.current?.measureInWindow((x, y, width, height) => {
      const screenWidth = Dimensions.get('window').width;
      setMenuPosition({
        top: y + height + 4,
        right: screenWidth - x - width,
      });
      setMenuVisible(true);
    });
  }, []);

  const closeMenu = useCallback(() => setMenuVisible(false), []);

  const handleMenuAction = useCallback(
    (action?: () => void) => {
      closeMenu();
      action?.();
    },
    [closeMenu]
  );

  const menuActions: MenuAction[] = [
    ...(onViewOriginal
      ? [
          {
            icon: 'external-link' as const,
            label: 'Ver original na nuvem',
            onPress: () => handleMenuAction(onViewOriginal),
          },
        ]
      : []),
    ...(onDownload
      ? [
          {
            icon: isDownloading ? ('loader' as const) : ('download' as const),
            label: isDownloading ? 'Baixando...' : 'Fazer download',
            onPress: () => !isDownloading && handleMenuAction(onDownload),
            disabled: isDownloading,
          },
        ]
      : []),
  ];

  const hasMenuActions = menuActions.length > 0;

  return (
    <>
      <AppCard
        variant="elevated"
        pressable={!!onPress}
        onPress={onPress}
        className="w-full shadow-sm bg-background-card"
      >
        <View className="flex-row items-center gap-3">
          <DocumentThumbnail
            document={document}
            onThumbnailRefresh={onThumbnailRefresh}
          />

          <View className="flex-1 gap-1">
            <AppText variant="bodySmall" bold numberOfLines={1} color="default">
              {document.title}
            </AppText>

            <View className="flex-row items-center gap-2">
              <ProviderBadge provider={document.storageProvider} />
              <AppText variant="caption" color="muted">
                ·
              </AppText>
              <AppText variant="caption" color="muted">
                {document.fileMetadata?.fileSize
                  ? formatFileSize(document.fileMetadata.fileSize)
                  : 'Tamanho desconhecido'}
              </AppText>
            </View>
            <AppText variant="caption" color="muted">
              {document.createdAt
                ? format(
                    parseISO(document.createdAt),
                    "dd 'de' MMM. 'de' yyyy",
                    { locale: ptBR }
                  )
                : 'Data desconhecida'}
            </AppText>
          </View>

          {hasMenuActions && (
            <Pressable
              ref={menuButtonRef}
              onPress={openMenu}
              hitSlop={8}
              className="self-start p-1"
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              accessibilityLabel="Opções do documento"
              accessibilityRole="button"
            >
              <Feather
                name="more-vertical"
                size={20}
                color={colors.typography[400]}
              />
            </Pressable>
          )}
        </View>
      </AppCard>

      {hasMenuActions && (
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={closeMenu}
          statusBarTranslucent
        >
          <Pressable style={styles.menuOverlay} onPress={closeMenu}>
            <View
              style={[
                styles.menuDropdown,
                { top: menuPosition.top, right: menuPosition.right },
              ]}
            >
              {menuActions.map(action => (
                <Pressable
                  key={action.label}
                  onPress={action.onPress}
                  disabled={action.disabled}
                  className="flex-row items-center gap-3 px-4 py-3"
                  style={({ pressed }) => ({
                    backgroundColor:
                      pressed && !action.disabled
                        ? colors.gray[50]
                        : 'transparent',
                    opacity: action.disabled ? 0.5 : 1,
                  })}
                >
                  <Feather
                    name={action.icon}
                    size={18}
                    color={colors.typography[700]}
                  />
                  <AppText variant="bodySmall" color="default">
                    {action.label}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  thumbnailImage: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    borderRadius: 8,
  },
  thumbnailPlaceholder: {
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    borderRadius: 8,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'LexendDeca_600SemiBold',
    letterSpacing: 0.5,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: `${colors.black}1A`,
  },
  menuDropdown: {
    position: 'absolute',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 4,
    minWidth: 220,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default DocumentCard;
