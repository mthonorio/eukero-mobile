import { Button, StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import { RootTabParamList } from '../navigation/types';

type Props = BottomTabScreenProps<RootTabParamList>;

const screenContent: Record<
  keyof RootTabParamList,
  { title: string; description: string }
> = {
  Home: {
    title: 'Início',
    description: 'Tela inicial da aplicação.',
  },
  Suppliers: {
    title: 'Fornecedores',
    description: 'Área reservada para gestão de fornecedores.',
  },
  Orders: {
    title: 'Meus pedidos',
    description: 'Histórico e acompanhamento dos pedidos.',
  },
  ProductForm: {
    title: 'Novo produto',
    description: 'Fluxo de cadastro de produto em breve.',
  },
  Bag: {
    title: 'Sacola',
    description: 'Itens selecionados para finalizar a compra.',
  },
  Notifications: {
    title: 'Notificações',
    description: 'Avisos e atualizações do aplicativo.',
  },
  Profile: {
    title: 'Perfil',
    description: 'Dados e preferências da conta.',
  },
  Menu: {
    title: 'Menu',
    description: 'Opções de navegação do aplicativo.',
  },
};

export function FeaturePlaceholderScreen({ route, navigation }: Props) {
  const content = screenContent[route.name];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{content.title}</Text>
      <Text style={styles.description}>{content.description}</Text>
      <Button
        title='Voltar para Início'
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#121212',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#5c5c5c',
    textAlign: 'center',
    lineHeight: 22,
  },
});
