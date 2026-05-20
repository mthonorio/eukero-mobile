import { Modal } from 'react-native';

import { WebView } from 'react-native-webview';
import env from '../../config/env';

type Props = {
  visible: boolean;

  onVerify: (token: string) => void;

  onClose: () => void;
};

const SITE_KEY = env.recaptchaSiteKeyV3;

export function RecaptchaV3({ visible, onVerify, onClose }: Props) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://www.google.com/recaptcha/api.js?render=${SITE_KEY}"></script>
      </head>

      <body>
        <script>
          grecaptcha.ready(function() {
            grecaptcha.execute('${SITE_KEY}', {
              action: 'submit'
            }).then(function(token) {
              window.ReactNativeWebView.postMessage(token);
            });
          });
        </script>
      </body>
    </html>
  `;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <WebView
        originWhitelist={['*']}
        source={{
          html,
        }}
        javaScriptEnabled
        onMessage={event => {
          const token = event.nativeEvent.data;

          onVerify(token);

          onClose();
        }}
      />
    </Modal>
  );
}
