import { z } from 'zod';
import type { TFunction } from 'i18next';

import { createRegisterAddressSchema } from '../register/register.schemas';
import { isValidCpfOrCnpj } from '../register/register.helpers';

export const createAddressFormSchema = (t: TFunction) =>
  createRegisterAddressSchema(t).extend({
    name: z.string().trim().optional().default(''),
  });

export type AddressFormValues = z.infer<ReturnType<typeof createAddressFormSchema>>;

export const createPixDataSchema = (t: TFunction) =>
  z.object({
    ownerName: z.string().trim().min(2, t('Validation.pix.ownerNameRequired')),
    pixKey: z.string().trim().min(1, t('Validation.pix.keyRequired')),
    document: z
      .string()
      .trim()
      .refine(isValidCpfOrCnpj, t('Validation.pix.documentInvalid')),
  });

export type PixDataFormValues = z.infer<ReturnType<typeof createPixDataSchema>>;

export const createMigrateToStoreSchema = (t: TFunction) =>
  z.object({
    storeName: z.string().trim().min(2, t('Validation.storeName.required')),
    address: createRegisterAddressSchema(t),
    ownerName: z.string().trim().min(2, t('Validation.pix.ownerNameRequired')),
    pixKey: z.string().trim().min(1, t('Validation.pix.keyRequired')),
    document: z
      .string()
      .trim()
      .refine(isValidCpfOrCnpj, t('Validation.pix.documentInvalid')),
  });

export type MigrateToStoreFormValues = z.infer<ReturnType<typeof createMigrateToStoreSchema>>;
