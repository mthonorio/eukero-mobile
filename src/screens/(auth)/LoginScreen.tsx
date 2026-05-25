import { useState } from 'react';
import { View, Button, TextInput, Text, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthStore } from '../../stores/auth.store';
import Layout from './layout';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const signIn = useAuthStore(state => state.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    await signIn(email, password);
  }

  function handleForgotPassword() {
    navigation.navigate('ForgetPassword');
  }

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

        <Button
          title='Entrar'
          color='#640000ff'
          onPress={() => handleLogin()}
        />
      </View>
    </Layout>
  );
}
