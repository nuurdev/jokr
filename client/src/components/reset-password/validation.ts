import * as Yup from 'yup';

const resetPasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be 8 characters or more')
    .max(1024, 'Password is too long')
    .matches(/[a-zA-Z]+/, 'Password must contain a letter')
    .matches(/[\d]+/, 'Password must contain a number')
    .required('Password is required'),
  newPasswordConfirm: Yup.string()
    .required('Password confirm is required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
});

export default resetPasswordSchema;
