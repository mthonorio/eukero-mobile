import { ReactNode, useEffect } from 'react';

import RNBootSplash from 'react-native-bootsplash';

import { useAuthStore } from '../stores/auth.store';

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    async function load() {
      try {
        await hydrate();
      } finally {
        await RNBootSplash.hide({
          fade: true,
        });
      }
    }

    load();
  }, [hydrate]);

  return children;
}
