import Config from 'react-native-config';

export const env = {
  apiUrl: Config.API_URL,
  recaptchaSiteKey: Config.RECAPTCHA_SITE_KEY,
  recaptchaSiteKeyV3: Config.RECAPTCHA_V3_SITE_KEY,
};

export default env;
