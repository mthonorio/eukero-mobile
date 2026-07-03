import { useEffect, useState } from 'react';
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
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { ParameterService } from '../../../services/parameter.service';

type Props = NativeStackScreenProps<RootStackParamList, 'GlobalVariables'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

function toLabel(key: string): string {
  return key.replace(/_/g, ' ');
}

export function GlobalVariablesScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [parameters, setParameters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadParameters();
  }, []);

  async function loadParameters() {
    try {
      setIsLoading(true);
      const data = await ParameterService.fetchParameters();
      const normalized = Object.fromEntries(
        Object.entries(data ?? {}).map(([key, value]) => [key, String(value ?? '')]),
      );
      setParameters(normalized);
    } catch {
      Alert.alert(
        t('GlobalVariables.errors.load.title'),
        t('GlobalVariables.errors.load.message'),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleChange(key: string, value: string) {
    setParameters(prev => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      await ParameterService.putParameters(parameters);
      Alert.alert(
        t('GlobalVariables.success.title'),
        t('GlobalVariables.success.message'),
      );
    } catch {
      Alert.alert(
        t('GlobalVariables.errors.save.title'),
        t('GlobalVariables.errors.save.message'),
      );
    } finally {
      setIsSaving(false);
    }
  }

  const entries = Object.entries(parameters);

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
          <Text style={styles.heroEyebrow}>{t('GlobalVariables.heroEyebrow')}</Text>
          <Text style={styles.title}>{t('GlobalVariables.title')}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : entries.length === 0 ? (
          <Text style={styles.emptyText}>
            {t('GlobalVariables.empty')}
          </Text>
        ) : (
          <>
            {entries.map(([key, value]) => (
              <View key={key} style={styles.field}>
                <Text style={styles.label}>{toLabel(key)}</Text>
                <TextInput
                  value={value}
                  onChangeText={text => handleChange(key, text)}
                  style={styles.input}
                  placeholderTextColor='#8f8f8f'
                />
              </View>
            ))}

            <Pressable
              style={[styles.primaryButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color='#FFFFFF' />
              ) : (
                <Text style={styles.primaryButtonText}>{t('GlobalVariables.save')}</Text>
              )}
            </Pressable>
          </>
        )}
      </View>
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
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  centerState: { minHeight: 120, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 13, color: colors.muted, textAlign: 'center' },
  field: { gap: 6 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'capitalize',
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.text,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  primaryButton: {
    marginTop: 4,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.65 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
