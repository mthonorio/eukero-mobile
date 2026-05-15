import { View, Text } from 'react-native';

export function HomeScreen() {
  console.log('HOME SCREEN RENDERIZOU');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}
    >
      <Text
        style={{
          fontSize: 30,
          color: 'white',
        }}
      >
        HOME SCREEN
      </Text>
    </View>
  );
}
