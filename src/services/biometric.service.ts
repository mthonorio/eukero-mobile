import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export async function isBiometricAvailable() {
  const { available, biometryType } = await rnBiometrics.isSensorAvailable();

  return {
    available,
    biometryType,
  };
}

export async function authenticateWithBiometrics() {
  const result = await rnBiometrics.simplePrompt({
    promptMessage: 'Confirme sua identidade',
    cancelButtonText: 'Cancelar',
  });

  return result.success;
}
