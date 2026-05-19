import { useState } from 'react';

import {
  View,
  Button,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Logo from '../assets/svg/logo-eukero.svg';

import { Recaptcha } from '../components/Recaptcha';

import { useAuthStore } from '../stores/auth.store';

export function LoginScreen() {
  const signIn = useAuthStore(state => state.signIn);

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [showCaptcha, setShowCaptcha] = useState(false);

  async function handleCaptcha(token: string) {
    await signIn(email, password, token);
  }

  function handleForgotPassword() {
    console.log('Forgot password');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,

            justifyContent: 'center',

            backgroundColor: '#fff',

            padding: 20,

            gap: 12,
          }}
        >
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Logo width={240} height={240} />
          </View>

          <TextInput
            placeholder="Login"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
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
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
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

          <Button
            title="Entrar"
            color="#640000ff"
            onPress={() => setShowCaptcha(true)}
          />

          <Recaptcha
            visible={showCaptcha}
            onClose={() => setShowCaptcha(false)}
            onVerify={handleCaptcha}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
