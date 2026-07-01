import { useEffect, useState } from 'react';
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
import {
  ChevronLeft,
  MapPin,
  Pen,
  Plus,
  Trash2,
} from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { UserService } from '../../../services/user.service';
import { IAddress } from '../../../types/register.type';
import { RegisterField } from '../../../components/auth/register/RegisterField';
import { useCepLookup } from '../../../hooks/register/useCepLookup';
import { maskCep, normalizeState } from '../../../validators/register/register.helpers';
import {
  addressFormSchema,
  type AddressFormValues,
} from '../../../validators/settings/settings.schemas';

type Props = NativeStackScreenProps<RootStackParamList, 'Addresses'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  danger: '#B42318',
};

const emptyAddress: AddressFormValues = {
  name: '',
  cep: '',
  address: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

export function AddressesScreen({ navigation }: Props) {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<'list' | 'form'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  const { loading: isLoadingCep, lookup } = useCepLookup();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema) as unknown as Resolver<AddressFormValues>,
    defaultValues: emptyAddress,
    mode: 'onBlur',
  });

  async function loadAddresses() {
    try {
      setIsLoading(true);
      const data = await UserService.getAddresses();
      setAddresses(data);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os endereços.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function openNewAddressForm() {
    setEditingId(null);
    reset(emptyAddress);
    setMode('form');
  }

  function openEditAddressForm(address: IAddress) {
    setEditingId(address.uid ?? address.id ?? null);
    reset({
      name: address.name ?? '',
      cep: address.cep,
      address: address.address,
      number: address.number,
      complement: address.complement ?? '',
      neighborhood: address.neighborhood ?? '',
      city: address.city,
      state: address.state,
    });
    setMode('form');
  }

  async function handleCepBlur(value: string) {
    const result = await lookup(value);
    if (!result) return;

    setValue('cep', result.cep);
    setValue('address', result.address);
    setValue('neighborhood', result.neighborhood);
    setValue('city', result.city);
    setValue('state', result.state);
  }

  async function handleSave(values: AddressFormValues) {
    try {
      setIsSaving(true);

      if (editingId) {
        await UserService.updateAddress(editingId, values);
      } else {
        await UserService.addAddress(values);
      }

      await loadAddresses();
      setMode('list');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o endereço.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleDelete(address: IAddress) {
    const id = address.uid ?? address.id;
    if (!id) return;

    Alert.alert(
      'Excluir endereço',
      'Tem certeza que deseja excluir este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteAddress(id);
              await loadAddresses();
            } catch {
              Alert.alert('Erro', 'Não foi possível excluir o endereço.');
            }
          },
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Pressable
          onPress={() =>
            mode === 'form' ? setMode('list') : navigation.goBack()
          }
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View>
          <Text style={styles.heroEyebrow}>Configurações</Text>
          <Text style={styles.title}>
            {mode === 'form'
              ? editingId
                ? 'Editar endereço'
                : 'Novo endereço'
              : 'Endereços'}
          </Text>
        </View>
      </View>

      {mode === 'list' ? (
        <View style={styles.card}>
          {isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin color={colors.muted} size={28} />
              <Text style={styles.emptyText}>
                Você ainda não cadastrou nenhum endereço.
              </Text>
            </View>
          ) : (
            addresses.map(address => (
              <View key={address.uid ?? address.id} style={styles.addressCard}>
                <View style={styles.addressInfo}>
                  {address.name ? (
                    <Text style={styles.addressName}>{address.name}</Text>
                  ) : null}
                  <Text style={styles.addressText}>
                    {address.address}, {address.number}
                    {address.complement ? ` - ${address.complement}` : ''}
                  </Text>
                  <Text style={styles.addressText}>
                    {address.neighborhood ? `${address.neighborhood}, ` : ''}
                    {address.city} - {address.state}
                  </Text>
                  <Text style={styles.addressMuted}>CEP: {address.cep}</Text>
                </View>

                <View style={styles.addressActions}>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => openEditAddressForm(address)}
                  >
                    <Pen color={colors.primary} size={16} />
                  </Pressable>
                  <Pressable
                    style={styles.iconButton}
                    onPress={() => handleDelete(address)}
                  >
                    <Trash2 color={colors.danger} size={16} />
                  </Pressable>
                </View>
              </View>
            ))
          )}

          <Pressable style={styles.addButton} onPress={openNewAddressForm}>
            <Plus color={colors.primary} size={18} />
            <Text style={styles.addButtonText}>Adicionar endereço</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <RegisterField
            control={control}
            name='name'
            label='Nome (opcional)'
            returnKeyType='next'
            error={errors.name?.message}
          />

          <RegisterField
            control={control}
            name='cep'
            label='CEP'
            keyboardType='number-pad'
            inputMode='numeric'
            maxLength={9}
            returnKeyType='next'
            transform={maskCep}
            onFieldBlur={handleCepBlur}
            error={errors.cep?.message}
          />

          {isLoadingCep ? (
            <Text style={styles.helperText}>Buscando endereço pelo CEP...</Text>
          ) : null}

          <RegisterField
            control={control}
            name='address'
            label='Endereço'
            returnKeyType='next'
            error={errors.address?.message}
          />

          <View style={styles.twoColumns}>
            <RegisterField
              control={control}
              name='number'
              label='Número'
              keyboardType='number-pad'
              inputMode='numeric'
              returnKeyType='next'
              containerStyle={styles.column}
              error={errors.number?.message}
            />

            <RegisterField
              control={control}
              name='complement'
              label='Complemento'
              returnKeyType='next'
              containerStyle={styles.column}
              error={errors.complement?.message}
            />
          </View>

          <RegisterField
            control={control}
            name='neighborhood'
            label='Bairro'
            returnKeyType='next'
            error={errors.neighborhood?.message}
          />

          <View style={styles.twoColumns}>
            <RegisterField
              control={control}
              name='city'
              label='Cidade'
              returnKeyType='next'
              containerStyle={styles.column}
              error={errors.city?.message}
            />

            <RegisterField
              control={control}
              name='state'
              label='UF'
              autoCapitalize='characters'
              maxLength={2}
              returnKeyType='done'
              transform={normalizeState}
              containerStyle={styles.column}
              error={errors.state?.message}
            />
          </View>

          <View style={styles.formActions}>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => setMode('list')}
            >
              <Text style={styles.secondaryButtonText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[styles.primaryButton, isSaving && styles.disabledButton]}
              onPress={handleSubmit(handleSave)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color='#FFFFFF' />
              ) : (
                <Text style={styles.primaryButtonText}>Salvar</Text>
              )}
            </Pressable>
          </View>
        </View>
      )}
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
    padding: 14,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  centerState: { minHeight: 120, alignItems: 'center', justifyContent: 'center' },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.surfaceSoft,
    gap: 12,
  },
  addressInfo: { flex: 1, gap: 2 },
  addressName: { fontSize: 14, fontWeight: '700', color: colors.text },
  addressText: { fontSize: 13, color: colors.text },
  addressMuted: { fontSize: 12, color: colors.muted, marginTop: 4 },
  addressActions: { flexDirection: 'row', gap: 8 },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  addButtonText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  helperText: { fontSize: 12, color: colors.muted },
  twoColumns: { gap: 12, flexDirection: 'row' },
  column: { flex: 1 },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
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
