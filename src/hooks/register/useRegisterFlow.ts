import { useState } from 'react';

import axios from 'axios';

import { RegisterAuthService } from '../../services/auth/register.service';
import {
  normalizeState,
  onlyDigits,
} from '../../validators/register/register.helpers';
import type {
  RegisterPersonFormValues,
  RegisterPersonPayload,
  RegisterStoreFormValues,
  RegisterStorePayload,
} from '../../types/auth/register';

type RegisterResult = {
  success: boolean;
  message?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      error.response?.data?.message ?? error.response?.data?.error;

    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage;
    }

    if (Array.isArray(responseMessage) && responseMessage.length > 0) {
      return String(responseMessage[0]);
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function toPersonPayload(
  values: RegisterPersonFormValues,
): RegisterPersonPayload {
  return {
    email: values.email.trim(),
    password: values.password,
    name: values.name.trim(),
    phone: onlyDigits(values.phone),
    userType: 'USER',
    document: onlyDigits(values.document),
    pixKey: values.pixKey.trim(),
  };
}

function toStorePayload(values: RegisterStoreFormValues): RegisterStorePayload {
  return {
    email: values.email.trim(),
    password: values.password,
    name: values.name.trim(),
    phone: onlyDigits(values.phone),
    userType: 'STORE',
    storeName: values.storeName.trim(),
    document: onlyDigits(values.document),
    pixKey: values.pixKey.trim(),
    address: {
      cep: onlyDigits(values.address.cep),
      address: values.address.address.trim(),
      number: values.address.number.trim(),
      complement: values.address.complement.trim(),
      neighborhood: values.address.neighborhood.trim(),
      city: values.address.city.trim(),
      state: normalizeState(values.address.state),
    },
  };
}

export function useRegisterFlow() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function registerPerson(
    values: RegisterPersonFormValues,
  ): Promise<RegisterResult> {
    setLoading(true);
    setError(null);

    try {
      await RegisterAuthService.registerPerson(toPersonPayload(values));

      return { success: true };
    } catch (registerError) {
      const message = getErrorMessage(
        registerError,
        'Não foi possível concluir o cadastro.',
      );

      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }

  async function registerStore(
    values: RegisterStoreFormValues,
  ): Promise<RegisterResult> {
    setLoading(true);
    setError(null);

    try {
      await RegisterAuthService.registerStore(toStorePayload(values));

      return { success: true };
    } catch (registerError) {
      const message = getErrorMessage(
        registerError,
        'Não foi possível concluir o cadastro da loja.',
      );

      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return {
    loading,
    error,
    registerPerson,
    registerStore,
    clearError,
  };
}
