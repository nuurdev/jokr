import Joi from '@hapi/joi';
import { ForgotPasswordRequest, ResetPasswordRequest } from '../types';

const forgotPasswordValidation = (
  data: ForgotPasswordRequest
): Joi.ValidationResult => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .email()
      .required()
  });
  return schema.validate(data);
};

const resetPasswordValidation = (
  data: ResetPasswordRequest
): Joi.ValidationResult => {
  const schema = Joi.object({
    newPassword: Joi.string()
      .min(8)
      .max(1024)
      // Min 8 || 1 Upper || 1 Lower || 1 Number || no space
      .pattern(/^(?=.*\d)(?=.*[a-zA-Z])[^\s]{8,1024}$/)
      .required(),
    newPasswordConfirm: Joi.string().required(),
    token: Joi.string().required()
  });
  return schema.validate(data);
};

export { forgotPasswordValidation, resetPasswordValidation };
