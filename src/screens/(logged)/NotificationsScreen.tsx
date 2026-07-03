import { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Bell, BellOff, CheckCheck } from 'lucide-react-native';

import { NotificationService } from '../../services/notification.service';
import { RootStackParamList, RootTabParamList } from '../../navigation/types';
import type { NotificationItem } from '../../types/notification.type';

type Props = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Notifications'>,
  NativeStackScreenProps<RootStackParamList>
>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
};

export function NotificationsScreen({}: Props) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => NotificationService.fetchNotifications(),
  });

  const notifications = useMemo(() => data?.notifications ?? [], [data]);

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData<typeof data>(['notifications'], current => {
        if (!current) return current;
        return {
          ...current,
          notifications: current.notifications.map(item =>
            item.id === id ? { ...item, isRead: true } : item,
          ),
          unreadCount: Math.max(0, current.unreadCount - 1),
        };
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.setQueryData<typeof data>(['notifications'], current => {
        if (!current) return current;
        return {
          ...current,
          notifications: current.notifications.map(item => ({
            ...item,
            isRead: true,
          })),
          unreadCount: 0,
        };
      });
    },
  });

  const handlePressItem = (item: NotificationItem) => {
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }
  };

  const header = (
    <View style={styles.headerCard}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.heroEyebrow}>{t('Notifications.eyebrow')}</Text>
          <Text style={styles.title}>{t('Notifications.title')}</Text>
        </View>

        {(data?.unreadCount ?? 0) > 0 ? (
          <Pressable
            style={styles.markAllButton}
            onPress={() => markAllAsReadMutation.mutate()}
          >
            <CheckCheck color={colors.primary} size={16} />
            <Text style={styles.markAllButtonText}>
              {t('Notifications.markAll')}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      data={notifications}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.content}
      ListHeaderComponent={header}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          style={[styles.itemCard, !item.isRead && styles.itemCardUnread]}
          onPress={() => handlePressItem(item)}
        >
          {item.userImage?.src ? (
            <Image
              source={{ uri: item.userImage.src }}
              style={styles.userImage}
            />
          ) : (
            <View style={styles.userImagePlaceholder}>
              <Bell color={colors.muted} size={18} />
            </View>
          )}

          <View style={styles.itemInfo}>
            <Text style={styles.itemDescription} numberOfLines={3}>
              {item.description}
            </Text>
            <Text style={styles.itemTime}>{item.timeAgo}</Text>
          </View>

          {item.contentImage?.src ? (
            <Image
              source={{ uri: item.contentImage.src }}
              style={styles.contentImage}
            />
          ) : null}

          {!item.isRead ? <View style={styles.unreadDot} /> : null}
        </Pressable>
      )}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <View style={styles.centerState}>
            <BellOff color={colors.muted} size={32} />
            <Text style={styles.emptyTitle}>
              {error
                ? t('Notifications.errorLoading')
                : t('Notifications.empty')}
            </Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 12 },
  headerCard: {
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 4,
    maxWidth: 220,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  markAllButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemCardUnread: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  userImage: { width: 44, height: 44, borderRadius: 22 },
  userImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: { flex: 1, gap: 4 },
  itemDescription: { fontSize: 13, lineHeight: 18, color: colors.text },
  itemTime: { fontSize: 12, color: colors.muted },
  contentImage: { width: 44, height: 44, borderRadius: 10 },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  centerState: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
