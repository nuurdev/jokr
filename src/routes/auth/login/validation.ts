// import Joi from '@hapi/joi';
// import { LoginRequest } from '../types';

// const loginValidation = (data: LoginRequest): Joi.ValidationResult => {
//   const schema = Joi.object({
//     username: Joi.string()
//       .min(6)
//       .max(20)
//       .pattern(/^[\w-]{6,20}/)
//       .required(),
//     password: Joi.string()
//       .min(8)
//       .max(1024)
//       .pattern(/^(?=.*\d)(?=.*[a-zA-Z])[^\s]{8,1024}$/)
//       .required()
//   });
//   return schema.validate(data);
// };

// export default loginValidation;
