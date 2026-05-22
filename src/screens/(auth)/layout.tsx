import { ReactNode } from 'react';
import { Keyboard, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Logo from '../../assets/svg/logo-eukero.svg';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Pressable
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
      onPress={Keyboard.dismiss}
    >
      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            gap: 12,
          }}
        >
          <View
            style={{
              alignItems: 'center',
            }}
          >
            <Logo width={240} height={240} />
          </View>

          {children}
        </View>
      </KeyboardAwareScrollView>
    </Pressable>
  );
}
