import { useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft, Star } from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../stores/auth.store';
import { Plan } from '../../../types/register.type';

type Props = NativeStackScreenProps<RootStackParamList, 'Plans'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  accent: '#F97316',
};

export function PlansScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const user = useAuthStore(state => state.user);
  const currentPlan = (user?.plan as Plan | undefined) ?? Plan.STANDARD;

  const PLAN_DETAILS = useMemo<
    { key: Plan; label: string; price: string; features: string[] }[]
  >(
    () => [
      {
        key: Plan.STANDARD,
        label: t('Plans.plans.standard.label'),
        price: t('Plans.plans.standard.price'),
        features: t('Plans.plans.standard.features', {
          returnObjects: true,
        }) as string[],
      },
      {
        key: Plan.PRO,
        label: t('Plans.plans.pro.label'),
        price: t('Plans.plans.pro.price'),
        features: t('Plans.plans.pro.features', {
          returnObjects: true,
        }) as string[],
      },
      {
        key: Plan.PREMIUM,
        label: t('Plans.plans.premium.label'),
        price: t('Plans.plans.premium.price'),
        features: t('Plans.plans.premium.features', {
          returnObjects: true,
        }) as string[],
      },
    ],
    [t],
  );

  function handleSelectPlan(plan: Plan) {
    if (plan === currentPlan) return;

    Alert.alert(
      t('Plans.comingSoon.title'),
      t('Plans.comingSoon.message'),
    );
  }

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
          <Text style={styles.heroEyebrow}>{t('Plans.heroEyebrow')}</Text>
          <Text style={styles.title}>{t('Plans.title')}</Text>
        </View>
      </View>

      {PLAN_DETAILS.map(plan => {
        const isCurrent = plan.key === currentPlan;

        return (
          <View
            key={plan.key}
            style={[styles.planCard, isCurrent && styles.planCardActive]}
          >
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>{plan.label}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
              </View>

              {isCurrent ? (
                <View style={styles.currentBadge}>
                  <Star color={colors.primary} size={14} fill={colors.primary} />
                  <Text style={styles.currentBadgeText}>{t('Plans.current')}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.featuresList}>
              {plan.features.map(feature => (
                <View key={feature} style={styles.featureRow}>
                  <Check color={colors.primary} size={16} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <Pressable
              style={[
                styles.selectButton,
                isCurrent && styles.selectButtonDisabled,
              ]}
              onPress={() => handleSelectPlan(plan.key)}
              disabled={isCurrent}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  isCurrent && styles.selectButtonTextDisabled,
                ]}
              >
                {isCurrent
                  ? t('Plans.currentPlanButton')
                  : t('Plans.selectPlanButton')}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 48, gap: 14 },
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
  title: { fontSize: 16, lineHeight: 22, fontWeight: '800', color: colors.text, maxWidth: 240 },
  planCard: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  planCardActive: { borderColor: colors.primary },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  planName: { fontSize: 18, fontWeight: '800', color: colors.text },
  planPrice: { fontSize: 13, color: colors.muted, marginTop: 2 },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  currentBadgeText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  featuresList: { gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: colors.text },
  selectButton: {
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonDisabled: { backgroundColor: colors.surfaceSoft },
  selectButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  selectButtonTextDisabled: { color: colors.muted },
});
