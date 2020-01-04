import Joi from '@hapi/joi';

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

const registerValidation = (data: RegisterRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    username: Joi.string()
      .min(6)
      .max(20)
      .pattern(/^[\w-]{6,20}/)
      .required(),
    email: Joi.string()
      .min(6)
      .email()
      .required(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
  });
  return schema.validate(data);
};

const loginValidation = (data: LoginRequest): Joi.ValidationResult => {
  const schema = Joi.object({
    username: Joi.string()
      .min(6)
      .max(20)
      .pattern(/^[\w-]{6,20}/)
      .required(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
  });
  return schema.validate(data);
};

export { registerValidation, loginValidation };
