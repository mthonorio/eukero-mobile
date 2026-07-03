import { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './navigation/AppNavigation';
import { AuthProvider } from './providers/AuthProvider';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { initI18n } from './i18n';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isI18nReady, setIsI18nReady] = useState(false);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
          },
        },
      }),
  );

  useEffect(() => {
    initI18n().finally(() => setIsI18nReady(true));
  }, []);

  if (!isI18nReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              translucent
              backgroundColor='transparent'
            />
            <AppNavigator />
          </AuthProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

export default App;
