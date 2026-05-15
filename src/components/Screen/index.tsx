import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  children: ReactNode;
};

export function Screen({ children }: Props) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
      edges={['top', 'bottom']}
    >
      {children}
    </SafeAreaView>
  );
}

export default Screen;
