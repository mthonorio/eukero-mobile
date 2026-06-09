import { z } from 'zod';

import { isValidPhone } from '../register/register.helpers';

export const profileSettingsSchema = z
  .object({
    name: z.string().trim().min(3, 'Informe o nome completo.'),
    username: z.string().trim().min(3, 'Informe o username.'),
    storeName: z.string().trim().optional(),
    phone: z.string().trim().refine(isValidPhone, 'Informe um telefone válido.'),
    email: z.email('Informe um e-mail válido.'),
    newPassword: z.string().optional(),
    confirmNewPassword: z.string().optional(),
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
