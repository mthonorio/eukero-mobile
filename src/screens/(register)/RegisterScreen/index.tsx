import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Building2, UserRound } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';

import { AuthStackParamList } from '../../../navigation/types';
import { RegisterChoiceCard } from '../../../components/auth/register/RegisterChoiceCard';
import { RegisterPersonForm } from '../../../components/auth/register/RegisterPersonForm';
import { RegisterStoreForm } from '../../../components/auth/register/RegisterStoreForm';
import { useRegisterFlow } from '../../../hooks/register/useRegisterFlow';
import type {
  RegisterPersonFormValues,
  RegisterStoreFormValues,
  RegisterUserType,
} from '../../../types/auth/register';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<RegisterUserType | null>(
    null,
  );
  const { loading, error, registerPerson, registerStore, clearError } =
    useRegisterFlow();

  function handleSelectType(userType: RegisterUserType) {
    clearError();
    setSelectedType(userType);
  }

  function handleBackToTypeSelection() {
    clearError();
    setSelectedType(null);
  }

  function goToLogin() {
    navigation.navigate('Login');
  }

  async function handlePersonSubmit(values: RegisterPersonFormValues) {
    const result = await registerPerson(values);

    if (!result.success) {
      return;
    }

    Alert.alert(
      t('Register.personSuccessTitle'),
      t('Register.personSuccessMessage'),
      [
        {
          text: t('Register.activateAccount'),
          onPress: () =>
            navigation.navigate('ActivateAccount', {
              email: values.email,
            }),
        },
      ],
    );
  }

  async function handleStoreSubmit(values: RegisterStoreFormValues) {
    const result = await registerStore(values);

    if (!result.success) {
      return;
    }

    Alert.alert(
      t('Register.storeSuccessTitle'),
      t('Register.storeSuccessMessage'),
      [
        {
          text: t('Register.activateAccount'),
          onPress: () =>
            navigation.navigate('ActivateAccount', {
              email: values.email,
            }),
        },
      ],
    );
  }

  return (
    <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        bottomOffset={24}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.kicker}>{t('Register.kicker')}</Text>
          <Text style={styles.title}>{t('Register.title')}</Text>
          {/* <Text style={styles.subtitle}>Primeiro escolha o tipo de conta.</Text> */}
        </View>

        {!selectedType ? (
          <View style={styles.choiceWrap}>
            <RegisterChoiceCard
              title={t('Register.storeCardTitle')}
              description={t('Register.storeCardDescription')}
              Icon={Building2}
              onPress={() => handleSelectType('STORE')}
            />

            <RegisterChoiceCard
              title={t('Register.personCardTitle')}
              description={t('Register.personCardDescription')}
              Icon={UserRound}
              onPress={() => handleSelectType('USER')}
            />

            <Pressable onPress={goToLogin} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>{t('Register.back')}</Text>
            </Pressable>
          </View>
        ) : selectedType === 'USER' ? (
          <RegisterPersonForm
            loading={loading}
            error={error}
            onSubmit={handlePersonSubmit}
            onBack={handleBackToTypeSelection}
          />
        ) : (
          <RegisterStoreForm
            loading={loading}
            error={error}
            onSubmit={handleStoreSubmit}
            onBack={handleBackToTypeSelection}
          />
        )}
      </KeyboardAwareScrollView>
    </Pressable>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 48,
  },
  hero: {
    gap: 8,
    marginBottom: 22,
  },
  kicker: {
    color: '#640000ff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: '#111111',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    textAlign: 'center',
  },
  subtitle: {
    color: '#5d5d5d',
    fontSize: 15,
    lineHeight: 22,
  },
  choiceWrap: {
    gap: 14,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#640000ff',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#640000ff',
    fontSize: 16,
    fontWeight: '700',
  },
});
