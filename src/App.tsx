import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigation';
import { AuthProvider } from './providers/AuthProvider';
import { KeyboardProvider } from 'react-native-keyboard-controller';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <AuthProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            translucent
            backgroundColor='transparent'
          />
          <AppNavigator />
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

export default App;
