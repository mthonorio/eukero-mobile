import { Modal } from 'react-native';

import WebView from 'react-native-webview';
import env from '../../config/env';

type Props = {
  visible: boolean;
  onClose: () => void;
  onVerify: (token: string) => void;
};

const html = `
<!DOCTYPE html>
<html>
  <head>
    <script src="https://www.google.com/recaptcha/api.js"></script>
  </head>

  <body>
    <form>
      <div
        class="g-recaptcha"
        data-sitekey="${env.recaptchaSiteKey}"
        data-callback="onVerify">
      </div>
    </form>

    <script>
      function onVerify(token) {
        window.ReactNativeWebView.postMessage(token);
      }
    </script>
  </body>
</html>
`;

export function Recaptcha({ visible, onClose, onVerify }: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <WebView
        originWhitelist={['*']}
        source={{
          html,
        }}
        onMessage={event => {
          onVerify(event.nativeEvent.data);

          onClose();
        }}
      />
    </Modal>
  );
}
