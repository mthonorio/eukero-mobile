import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ArrowLeft, MailCheck, CheckCircle2 } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import Layout from './layout';
import { AuthStackParamList } from '../../navigation/types';
import { RegisterService } from '../../services/register.service';

type Props = NativeStackScreenProps<AuthStackParamList, 'ActivateAccount'>;

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export function ActivateAccountScreen({ navigation, route }: Props) {
  const [email, setEmail] = useState('');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCounter, setResendCounter] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<TextInput>(null);

  const hasValidCode = useMemo(
    () => value.trim().length === OTP_LENGTH,
    [value],
  );

  useEffect(() => {
    const emailParam = route.params?.email;

    if (emailParam) {
      setEmail(emailParam);
      return;
    }

    Alert.alert(
      'Ativação',
      'Não foi possível localizar o e-mail para ativação. Faça login novamente.',
      [
        {
          text: 'Voltar para o login',
          onPress: () => navigation.replace('Login'),
        },
      ],
    );
  }, [navigation, route.params?.email]);

  useEffect(() => {
    if (intervalRef.current || resendCounter <= 0 || isSuccess) {
      return;
    }

    intervalRef.current = setInterval(() => {
      setResendCounter(previous => {
        if (previous <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [resendCounter, isSuccess]);

  async function handleConfirm() {
    if (!email || !hasValidCode) {
      Alert.alert('Ativação', 'Informe o código enviado por e-mail.');
      return;
    }

    setLoading(true);

    try {
      await RegisterService.confirmEmail({
        email,
        token: value.trim(),
      });

      setIsSuccess(true);
      Alert.alert(
        'Conta ativada',
        'Sua conta foi ativada com sucesso. Você já pode entrar.',
        [
          {
            text: 'Ir para o login',
            onPress: () => navigation.replace('Login'),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Ativação',
        error instanceof Error
          ? error.message
          : 'Não foi possível confirmar o código informado.',
      );
      setValue('');
      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (!email) {
      return;
    }

    if (resendCounter > 0) {
      Alert.alert(
        'Ativação',
        `Aguarde ${resendCounter}s para reenviar o código.`,
      );
      return;
    }

    try {
      await RegisterService.resendConfirmationEmail(email);
      setResendCounter(RESEND_SECONDS);
      Alert.alert('Ativação', 'Enviamos um novo código para o seu e-mail.');
    } catch (error) {
      Alert.alert(
        'Ativação',
        error instanceof Error
          ? error.message
          : 'Não foi possível reenviar o código agora.',
      );
    }
  }

  function handleBackToLogin() {
    navigation.replace('Login');
  }

  if (isSuccess) {
    return (
      <Layout>
        <View style={styles.successWrap}>
          <View style={styles.successIconWrap}>
            <CheckCircle2 color='#15803d' size={42} />
          </View>

          <Text style={styles.title}>Conta ativada</Text>
          <Text style={styles.description}>
            Seu cadastro foi confirmado com sucesso. Você já pode acessar o
            aplicativo.
          </Text>

          <Pressable style={styles.primaryButton} onPress={handleBackToLogin}>
            <Text style={styles.primaryButtonText}>Ir para o login</Text>
          </Pressable>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <MailCheck color='#640000ff' size={24} />
          </View>

          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Ativar conta</Text>
            <Text style={styles.subtitle}>
              Confirme o código enviado por e-mail
            </Text>
          </View>
        </View>

        <Text style={styles.description}>
          Enviamos um código para {email || 'seu e-mail'}.
        </Text>

        <View style={styles.otpSection}>
          <Text style={styles.codeLabel}>Código de ativação</Text>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={text =>
              setValue(text.replace(/\D/g, '').slice(0, OTP_LENGTH))
            }
            keyboardType='number-pad'
            inputMode='numeric'
            maxLength={OTP_LENGTH}
            placeholder='000000'
            placeholderTextColor='#8f8f8f'
            style={styles.otpInput}
          />
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={handleConfirm}
            disabled={loading || !hasValidCode}
            style={({ pressed }) => [
              styles.primaryButton,
              (loading || !hasValidCode) && styles.buttonDisabled,
              pressed ? styles.buttonPressed : null,
            ]}
          >
            {loading ? (
              <ActivityIndicator color='#fff' />
            ) : (
              <Text style={styles.primaryButtonText}>Confirmar código</Text>
            )}
          </Pressable>

          <Pressable
            onPress={handleResendCode}
            disabled={loading || resendCounter > 0}
            style={({ pressed }) => [
              styles.secondaryButton,
              (loading || resendCounter > 0) && styles.buttonDisabled,
              pressed ? styles.buttonPressed : null,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {resendCounter > 0
                ? `Reenviar código (${resendCounter}s)`
                : 'Reenviar código'}
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={handleBackToLogin} style={styles.backButton}>
          <ArrowLeft color='#640000ff' size={16} />
          <Text style={styles.backButtonText}>Voltar para o login</Text>
        </Pressable>
      </View>
    </Layout>
  );
}

export default ActivateAccountScreen;

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
  successWrap: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 24,
  },
  successIconWrap: {
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 999,
    height: 76,
    justifyContent: 'center',
    width: 76,
  },
  header: {
    alignItems: 'center',
    gap: 14,
    flexDirection: 'row',
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: '#f9efef',
    borderRadius: 999,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#111111',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#5d5d5d',
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    color: '#5d5d5d',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  otpSection: {
    gap: 8,
  },
  codeLabel: {
    color: '#202020',
    fontSize: 14,
    fontWeight: '600',
  },
  otpInput: {
    backgroundColor: '#fff',
    borderColor: '#d3d3d3',
    borderRadius: 16,
    borderWidth: 1,
    color: '#111111',
    fontSize: 18,
    letterSpacing: 10,
    minHeight: 56,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#640000ff',
    borderRadius: 16,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#640000ff',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#640000ff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonPressed: {
    transform: [{ scale: 0.99 }],
  },
  backButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: '#640000ff',
    fontSize: 14,
    fontWeight: '700',
  },
});
