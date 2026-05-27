import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../../stores/auth.store';
import Layout from './layout';
import { AuthStackParamList } from '../../navigation/types';
import { isBiometricAvailable } from '../../services/biometric.service';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore(state => state.signIn);
  const signInWithBiometrics = useAuthStore(
    state => state.signInWithBiometrics,
  );
  const isLoading = useAuthStore(state => state.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricLabel, setBiometricLabel] = useState('biometria');
  const [isBiometricChecking, setIsBiometricChecking] = useState(true);
  const [biometricError, setBiometricError] = useState<string | null>(null);

  async function handleLogin() {
    await signIn(email, password);
  }

  async function handleBiometricLogin() {
    try {
      setBiometricError(null);

      await signInWithBiometrics();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Não foi possível autenticar com biometria.';

      setBiometricError(message);
      Alert.alert('Biometria', message);
    }
  }

  function handleForgotPassword() {
    navigation.navigate('ForgetPassword');
  }

  useEffect(() => {
    let isMounted = true;

    async function checkBiometricSupport() {
      try {
        const { available, biometryType } = await isBiometricAvailable();

        if (!isMounted) {
          return;
        }

        setBiometricAvailable(available);
        setBiometricLabel(
          biometryType === 'FaceID'
            ? 'Face ID'
            : biometryType === 'TouchID'
            ? 'digital'
            : 'biometria',
        );
      } catch {
        if (isMounted) {
          setBiometricAvailable(false);
        }
      } finally {
        if (isMounted) {
          setIsBiometricChecking(false);
        }
      }
    }

    checkBiometricSupport();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: '#fff',
          padding: 20,
          gap: 12,
        }}
      >
        <TextInput
          placeholder='Login'
          value={email}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          returnKeyType='next'
          onChangeText={setEmail}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 14,
            borderRadius: 10,
            fontSize: 16,
          }}
        />

        <TextInput
          placeholder='Senha'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType='done'
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 14,
            borderRadius: 10,
            fontSize: 16,
          }}
        />

        <TouchableOpacity
          onPress={handleForgotPassword}
          activeOpacity={0.7}
          style={{
            alignSelf: 'flex-end',
          }}
        >
          <Text
            style={{
              color: '#640000ff',
              fontWeight: '600',
            }}
          >
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isLoading}
          onPress={handleLogin}
          activeOpacity={0.85}
          style={{
            minHeight: 48,
            borderRadius: 12,
            backgroundColor: '#640000ff',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              Entrar
            </Text>
          )}
        </TouchableOpacity>

        {biometricAvailable ? (
          <TouchableOpacity
            disabled={isLoading || isBiometricChecking}
            onPress={handleBiometricLogin}
            activeOpacity={0.85}
            style={{
              minHeight: 48,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#640000ff',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading || isBiometricChecking ? 0.7 : 1,
            }}
          >
            {isLoading && !isBiometricChecking ? (
              <ActivityIndicator color='#640000ff' />
            ) : (
              <Text
                style={{
                  color: '#640000ff',
                  fontSize: 16,
                  fontWeight: '700',
                }}
              >
                Entrar com {biometricLabel}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}

        {!isBiometricChecking ? (
          <Text
            style={{
              color: '#666',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {biometricAvailable
              ? 'Use Face ID, digital ou a senha do dispositivo para entrar.'
              : 'Biometria indisponível neste dispositivo.'}
          </Text>
        ) : null}

        {biometricError ? (
          <Text
            style={{
              color: '#b00020',
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {biometricError}
          </Text>
        ) : null}
      </View>
    </Layout>
  );
}
