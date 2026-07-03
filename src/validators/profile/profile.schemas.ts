import { z } from 'zod';
import type { TFunction } from 'i18next';

import { isValidCpfOrCnpj, isValidPhone } from '../register/register.helpers';

export const createProfileSettingsSchema = (t: TFunction) =>
  z
    .object({
      name: z.string().trim().min(3, t('Validation.name.required')),
      username: z.string().trim().min(3, t('Validation.username.required')),
      storeName: z.string().trim().optional(),
      phone: z.string().trim().refine(isValidPhone, t('Validation.phone.invalid')),
      email: z.email(t('Validation.email.invalid')),
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
            message: t('Validation.pix.ownerNameRequired'),
          });
        }
        if (!data.pixKey) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['pixKey'],
            message: t('Validation.pix.keyRequired'),
          });
        }
        if (!data.pixDocument) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['pixDocument'],
            message: t('Validation.pix.documentRequired'),
          });
        }
      } else if (filledPixFields.length === 3 && !isValidCpfOrCnpj(data.pixDocument)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['pixDocument'],
          message: t('Validation.pix.documentInvalid'),
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
          message: t('Validation.password.weak'),
        });
        return;
      }

      if (pwd !== data.confirmNewPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['confirmNewPassword'],
          message: t('Validation.confirmPassword.mismatch'),
        });
      }
    });

export type ProfileSettingsFormValues = z.infer<ReturnType<typeof createProfileSettingsSchema>>;
