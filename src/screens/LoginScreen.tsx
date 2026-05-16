import { useState } from 'react';

import { View, Button, TextInput, Image } from 'react-native';

import { Recaptcha } from '../components/Recaptcha';

import { useAuthStore } from '../stores/auth.store';
import Logo from '../assets/svg/logo-eukero.svg';

export function LoginScreen() {
  const signIn = useAuthStore(state => state.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showCaptcha, setShowCaptcha] = useState(false);

  async function handleCaptcha(token: string) {
    await signIn(email, password, token);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 20,
        gap: 12,
      }}
    >
      <Logo width={240} height={240} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Entrar" onPress={() => setShowCaptcha(true)} />

      <Recaptcha
        visible={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onVerify={handleCaptcha}
      />
    </View>
  );
}
