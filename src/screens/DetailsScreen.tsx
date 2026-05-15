import { Button, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Text>Tela Details</Text>

      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}
