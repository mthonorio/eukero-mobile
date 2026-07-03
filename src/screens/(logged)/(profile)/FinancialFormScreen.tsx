import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import type { MovementStatus, MovementType } from '../../../types/financial.type';

type Props = NativeStackScreenProps<RootStackParamList, 'FinancialForm'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
};

function maskCurrencyInput(value: string) {
  const digitsOnly = value.replace(/\D/g, '');
  const numberValue = Number(digitsOnly) / 100;
  return numberValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function FinancialFormScreen({ navigation, route }: Props) {
  const isEditing = Boolean(route.params?.movementId);

  const [type, setType] = useState<MovementType>('CR');
  const [status, setStatus] = useState<MovementStatus>('A');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');

  function handleSubmit() {
    if (!amount || Number(amount.replace(/\./g, '').replace(',', '.')) <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Atenção', 'Informe uma descrição.');
      return;
    }

    // TODO: integrar endpoint real de lançamento financeiro quando existir no backend.
    Alert.alert(
      'Sucesso',
      isEditing ? 'Lançamento atualizado.' : 'Lançamento criado.',
    );
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.headerCard}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ChevronLeft color={colors.text} size={22} />
          </Pressable>

          <View>
            <Text style={styles.title}>
              {isEditing ? 'Editar lançamento' : 'Novo lançamento'}
            </Text>
            <Text style={styles.description}>
              Registre uma movimentação financeira manual.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.optionsRow}>
            {TYPE_OPTIONS.map(option => (
              <Pressable
                key={option.key}
                style={[
                  styles.optionButton,
                  type === option.key && styles.optionButtonActive,
                ]}
                onPress={() => setType(option.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    type === option.key && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.label, styles.spacedLabel]}>Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsRow}
          >
            {STATUS_OPTIONS.map(option => (
              <Pressable
                key={option.key}
                style={[
                  styles.optionButton,
                  status === option.key && styles.optionButtonActive,
                ]}
                onPress={() => setStatus(option.key)}
              >
                <Text
                  style={[
                    styles.optionText,
                    status === option.key && styles.optionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.label, styles.spacedLabel]}>Valor</Text>
          <View style={styles.inputBox}>
            <Text style={styles.currencyPrefix}>R$</Text>
            <TextInput
              value={amount}
              onChangeText={text => setAmount(maskCurrencyInput(text))}
              placeholder='0,00'
              placeholderTextColor={colors.muted}
              keyboardType='numeric'
              style={styles.currencyInput}
            />
          </View>

          <Text style={[styles.label, styles.spacedLabel]}>Descrição</Text>
          <TextInput
            value={description}
            onChangeText={text => setDescription(text.slice(0, 200))}
            placeholder='Descreva o lançamento'
            placeholderTextColor={colors.muted}
            style={styles.textInput}
            multiline
          />

          <Text style={[styles.label, styles.spacedLabel]}>
            Referência (opcional)
          </Text>
          <TextInput
            value={reference}
            onChangeText={setReference}
            placeholder='Nº de referência'
            placeholderTextColor={colors.muted}
            style={styles.textInput}
          />

          <Pressable style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>
              {isEditing ? 'Salvar alterações' : 'Criar lançamento'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  title: { fontSize: 20, lineHeight: 26, fontWeight: '800', color: colors.text },
  description: { fontSize: 13, color: colors.muted, marginTop: 2, maxWidth: 250 },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  label: { fontSize: 13, fontWeight: '700', color: colors.text },
  spacedLabel: { marginTop: 10 },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionButton: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionText: { fontSize: 12, fontWeight: '700', color: colors.muted },
  optionTextActive: { color: '#FFFFFF' },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyPrefix: { fontSize: 14, fontWeight: '700', color: colors.muted },
  currencyInput: { flex: 1, fontSize: 16, color: colors.text },
  textInput: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.text,
  },
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
