import Joi from '@hapi/joi';
import { RegisterRequest } from '../types';

const registerValidation = (data: RegisterRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    username: Joi.string()
      .min(6)
      .max(20)
      .pattern(/^[\w-]{6,20}$/)
      .required(),
    email: Joi.string()
      .min(6)
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      // Min 8 || 1 Upper || 1 Lower || 1 Number || no space
      .pattern(/^(?=.*\d)(?=.*[a-zA-Z])[^\s]{8,1024}$/)
      .required()
  });
  return schema.validate(data);
};

export default registerValidation;
