import * as Yup from 'yup';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(6, 'Username must be 6 characters or more')
    .max(20, 'Username must be 20 characters or less')
    .matches(/^\S+$/, 'Username cannot have spaces')
    .matches(/^[\w-]{1,}$/, 'Username cannot have special characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be 8 characters or more')
    .max(1024, 'Password is too long')
    .matches(/[a-zA-Z]+/, 'Password must contain a letter')
    .matches(/[\d]+/, 'Password must contain a number')
    .required('Password is required')
});

export default registerSchema;
