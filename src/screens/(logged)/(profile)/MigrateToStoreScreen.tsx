import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { ChevronLeft, Info, Store } from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../stores/auth.store';
import { RegisterService } from '../../../services/register.service';
import { AuthService } from '../../../services/auth.service';
import { RegisterField } from '../../../components/auth/register/RegisterField';
import { useCepLookup } from '../../../hooks/register/useCepLookup';
import {
  maskCep,
  maskCpfCnpj,
  normalizeState,
} from '../../../validators/register/register.helpers';
import {
  migrateToStoreSchema,
  type MigrateToStoreFormValues,
} from '../../../validators/settings/settings.schemas';

type Props = NativeStackScreenProps<RootStackParamList, 'MigrateToStore'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  orange: '#ef7000ff',
  orangeSoft: 'rgba(239, 112, 0, 0.10)',
};

export function MigrateToStoreScreen({ navigation }: Props) {
  const user = useAuthStore(state => state.user);
  const updateProfile = useAuthStore(state => state.updateProfile);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const { loading: isLoadingCep, lookup } = useCepLookup();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MigrateToStoreFormValues>({
    resolver: zodResolver(
      migrateToStoreSchema,
    ) as unknown as Resolver<MigrateToStoreFormValues>,
    defaultValues: {
      storeName: '',
      address: {
        cep: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
      },
      ownerName: '',
      pixKey: '',
      document: '',
    },
    mode: 'onBlur',
  });

  async function handleCepBlur(value: string) {
    const result = await lookup(value);
    if (!result) return;

    setValue('address.cep', result.cep);
    setValue('address.address', result.address);
    setValue('address.neighborhood', result.neighborhood);
    setValue('address.city', result.city);
    setValue('address.state', result.state);
  }

  async function handleMigrate(values: MigrateToStoreFormValues) {
    try {
      setIsSubmitting(true);

      await RegisterService.convertUserToStore({
        storeName: values.storeName,
        pixKey: values.pixKey,
        address: values.address,
      });

      await AuthService.postPixData({
        ownerName: values.ownerName,
        pixKey: values.pixKey,
        document: values.document,
      });

      await updateProfile({
        type: 'STORE',
        storeName: values.storeName,
      });

      setIsDone(true);
    } catch {
      Alert.alert(
        'Erro',
        'Não foi possível migrar sua conta para loja agora.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (user?.type === 'STORE') {
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
            <Text style={styles.title}>Migrar para loja</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Store color={colors.primary} size={32} />
          <Text style={styles.description}>
            Sua conta já é uma loja. Não é necessário migrar novamente.
          </Text>
        </View>
      </ScrollView>
    );
  }

  if (isDone) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Store color={colors.primary} size={32} />
          <Text style={styles.title}>Loja criada com sucesso!</Text>
          <Text style={styles.description}>
            Sua conta agora é uma loja. Você já pode gerenciar produtos,
            vendas e muito mais.
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}
          >
            <Text style={styles.primaryButtonText}>Ir para o início</Text>
          </Pressable>
        </View>
      </ScrollView>
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
          <Text style={styles.heroEyebrow}>Configurações</Text>
          <Text style={styles.title}>Migrar para loja</Text>
        </View>
      </View>

      <View style={styles.infoBanner}>
        <Info color={colors.orange} size={18} />
        <Text style={styles.infoText}>
          Preencha os dados abaixo para transformar sua conta em uma loja.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>1. Dados da loja</Text>

        <RegisterField
          control={control}
          name='storeName'
          label='Nome da loja'
          autoCapitalize='words'
          returnKeyType='next'
          error={errors.storeName?.message}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>2. Endereço</Text>

        <RegisterField
          control={control}
          name='address.cep'
          label='CEP'
          keyboardType='number-pad'
          inputMode='numeric'
          maxLength={9}
          returnKeyType='next'
          transform={maskCep}
          onFieldBlur={handleCepBlur}
          error={errors.address?.cep?.message}
        />

        {isLoadingCep ? (
          <Text style={styles.helperText}>Buscando endereço pelo CEP...</Text>
        ) : null}

        <RegisterField
          control={control}
          name='address.address'
          label='Endereço'
          returnKeyType='next'
          error={errors.address?.address?.message}
        />

        <View style={styles.twoColumns}>
          <RegisterField
            control={control}
            name='address.number'
            label='Número'
            keyboardType='number-pad'
            inputMode='numeric'
            returnKeyType='next'
            containerStyle={styles.column}
            error={errors.address?.number?.message}
          />

          <RegisterField
            control={control}
            name='address.complement'
            label='Complemento'
            returnKeyType='next'
            containerStyle={styles.column}
            error={errors.address?.complement?.message}
          />
        </View>

        <RegisterField
          control={control}
          name='address.neighborhood'
          label='Bairro'
          returnKeyType='next'
          error={errors.address?.neighborhood?.message}
        />

        <View style={styles.twoColumns}>
          <RegisterField
            control={control}
            name='address.city'
            label='Cidade'
            returnKeyType='next'
            containerStyle={styles.column}
            error={errors.address?.city?.message}
          />

          <RegisterField
            control={control}
            name='address.state'
            label='UF'
            autoCapitalize='characters'
            maxLength={2}
            returnKeyType='done'
            transform={normalizeState}
            containerStyle={styles.column}
            error={errors.address?.state?.message}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>3. Dados de recebimento (Pix)</Text>

        <RegisterField
          control={control}
          name='ownerName'
          label='Nome do titular'
          autoCapitalize='words'
          returnKeyType='next'
          helperText='Nome do titular da chave Pix.'
          error={errors.ownerName?.message}
        />

        <RegisterField
          control={control}
          name='pixKey'
          label='Chave Pix'
          autoCapitalize='none'
          returnKeyType='next'
          helperText='CPF, CNPJ, e-mail, telefone ou chave aleatória.'
          error={errors.pixKey?.message}
        />

        <RegisterField
          control={control}
          name='document'
          label='CPF ou CNPJ'
          keyboardType='number-pad'
          inputMode='numeric'
          returnKeyType='done'
          transform={maskCpfCnpj}
          helperText='Documento do titular do recebimento.'
          error={errors.document?.message}
        />
      </View>

      <View style={styles.formActions}>
        <Pressable
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </Pressable>

        <Pressable
          style={[styles.primaryButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit(handleMigrate)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color='#FFFFFF' />
          ) : (
            <Text style={styles.primaryButtonText}>Migrar para loja</Text>
          )}
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
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.orangeSoft,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.text },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  description: { fontSize: 14, lineHeight: 20, color: colors.muted },
  helperText: { fontSize: 12, color: colors.muted },
  twoColumns: { gap: 12, flexDirection: 'row' },
  column: { flex: 1 },
  formActions: { flexDirection: 'row', gap: 12 },
  secondaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '700', color: colors.text },
  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.65 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
