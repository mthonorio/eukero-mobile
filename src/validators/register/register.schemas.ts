import { z } from 'zod';

import {
  isValidCep,
  isValidCpf,
  isValidCpfOrCnpj,
  isValidPhone,
} from './register.helpers';

const passwordSchema = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .regex(/[a-z]/, 'A senha deve conter uma letra minúscula.')
  .regex(/[A-Z]/, 'A senha deve conter uma letra maiúscula.')
  .regex(/\d/, 'A senha deve conter um número.')
  .regex(/[^A-Za-z0-9]/, 'A senha deve conter um caractere especial.');

const emailSchema = z.email('Informe um e-mail válido.');

const phoneSchema = z
  .string()
  .trim()
  .refine(isValidPhone, 'Informe um telefone válido.');

const personDocumentSchema = z
  .string()
  .trim()
  .refine(isValidCpf, 'Informe um CPF válido.');

const storeDocumentSchema = z
  .string()
  .trim()
  .refine(isValidCpfOrCnpj, 'Informe um CPF ou CNPJ válido.');

const registerAddressSchema = z.object({
  cep: z.string().trim().refine(isValidCep, 'Informe um CEP válido.'),
  address: z.string().trim().min(3, 'Informe o endereço.'),
  number: z.string().trim().min(1, 'Informe o número.'),
  complement: z.string().trim().optional().default(''),
  neighborhood: z.string().trim().min(2, 'Informe o bairro.'),
  city: z.string().trim().min(2, 'Informe a cidade.'),
  state: z.string().trim().length(2, 'Informe a UF.'),
});

export const registerPersonSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
    name: z.string().trim().min(3, 'Informe o nome completo.'),
    phone: phoneSchema,
    userType: z.literal('USER'),
    document: personDocumentSchema,
    pixKey: z.string().trim().min(1, 'Informe a chave Pix.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  });

export const registerStoreSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
    name: z.string().trim().min(3, 'Informe o nome completo.'),
    phone: phoneSchema,
    userType: z.literal('STORE'),
    storeName: z.string().trim().min(2, 'Informe o nome da loja.'),
    document: storeDocumentSchema,
    address: registerAddressSchema,
    pixKey: z.string().trim().min(1, 'Informe a chave Pix.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  });

export const registerSelectionSchema = z.object({
  userType: z.enum(['USER', 'STORE']),
});
