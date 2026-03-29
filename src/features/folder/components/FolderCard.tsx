import { useCallback, useRef, useState } from 'react';

import { Dimensions, Modal, Pressable, View } from 'react-native';

import { FolderOpen, MoreVertical, Pencil, Trash2 } from 'lucide-react-native';

import { AppText } from '@/components/base/AppText';
import { colors } from '@/theme';

export type FolderCardProps = {
  name: string;
  fileCount?: number;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

type MenuAction = {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

const FolderCard = ({
  name,
  fileCount,
  onPress,
  onEdit,
  onDelete,
}: FolderCardProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef<View>(null);

  const fileCountLabel =
    fileCount === undefined
      ? null
      : fileCount === 0
        ? 'Vazia'
        : fileCount === 1
          ? '1 arquivo'
          : `${fileCount} arquivos`;

  const hasMenu = !!(onEdit || onDelete);

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

  const handleAction = useCallback(
    (action?: () => void) => {
      closeMenu();
      action?.();
    },
    [closeMenu]
  );

  const menuActions: MenuAction[] = [
    ...(onEdit
      ? [
          {
            icon: <Pencil size={16} color={colors.typography[700]} />,
            label: 'Renomear pasta',
            onPress: () => handleAction(onEdit),
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            icon: <Trash2 size={16} color={colors.error[500]} />,
            label: 'Excluir pasta',
            onPress: () => handleAction(onDelete),
            destructive: true,
          },
        ]
      : []),
  ];

  return (
    <>
      <Pressable
        onPress={onPress}
        className="bg-background-card rounded-2xl border border-typography-100 overflow-hidden"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        accessibilityRole="button"
        accessibilityLabel={`Abrir pasta ${name}`}
      >
        <View className="p-4">
          <View className="flex-row items-start justify-between">
            <View className="w-9 h-9 rounded-xl bg-primary-50 items-center justify-center">
              <FolderOpen size={18} color={colors.primary[500]} />
            </View>

            {hasMenu && (
              <Pressable
                ref={menuButtonRef}
                onPress={openMenu}
                hitSlop={12}
                style={({ pressed }) => ({ opacity: pressed ? 0.4 : 1 })}
                className="-mr-1 -mt-1 w-7 h-7 items-center justify-center"
                accessibilityRole="button"
                accessibilityLabel="Opções da pasta"
              >
                <MoreVertical size={15} color={colors.typography[400]} />
              </Pressable>
            )}
          </View>

          <View className="mt-3">
            <AppText variant="bodySmall" bold numberOfLines={2} color="default">
              {name}
            </AppText>

            {fileCountLabel !== null && (
              <AppText variant="caption" color="muted" className="mt-0.5">
                {fileCountLabel}
              </AppText>
            )}
          </View>
        </View>
      </Pressable>

      {hasMenu && (
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={closeMenu}
          statusBarTranslucent
        >
          <Pressable className="flex-1 bg-black/10" onPress={closeMenu}>
            <View
              className="absolute bg-white rounded-xl py-1 min-w-[200px] shadow-xl"
              style={{ top: menuPosition.top, right: menuPosition.right }}
            >
              {menuActions.map((action, index) => (
                <Pressable
                  key={action.label}
                  onPress={action.onPress}
                  className={`flex-row items-center gap-3 px-4 py-[13px] active:bg-gray-50 ${
                    index < menuActions.length - 1
                      ? 'border-b border-typography-100'
                      : ''
                  }`}
                >
                  {action.icon}
                  <AppText
                    variant="bodySmall"
                    color={action.destructive ? 'error' : 'default'}
                  >
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

export default FolderCard;
