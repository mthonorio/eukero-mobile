import { useState } from 'react';

import {
  CepService,
  type CepLookupResult,
} from '../../services/auth/cep.service';
import { onlyDigits } from '../../validators/register/register.helpers';

export function useCepLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(cep: string): Promise<CepLookupResult | null> {
    const digits = onlyDigits(cep);

    if (digits.length !== 8) {
      setError('Informe um CEP válido antes de buscar o endereço.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await CepService.lookup(digits);

      if (!result) {
        setError('CEP não encontrado.');
        return null;
      }

      return result;
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : 'Não foi possível consultar o CEP.',
      );
      return null;
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
    lookup,
    clearError,
  };
}
