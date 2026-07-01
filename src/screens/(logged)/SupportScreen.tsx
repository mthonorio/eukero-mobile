import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, ChevronRight, FileText, Mail, MessageCircle } from 'lucide-react-native';

import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Support'>;

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

export function SupportScreen({ navigation }: Props) {
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
          <Text style={styles.heroEyebrow}>Suporte</Text>
          <Text style={styles.title}>Como podemos ajudar?</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Pressable
          style={styles.contactRow}
          onPress={() => Linking.openURL('mailto:suporte@eukero.com')}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
            <Mail color={colors.primary} size={18} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>E-mail</Text>
            <Text style={styles.contactDescription}>suporte@eukero.com</Text>
          </View>
          <ChevronRight color={colors.muted} size={18} />
        </Pressable>

        <Pressable
          style={styles.contactRow}
          onPress={() =>
            Linking.openURL('https://wa.me/5500000000000')
          }
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
            <MessageCircle color={colors.primary} size={18} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>WhatsApp</Text>
            <Text style={styles.contactDescription}>
              Atendimento em horário comercial.
            </Text>
          </View>
          <ChevronRight color={colors.muted} size={18} />
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Documentos</Text>

        <Pressable
          style={styles.docRow}
          onPress={() =>
            navigation.navigate('LegalDocument', { type: 'terms' })
          }
        >
          <FileText color={colors.muted} size={18} />
          <Text style={styles.docText}>Termos de uso</Text>
          <ChevronRight color={colors.muted} size={16} />
        </Pressable>

        <Pressable
          style={styles.docRow}
          onPress={() =>
            navigation.navigate('LegalDocument', { type: 'policy' })
          }
        >
          <FileText color={colors.muted} size={18} />
          <Text style={styles.docText}>Política de privacidade</Text>
          <ChevronRight color={colors.muted} size={16} />
        </Pressable>

        <Pressable
          style={styles.docRow}
          onPress={() =>
            navigation.navigate('LegalDocument', { type: 'return' })
          }
        >
          <FileText color={colors.muted} size={18} />
          <Text style={styles.docText}>Política de devolução</Text>
          <ChevronRight color={colors.muted} size={16} />
        </Pressable>
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
    padding: 12,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.muted,
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  contactDescription: { fontSize: 12, color: colors.muted },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
  },
  docText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
});
