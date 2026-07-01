import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChevronLeft, Link2 } from 'lucide-react-native';

import { RootStackParamList } from '../../../navigation/types';
import { InstagramService } from '../../../services/instagram.service';

type Props = NativeStackScreenProps<RootStackParamList, 'Connect'>;

const colors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceSoft: '#F3F4F6',
  text: '#101828',
  muted: '#667085',
  border: '#E4E7EC',
  primary: '#0F7A4F',
  primarySoft: 'rgba(15, 122, 79, 0.10)',
  successSoft: 'rgba(15, 122, 79, 0.10)',
};

export function ConnectScreen({ navigation }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      setIsLoading(true);
      const status = await InstagramService.getStatus();
      setConnected(status.connected);
      setUsername(status.username);
    } catch {
      setConnected(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleConnect() {
    try {
      setIsConnecting(true);
      const { authUrl } = await InstagramService.connect();
      await Linking.openURL(authUrl);
    } catch {
      Alert.alert('Erro', 'Não foi possível iniciar a conexão com o Instagram.');
    } finally {
      setIsConnecting(false);
    }
  }

  function handleDisconnect() {
    Alert.alert(
      'Desconectar Instagram',
      'Tem certeza que deseja desconectar sua conta do Instagram?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desconectar',
          style: 'destructive',
          onPress: async () => {
            try {
              await InstagramService.disconnect();
              setConnected(false);
              setUsername(undefined);
            } catch {
              Alert.alert('Erro', 'Não foi possível desconectar sua conta.');
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
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ChevronLeft color={colors.text} size={22} />
        </Pressable>

        <View>
          <Text style={styles.heroEyebrow}>Configurações</Text>
          <Text style={styles.title}>Conectar Instagram</Text>
        </View>
      </View>

      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.centerState}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : connected ? (
          <>
            <View style={styles.statusBanner}>
              <Link2 color={colors.primary} size={18} />
              <Text style={styles.statusText}>
                Conectado como @{username ?? 'instagram'}
              </Text>
            </View>

            <Pressable
              style={styles.secondaryButton}
              onPress={handleDisconnect}
            >
              <Text style={styles.secondaryButtonText}>Desconectar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.description}>
              Conecte uma conta comercial ou de criador de conteúdo do
              Instagram para vincular seu perfil à sua loja.
            </Text>

            <Pressable
              style={[
                styles.primaryButton,
                isConnecting && styles.disabledButton,
              ]}
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color='#FFFFFF' />
              ) : (
                <Text style={styles.primaryButtonText}>
                  Conectar com Instagram
                </Text>
              )}
            </Pressable>
          </>
        )}
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
  card: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 14,
  },
  centerState: { minHeight: 120, alignItems: 'center', justifyContent: 'center' },
  description: { fontSize: 14, lineHeight: 20, color: colors.muted },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.successSoft,
  },
  statusText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: { fontSize: 14, fontWeight: '700', color: colors.text },
  disabledButton: { opacity: 0.65 },
});
