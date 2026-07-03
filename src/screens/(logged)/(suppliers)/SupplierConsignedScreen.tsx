import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, ChevronLeft, Minus, Plus, Search } from 'lucide-react-native';

import { Avatar } from '../../../components/atoms/Avatar';
import { SupplierService } from '../../../services/supplier.service';
import { RootStackParamList } from '../../../navigation/types';
import type { SupplierMeResponse } from '../../../types/supplier.type';

type Props = NativeStackScreenProps<RootStackParamList, 'SupplierConsigned'>;

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

export function SupplierConsignedScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const STEPS = [
    t('SupplierConsigned.steps.identification'),
    t('SupplierConsigned.steps.commission'),
    t('SupplierConsigned.steps.confirmation'),
  ];
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SupplierMeResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<SupplierMeResponse | null>(null);
  const [commission, setCommission] = useState(50);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const items = await SupplierService.getSearchSuppliers({
          search: trimmed,
        });
        setResults(items);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const canAdvance =
    (step === 0 && Boolean(selected)) ||
    (step === 1 && commission > 0 && commission < 100) ||
    step === 2;

  async function handleSubmit() {
    if (!selected) return;

    setIsSaving(true);
    try {
      await SupplierService.postSupplier({
        userId: selected.userId,
        paymentType: 'FIXED_PERCENTAGE',
        percentageValue: commission,
      });

      Alert.alert(
        t('SupplierConsigned.alerts.successTitle'),
        t('SupplierConsigned.alerts.successMessage'),
      );
      navigation.goBack();
    } catch {
      Alert.alert(
        t('SupplierConsigned.alerts.errorTitle'),
        t('SupplierConsigned.alerts.errorMessage'),
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => (step === 0 ? navigation.goBack() : setStep(step - 1))}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {t('SupplierConsigned.badgeInProgress')}
            </Text>
          </View>
          <Text style={styles.title}>{t('SupplierConsigned.title')}</Text>
        </View>
      </View>

      <View style={styles.stepsRow}>
        {STEPS.map((label, index) => (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                index <= step && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepCircleText,
                  index <= step && styles.stepCircleTextActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text style={styles.stepLabel}>{label}</Text>
          </View>
        ))}
      </View>

      {step === 0 ? (
        <View style={styles.card}>
          <View style={styles.searchBox}>
            <Search color={colors.muted} size={16} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('SupplierConsigned.searchPlaceholder')}
              placeholderTextColor={colors.muted}
              style={styles.searchInput}
              autoCapitalize='none'
            />
            {isSearching ? (
              <ActivityIndicator color={colors.primary} size='small' />
            ) : null}
          </View>

          {results.map(item => {
            const isSelected = selected?.userId === item.userId;
            return (
              <Pressable
                key={item.userId}
                style={[styles.resultRow, isSelected && styles.resultRowSelected]}
                onPress={() => setSelected(item)}
              >
                <Avatar uri={item.userPhoto} size={40} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.userName}</Text>
                  <Text style={styles.resultUsername}>
                    @{item.userUsername}
                  </Text>
                  <Text style={styles.resultUsername}>{item.userEmail}</Text>
                </View>
                {isSelected ? (
                  <Check color={colors.primary} size={20} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {step === 1 && selected ? (
        <View style={styles.card}>
          <View style={styles.selectedUserRow}>
            <Avatar uri={selected.userPhoto} size={36} />
            <Text style={styles.resultName}>{selected.userName}</Text>
          </View>

          <Text style={[styles.label, styles.spacedLabel]}>
            {t('SupplierConsigned.percentageLabel')}
          </Text>

          <View style={styles.percentageRow}>
            <Pressable
              style={styles.stepperButton}
              onPress={() => setCommission(prev => Math.max(10, prev - 5))}
            >
              <Minus color={colors.text} size={16} />
            </Pressable>

            <Text style={styles.percentageValue}>{commission}%</Text>

            <Pressable
              style={styles.stepperButton}
              onPress={() => setCommission(prev => Math.min(90, prev + 5))}
            >
              <Plus color={colors.text} size={16} />
            </Pressable>
          </View>

          <View style={styles.splitGrid}>
            <View style={styles.splitCard}>
              <Text style={styles.splitLabel}>
                {t('SupplierConsigned.splitSupplierReceives')}
              </Text>
              <Text style={styles.splitValue}>{commission}%</Text>
            </View>
            <View style={styles.splitCard}>
              <Text style={styles.splitLabel}>
                {t('SupplierConsigned.splitStoreRetains')}
              </Text>
              <Text style={styles.splitValue}>{100 - commission}%</Text>
            </View>
          </View>
        </View>
      ) : null}

      {step === 2 && selected ? (
        <View style={styles.card}>
          <Text style={styles.label}>{t('SupplierConsigned.summaryLabel')}</Text>

          <View style={styles.selectedUserRow}>
            <Avatar uri={selected.userPhoto} size={36} />
            <View>
              <Text style={styles.resultName}>{selected.userName}</Text>
              <Text style={styles.resultUsername}>
                @{selected.userUsername}
              </Text>
            </View>
          </View>

          <View style={styles.splitGrid}>
            <View style={styles.splitCard}>
              <Text style={styles.splitLabel}>
                {t('SupplierConsigned.splitSupplierReceives')}
              </Text>
              <Text style={styles.splitValue}>{commission}%</Text>
            </View>
            <View style={styles.splitCard}>
              <Text style={styles.splitLabel}>
                {t('SupplierConsigned.splitStoreRetains')}
              </Text>
              <Text style={styles.splitValue}>{100 - commission}%</Text>
            </View>
          </View>
        </View>
      ) : null}

      <Pressable
        style={[
          styles.primaryButton,
          (!canAdvance || isSaving) && styles.disabledButton,
        ]}
        disabled={!canAdvance || isSaving}
        onPress={() => {
          if (step < STEPS.length - 1) {
            setStep(step + 1);
          } else {
            handleSubmit();
          }
        }}
      >
        {isSaving ? (
          <ActivityIndicator color='#FFFFFF' />
        ) : (
          <Text style={styles.primaryButtonText}>
            {step < STEPS.length - 1
              ? t('SupplierConsigned.buttonContinue')
              : t('SupplierConsigned.buttonConfirm')}
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16, paddingBottom: 48 },
  headerCard: {
    flexDirection: 'row',
    padding: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    alignItems: 'center',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    marginBottom: 4,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  title: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: colors.text },
  stepsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', gap: 6, flex: 1 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  stepCircleText: { fontSize: 12, fontWeight: '800', color: colors.muted },
  stepCircleTextActive: { color: '#FFFFFF' },
  stepLabel: { fontSize: 10, color: colors.muted, fontWeight: '600', textAlign: 'center' },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  resultRowSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 14, fontWeight: '700', color: colors.text },
  resultUsername: { fontSize: 12, color: colors.muted },
  selectedUserRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text },
  spacedLabel: { marginTop: 8 },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  percentageValue: { fontSize: 24, fontWeight: '800', color: colors.text },
  splitGrid: { flexDirection: 'row', gap: 10 },
  splitCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    gap: 4,
  },
  splitLabel: { fontSize: 11, color: colors.muted, fontWeight: '700' },
  splitValue: { fontSize: 16, fontWeight: '800', color: colors.text },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.5 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
