import {
  maskCep,
  onlyDigits,
} from '../../validators/register/register.helpers';

export type CepLookupResult = {
  cep: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
};

type ViaCepResponse = {
  erro?: boolean;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
};

export class CepService {
  static async lookup(cep: string): Promise<CepLookupResult | null> {
    const digits = onlyDigits(cep);

    if (digits.length !== 8) {
      return null;
    }

    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);

    if (!response.ok) {
      throw new Error('Não foi possível consultar o CEP agora.');
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return null;
    }

    return {
      cep: maskCep(digits),
      address: data.logradouro ?? '',
      neighborhood: data.bairro ?? '',
      city: data.localidade ?? '',
      state: data.uf ?? '',
    };
  }
}
