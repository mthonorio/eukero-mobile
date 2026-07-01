import { z } from 'zod';

import { registerAddressSchema } from '../register/register.schemas';
import { isValidCpfOrCnpj } from '../register/register.helpers';

export const addressFormSchema = registerAddressSchema.extend({
  name: z.string().trim().optional().default(''),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;

export const pixDataSchema = z.object({
  ownerName: z.string().trim().min(2, 'Informe o nome do titular.'),
  pixKey: z.string().trim().min(1, 'Informe a chave Pix.'),
  document: z
    .string()
    .trim()
    .refine(isValidCpfOrCnpj, 'Informe um CPF ou CNPJ válido.'),
});

export type PixDataFormValues = z.infer<typeof pixDataSchema>;

export const migrateToStoreSchema = z.object({
  storeName: z.string().trim().min(2, 'Informe o nome da loja.'),
  address: registerAddressSchema,
  ownerName: z.string().trim().min(2, 'Informe o nome do titular.'),
  pixKey: z.string().trim().min(1, 'Informe a chave Pix.'),
  document: z
    .string()
    .trim()
    .refine(isValidCpfOrCnpj, 'Informe um CPF ou CNPJ válido.'),
});

export type MigrateToStoreFormValues = z.infer<typeof migrateToStoreSchema>;
