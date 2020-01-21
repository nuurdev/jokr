import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required')
});

export default forgotPasswordSchema;
