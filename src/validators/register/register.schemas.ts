import { z } from 'zod';
import type { TFunction } from 'i18next';

import {
  isValidCep,
  isValidCpf,
  isValidCpfOrCnpj,
  isValidPhone,
} from './register.helpers';

const createPasswordSchema = (t: TFunction) =>
  z
    .string()
    .min(8, t('Validation.password.min8'))
    .regex(/[a-z]/, t('Validation.password.lowercase'))
    .regex(/[A-Z]/, t('Validation.password.uppercase'))
    .regex(/\d/, t('Validation.password.number'))
    .regex(/[^A-Za-z0-9]/, t('Validation.password.special'));

const createEmailSchema = (t: TFunction) => z.email(t('Validation.email.invalid'));

const createPhoneSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .refine(isValidPhone, t('Validation.phone.invalid'));

const createPersonDocumentSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .refine(isValidCpf, t('Validation.document.cpfInvalid'));

const createStoreDocumentSchema = (t: TFunction) =>
  z
    .string()
    .trim()
    .refine(isValidCpfOrCnpj, t('Validation.document.cpfCnpjInvalid'));

export const createRegisterAddressSchema = (t: TFunction) =>
  z.object({
    cep: z.string().trim().refine(isValidCep, t('Validation.address.cepInvalid')),
    address: z.string().trim().min(3, t('Validation.address.addressRequired')),
    number: z.string().trim().min(1, t('Validation.address.numberRequired')),
    complement: z.string().trim().optional().default(''),
    neighborhood: z.string().trim().min(2, t('Validation.address.neighborhoodRequired')),
    city: z.string().trim().min(2, t('Validation.address.cityRequired')),
    state: z.string().trim().length(2, t('Validation.address.stateRequired')),
  });

export const createRegisterPersonSchema = (t: TFunction) =>
  z
    .object({
      email: createEmailSchema(t),
      password: createPasswordSchema(t),
      confirmPassword: z.string().min(1, t('Validation.confirmPassword.required')),
      name: z.string().trim().min(3, t('Validation.name.required')),
      phone: createPhoneSchema(t),
      userType: z.literal('USER'),
      document: createPersonDocumentSchema(t),
      pixKey: z.string().trim().min(1, t('Validation.pix.keyRequired')),
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('Validation.confirmPassword.mismatch'),
    });

export const createRegisterStoreSchema = (t: TFunction) =>
  z
    .object({
      email: createEmailSchema(t),
      password: createPasswordSchema(t),
      confirmPassword: z.string().min(1, t('Validation.confirmPassword.required')),
      name: z.string().trim().min(3, t('Validation.name.required')),
      phone: createPhoneSchema(t),
      userType: z.literal('STORE'),
      storeName: z.string().trim().min(2, t('Validation.storeName.required')),
      document: createStoreDocumentSchema(t),
      address: createRegisterAddressSchema(t),
      pixKey: z.string().trim().min(1, t('Validation.pix.keyRequired')),
    })
    .refine(data => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: t('Validation.confirmPassword.mismatch'),
    });

export const registerSelectionSchema = z.object({
  userType: z.enum(['USER', 'STORE']),
});
