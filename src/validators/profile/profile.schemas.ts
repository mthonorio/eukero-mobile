import { z } from 'zod';

import { isValidCpfOrCnpj, isValidPhone } from '../register/register.helpers';

export const profileSettingsSchema = z
  .object({
    name: z.string().trim().min(3, 'Informe o nome completo.'),
    username: z.string().trim().min(3, 'Informe o username.'),
    storeName: z.string().trim().optional(),
    phone: z.string().trim().refine(isValidPhone, 'Informe um telefone válido.'),
    email: z.email('Informe um e-mail válido.'),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
    pixOwnerName: z.string().trim().optional().default(''),
    pixKey: z.string().trim().optional().default(''),
    pixDocument: z.string().trim().optional().default(''),
  })
  .superRefine((data, ctx) => {
    const pixFields = [data.pixOwnerName, data.pixKey, data.pixDocument];
    const filledPixFields = pixFields.filter(value => value && value.length > 0);

    if (filledPixFields.length > 0 && filledPixFields.length < 3) {
      if (!data.pixOwnerName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pixOwnerName'],
          message: 'Informe o nome do titular.',
        });
      }
      if (!data.pixKey) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pixKey'],
          message: 'Informe a chave Pix.',
        });
      }
      if (!data.pixDocument) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pixDocument'],
          message: 'Informe o CPF ou CNPJ.',
        });
      }
    } else if (filledPixFields.length === 3 && !isValidCpfOrCnpj(data.pixDocument)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pixDocument'],
        message: 'Informe um CPF ou CNPJ válido.',
      });
    }
  })
  .superRefine((data, ctx) => {
    const pwd = data.newPassword;
    if (!pwd || pwd.length === 0) return;

    const isStrong =
      pwd.length >= 8 &&
      /[a-z]/.test(pwd) &&
      /[A-Z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd);

    if (!isStrong) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPassword'],
        message: 'Use 8+ caracteres, com maiúscula, minúscula, número e símbolo.',
      });
      return;
    }

    if (pwd !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmNewPassword'],
        message: 'As senhas não coincidem.',
      });
    }
  });

export type ProfileSettingsFormValues = z.infer<typeof profileSettingsSchema>;
