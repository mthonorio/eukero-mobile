import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../stores/auth.store';
import { UserService } from '../../../services/user.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

const MAX_POLICY_LENGTH = 2000;

type ShippingPolicy = {
  policy?: string;
  allowReturn?: boolean;
};

export function TermsScreen({ navigation }: Props) {
  const isStoreUser = useAuthStore(state => state.user?.type === 'STORE');

  const [isLoading, setIsLoading] = useState(isStoreUser);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPolicy, setSavedPolicy] = useState('');
  const [savedAllowReturn, setSavedAllowReturn] = useState(false);
  const [draftPolicy, setDraftPolicy] = useState('');
  const [draftAllowReturn, setDraftAllowReturn] = useState(false);

  useEffect(() => {
    if (!isStoreUser) return;

    UserService.getStoreShippingPolicy()
      .then((data: ShippingPolicy | null) => {
        setSavedPolicy(data?.policy ?? '');
        setSavedAllowReturn(Boolean(data?.allowReturn));
        setDraftPolicy(data?.policy ?? '');
        setDraftAllowReturn(Boolean(data?.allowReturn));
      })
      .catch(() => {
        setSavedPolicy('');
        setSavedAllowReturn(false);
      })
      .finally(() => setIsLoading(false));
  }, [isStoreUser]);

  function handleToggleAllowReturn(value: boolean) {
    setDraftAllowReturn(value);
    if (!value) {
      setDraftPolicy('');
    }
  }

  function handleReset() {
    setDraftPolicy(savedPolicy);
    setDraftAllowReturn(savedAllowReturn);
  }

  async function handleSavePolicy() {
    if (draftAllowReturn && draftPolicy.trim().length === 0) {
      Alert.alert('Atenção', 'Descreva a política de troca e devolução.');
      return;
    }

    if (draftPolicy.length > MAX_POLICY_LENGTH) {
      Alert.alert('Atenção', 'O texto excede o limite de caracteres.');
      return;
    }

    try {
      setIsSaving(true);
      await UserService.updateStoreShippingPolicy({
        policy: draftPolicy,
        allowReturn: draftAllowReturn,
      });
      setSavedPolicy(draftPolicy);
      setSavedAllowReturn(draftAllowReturn);
      Alert.alert('Sucesso', 'Política atualizada com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a política.');
    } finally {
      setIsSaving(false);
    }
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
          <Text style={styles.heroEyebrow}>Configurações</Text>
          <Text style={styles.title}>Termos e políticas</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Documentos</Text>

        <Pressable
          style={styles.docRow}
          onPress={() => navigation.navigate('LegalDocument', { type: 'terms' })}
        >
          <FileText color={colors.muted} size={18} />
          <Text style={styles.docText}>Termos de uso</Text>
          <ChevronRight color={colors.muted} size={16} />
        </Pressable>

        <Pressable
          style={styles.docRow}
          onPress={() => navigation.navigate('LegalDocument', { type: 'policy' })}
        >
          <FileText color={colors.muted} size={18} />
          <Text style={styles.docText}>Política de privacidade</Text>
          <ChevronRight color={colors.muted} size={16} />
        </Pressable>

        <Pressable
          style={styles.docRow}
          onPress={() => navigation.navigate('LegalDocument', { type: 'return' })}
        >
          <FileText color={colors.muted} size={18} />
          <Text style={styles.docText}>Política de devolução</Text>
          <ChevronRight color={colors.muted} size={16} />
        </Pressable>
      </View>

      {isStoreUser ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Troca e devolução da loja</Text>

          {isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : (
            <>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Aceito trocas e devoluções</Text>
                <Switch
                  value={draftAllowReturn}
                  onValueChange={handleToggleAllowReturn}
                  trackColor={{ true: colors.primary }}
                />
              </View>

              <TextInput
                value={draftPolicy}
                onChangeText={setDraftPolicy}
                editable={draftAllowReturn}
                multiline
                maxLength={MAX_POLICY_LENGTH}
                placeholder='Descreva as condições de troca e devolução...'
                placeholderTextColor='#8f8f8f'
                style={[
                  styles.textarea,
                  !draftAllowReturn && styles.textareaDisabled,
                ]}
              />

              <Text
                style={[
                  styles.charCounter,
                  draftPolicy.length > 1800 && styles.charCounterWarning,
                ]}
              >
                {draftPolicy.length}/{MAX_POLICY_LENGTH}
              </Text>

              <View style={styles.formActions}>
                <Pressable style={styles.secondaryButton} onPress={handleReset}>
                  <Text style={styles.secondaryButtonText}>Restaurar</Text>
                </Pressable>

                <Pressable
                  style={[styles.primaryButton, isSaving && styles.disabledButton]}
                  onPress={handleSavePolicy}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color='#FFFFFF' />
                  ) : (
                    <Text style={styles.primaryButtonText}>Salvar</Text>
                  )}
                </Pressable>
              </View>
            </>
          )}
        </View>
      ) : null}
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
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
  },
  docText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  centerState: { minHeight: 100, alignItems: 'center', justifyContent: 'center' },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  switchLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  textarea: {
    minHeight: 120,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSoft,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    marginHorizontal: 8,
  },
  textareaDisabled: { opacity: 0.6 },
  charCounter: {
    fontSize: 11,
    color: colors.muted,
    textAlign: 'right',
    marginHorizontal: 8,
  },
  charCounterWarning: { color: '#B54708' },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginHorizontal: 8,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '700', color: colors.text },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.65 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
