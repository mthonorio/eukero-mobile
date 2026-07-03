import { Button, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ navigation }: Props) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <Text>{t('DetailsPlaceholder.title')}</Text>

      <Button
        title={t('DetailsPlaceholder.back')}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}
