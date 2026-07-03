import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Layers } from 'lucide-react-native';

import { Avatar } from '../../../components/atoms/Avatar';
import { SupplierService } from '../../../services/supplier.service';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Pieces'>;

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

export function PiecesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['suppliers-me'],
    queryFn: () => SupplierService.getSupplierMe(),
  });

  const suppliers = useMemo(() => data ?? [], [data]);

  const selectedSupplier = useMemo(
    () => suppliers.find(item => item.id === selectedId) ?? suppliers[0],
    [suppliers, selectedId],
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View>
          <Text style={styles.heroEyebrow}>{t('Pieces.eyebrow')}</Text>
          <Text style={styles.title}>{t('Pieces.title')}</Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : error || suppliers.length === 0 ? (
        <View style={styles.centerState}>
          <Layers color={colors.muted} size={32} />
          <Text style={styles.emptyTitle}>
            {error
              ? t('Pieces.emptyError')
              : t('Pieces.emptyTitle')}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.grid}>
            {suppliers.map(supplier => {
              const isSelected = selectedSupplier?.id === supplier.id;

              return (
                <Pressable
                  key={supplier.id}
                  style={[styles.gridItem, isSelected && styles.gridItemActive]}
                  onPress={() => setSelectedId(supplier.id)}
                >
                  <Avatar uri={supplier.storeImageUrl} size={48} />
                  <Text style={styles.gridItemName} numberOfLines={1}>
                    {supplier.storeName}
                  </Text>
                  <Text style={styles.gridItemUsername} numberOfLines={1}>
                    @{supplier.storeUsername}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {selectedSupplier ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                {selectedSupplier.storeName}
              </Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t('Pieces.detail.productsAvailable')}
                </Text>
                <Text style={styles.detailValue}>
                  {selectedSupplier.overview?.productsCount ??
                    selectedSupplier.products ??
                    0}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t('Pieces.detail.supplierTransfer')}
                </Text>
                <Text style={styles.detailValue}>
                  {selectedSupplier.percentageValue ?? 0}%
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {t('Pieces.detail.status')}
                </Text>
                <Text style={styles.detailValue}>
                  {selectedSupplier.status}
                </Text>
              </View>
            </View>
          ) : null}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 16 },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: colors.text },
  centerState: {
    minHeight: 220,
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    flexBasis: '31%',
    flexGrow: 1,
    alignItems: 'center',
    gap: 4,
    padding: 12,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridItemActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  gridItemName: { fontSize: 12, fontWeight: '700', color: colors.text },
  gridItemUsername: { fontSize: 11, color: colors.muted },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  detailLabel: { fontSize: 13, color: colors.muted },
  detailValue: { fontSize: 13, fontWeight: '700', color: colors.text },
});
