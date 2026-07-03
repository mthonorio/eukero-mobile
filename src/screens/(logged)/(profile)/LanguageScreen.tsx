import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { Check, ChevronLeft } from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { changeLanguage } from '../../../i18n';
import {
  DEFAULT_LANGUAGE,
  getLanguagePreference,
  saveLanguagePreference,
  type LanguageCode,
} from '../../../storage/language.storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Language'>;

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

const LANGUAGE_CODES: LanguageCode[] = ['pt-BR', 'en-US', 'es'];

export function LanguageScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLanguagePreference()
      .then(setSelected)
      .finally(() => setIsLoading(false));
  }, []);

  async function handleSelect(code: LanguageCode) {
    setSelected(code);
    await saveLanguagePreference(code);
    await changeLanguage(code);
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
          <Text style={styles.heroEyebrow}>{t('Language.sectionLabel')}</Text>
          <Text style={styles.title}>{t('Language.title')}</Text>
        </View>
      </View>

      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          LANGUAGE_CODES.map(code => {
            const isSelected = code === selected;
            return (
              <Pressable
                key={code}
                style={[styles.languageRow, isSelected && styles.languageRowSelected]}
                onPress={() => handleSelect(code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageLabel}>
                    {t(`Language.options.${code}.label`)}
                  </Text>
                  <Text style={styles.languageNative}>
                    {t(`Language.options.${code}.nativeName`)}
                  </Text>
                </View>
                {isSelected ? (
                  <View style={styles.checkBadge}>
                    <Check color='#FFFFFF' size={14} />
                  </View>
                ) : null}
              </Pressable>
            );
          })
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
    padding: 10,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  centerState: { minHeight: 120, alignItems: 'center', justifyContent: 'center' },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
  },
  languageRowSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  languageInfo: { gap: 2 },
  languageLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  languageNative: { fontSize: 12, color: colors.muted },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
