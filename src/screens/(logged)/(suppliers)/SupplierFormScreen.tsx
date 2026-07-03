import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ChevronLeft, Minus, Plus, Search } from 'lucide-react-native';

import { Avatar } from '../../../components/atoms/Avatar';
import { SupplierService } from '../../../services/supplier.service';
import { UserService, type UserMeResponse } from '../../../services/user.service';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SupplierForm'>;

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

export function SupplierFormScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const supplierId = route.params?.supplierId;
  const isEditing = Boolean(supplierId);

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<UserMeResponse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserMeResponse | null>(
    null,
  );
  const [percentage, setPercentage] = useState(10);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEditing || !supplierId) return;

    (async () => {
      try {
        const supplier = await SupplierService.getSupplierById(supplierId);
        setSelectedUser({
          uid: supplier.userUid,
          name: supplier.userName,
          username: supplier.userUsername,
          email: supplier.userEmail,
          phone: supplier.userPhone ?? '',
          photo: supplier.userPhoto ?? '',
          type: supplier.userType,
        });
        setPercentage(supplier.percentageValue ?? 10);
      } catch {
        Alert.alert(
          t('SupplierForm.alerts.loadErrorTitle'),
          t('SupplierForm.alerts.loadErrorMessage'),
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isEditing, supplierId]);

  useEffect(() => {
    const trimmed = search.trim();
    if (!trimmed || selectedUser) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await UserService.searchUsers({
          search: trimmed,
          type: 'USER',
        });
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, selectedUser]);

  const handleSelectUser = useCallback((user: UserMeResponse) => {
    setSelectedUser(user);
    setSearch('');
    setSearchResults([]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedUser) {
      Alert.alert(
        t('SupplierForm.alerts.selectUserTitle'),
        t('SupplierForm.alerts.selectUserMessage'),
      );
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        userId: selectedUser.uid,
        paymentType: 'FIXED_PERCENTAGE' as const,
        percentageValue: percentage,
      };

      if (isEditing && supplierId) {
        await SupplierService.patchSupplier(supplierId, payload);
      } else {
        await SupplierService.postSupplier(payload);
      }

      navigation.goBack();
    } catch {
      Alert.alert(
        t('SupplierForm.alerts.saveErrorTitle'),
        t('SupplierForm.alerts.saveErrorMessage'),
      );
    } finally {
      setIsSaving(false);
    }
  }, [isEditing, navigation, percentage, selectedUser, supplierId, t]);

  return (
    <ScrollView
      style={styles.screen}
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
            {isEditing
              ? t('SupplierForm.titleEdit')
              : t('SupplierForm.titleAdd')}
          </Text>
          <Text style={styles.description}>
            {t('SupplierForm.description')}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>{t('SupplierForm.userLabel')}</Text>

          {selectedUser ? (
            <View style={styles.selectedUserRow}>
              <Avatar uri={selectedUser.photo} size={40} />
              <View style={styles.selectedUserInfo}>
                <Text style={styles.selectedUserName}>
                  {selectedUser.name}
                </Text>
                <Text style={styles.selectedUserUsername}>
                  @{selectedUser.username}
                </Text>
              </View>
              {!isEditing ? (
                <Pressable onPress={() => setSelectedUser(null)}>
                  <Text style={styles.changeLink}>
                    {t('SupplierForm.changeLink')}
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : (
            <>
              <View style={styles.searchBox}>
                <Search color={colors.muted} size={16} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t('SupplierForm.searchPlaceholder')}
                  placeholderTextColor={colors.muted}
                  style={styles.searchInput}
                  autoCapitalize='none'
                />
                {isSearching ? (
                  <ActivityIndicator color={colors.primary} size='small' />
                ) : null}
              </View>

              {searchResults.map(user => (
                <Pressable
                  key={user.uid}
                  style={styles.resultRow}
                  onPress={() => handleSelectUser(user)}
                >
                  <Avatar uri={user.photo} size={36} />
                  <View style={styles.selectedUserInfo}>
                    <Text style={styles.selectedUserName}>{user.name}</Text>
                    <Text style={styles.selectedUserUsername}>
                      @{user.username}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </>
          )}

          <Text style={[styles.label, styles.percentageLabel]}>
            {t('SupplierForm.percentageLabel')}
          </Text>

          <View style={styles.percentageRow}>
            <Pressable
              style={styles.stepperButton}
              onPress={() => setPercentage(prev => Math.max(0, prev - 1))}
            >
              <Minus color={colors.text} size={16} />
            </Pressable>

            <Text style={styles.percentageValue}>{percentage}%</Text>

            <Pressable
              style={styles.stepperButton}
              onPress={() => setPercentage(prev => Math.min(100, prev + 1))}
            >
              <Plus color={colors.text} size={16} />
            </Pressable>
          </View>

          <Pressable
            style={[styles.primaryButton, isSaving && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color='#FFFFFF' />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isEditing
                  ? t('SupplierForm.buttonSave')
                  : t('SupplierForm.buttonAdd')}
              </Text>
            )}
          </Pressable>
        </View>
      )}
    </ScrollView>
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
  centerState: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  label: { fontSize: 13, fontWeight: '700', color: colors.text },
  percentageLabel: { marginTop: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.text },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: colors.surfaceSoft,
  },
  selectedUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  selectedUserInfo: { flex: 1 },
  selectedUserName: { fontSize: 14, fontWeight: '700', color: colors.text },
  selectedUserUsername: { fontSize: 12, color: colors.muted },
  changeLink: { fontSize: 13, fontWeight: '700', color: colors.primary },
  percentageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 8,
  },
  stepperButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  percentageValue: { fontSize: 24, fontWeight: '800', color: colors.text },
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: { opacity: 0.65 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
