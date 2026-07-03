import { useMemo } from 'react';
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
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';

import { UserService } from '../../services/user.service';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LegalDocument'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

const DOCUMENT_META: Record<
  Props['route']['params']['type'],
  { titleKey: string; fetcher: () => Promise<any> }
> = {
  terms: {
    titleKey: 'LegalDocument.terms',
    fetcher: () => UserService.getPlatformTerms(),
  },
  policy: {
    titleKey: 'LegalDocument.policy',
    fetcher: () => UserService.getPlatformPrivacy(),
  },
  return: {
    titleKey: 'LegalDocument.return',
    fetcher: () => UserService.getPlatformReturnPolicy(),
  },
};

function extractContent(payload: any): string {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  return payload.content ?? payload.text ?? payload.body ?? '';
}

export function LegalDocumentScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { type } = route.params;
  const meta = DOCUMENT_META[type];

  const { data, isLoading, error } = useQuery({
    queryKey: ['legal-document', type],
    queryFn: meta.fetcher,
  });

  const content = useMemo(() => extractContent(data), [data]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <Text style={styles.title}>{t(meta.titleKey)}</Text>
      </View>

      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : error || !content ? (
          <Text style={styles.description}>
            {t('LegalDocument.loadError')}
          </Text>
        ) : (
          <Text style={styles.description}>{content}</Text>
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
  title: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: colors.text },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  description: { fontSize: 14, lineHeight: 22, color: colors.text },
  centerState: { minHeight: 160, alignItems: 'center', justifyContent: 'center' },
});
