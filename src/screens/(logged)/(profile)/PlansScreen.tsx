import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
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

const PLAN_DETAILS: {
  key: Plan;
  label: string;
  price: string;
  features: string[];
}[] = [
  {
    key: Plan.STANDARD,
    label: 'Standard',
    price: 'Grátis',
    features: [
      'Até 20 produtos publicados',
      'Suporte via e-mail',
      'Relatórios básicos',
    ],
  },
  {
    key: Plan.PRO,
    label: 'Pro',
    price: 'R$ 39,90/mês',
    features: [
      'Produtos ilimitados',
      'Gestão financeira completa',
      'Suporte prioritário',
    ],
  },
  {
    key: Plan.PREMIUM,
    label: 'Premium',
    price: 'R$ 79,90/mês',
    features: [
      'Tudo do plano Pro',
      'Consignação de fornecedores',
      'Dashboard avançado',
    ],
  },
];

export function PlansScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const currentPlan = (user?.plan as Plan | undefined) ?? Plan.STANDARD;

  function handleSelectPlan(plan: Plan) {
    if (plan === currentPlan) return;

    Alert.alert(
      'Em breve',
      'A alteração de plano com pagamento estará disponível em breve.',
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
          <Text style={styles.heroEyebrow}>Planos</Text>
          <Text style={styles.title}>Escolha o plano ideal para você.</Text>
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
                  <Text style={styles.currentBadgeText}>Atual</Text>
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
                {isCurrent ? 'Plano atual' : 'Selecionar plano'}
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
