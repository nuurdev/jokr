import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Container,
  Columns,
  Column,
  Box,
  Button,
  Input,
  Content,
  Notification,
  Delete
} from 'bloomer';
import axios from 'axios';
import forgotPasswordSchema from './validation';
import logo from '../../assets/logo.svg';
import { logoutUser } from '../../reducers/auth';
import { getClassName, getDataTestId } from '../../utils/get-attributes';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return (
    <Container className="forgotpassword-container">
      <Columns isCentered className="mt-5">
        <Column
          isSize={{ mobile: 12, desktop: 4 }}
          style={{ maxWidth: 360, margin: '0 auto' }}
        >
          <div className="mb-4 has-text-centered">
            <img style={{ width: '90px' }} src={logo} alt="logo" />
          </div>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            validateOnBlur={false}
            validateOnChange={false}
            initialStatus={{ message: '', status: '' }}
            onSubmit={(data, { setSubmitting, setStatus }) => {
              setSubmitting(true);
              return axios
                .post('/api/user/forgot-password/', { ...data })
                .then(res => {
                  const { status } = res;
                  const { message } = res.data;
                  setStatus({ message, status });
                })
                .catch(err => {
                  const { message } = err.response.data;
                  const { status } = err.response;
                  setStatus({ message, status });
                });
            }}
          >
            {({ isSubmitting, errors, touched, setStatus, status }) => (
              <Box>
                <Content>
                  <h6 className="has-text-centered pt-1">Forgot password</h6>
                  {status.message ? (
                    <Notification
                      data-testid={getDataTestId(status.status)}
                      className={getClassName(status.status)}
                      role="alert"
                    >
                      <Delete
                        onClick={() => setStatus({ message: '', status: '' })}
                      />
                      {status.message}
                    </Notification>
                  ) : null}
                  <p>
                    Not to worry, just enter your email below and we will send
                    you an email with a link to reset your password.
                  </p>
                </Content>
                <Form>
                  {errors.email && touched.email ? (
                    <div className="has-text-danger is-size-7 mb-1">
                      {errors.email}
                    </div>
                  ) : null}
                  <Field
                    name="email"
                    placeholder="Email"
                    type="text"
                    className="mb-3"
                    as={Input}
                  />
                  <Button
                    type="submit"
                    isColor="primary"
                    isLoading={isSubmitting}
                    isFullWidth
                  >
                    Request reset link
                  </Button>
                </Form>
              </Box>
            )}
          </Formik>
          <Content className="is-size-7 has-text-centered">
            <strong>
              <Link to="/">Back to application</Link>
            </strong>
          </Content>
        </Column>
      </Columns>
    </Container>
  );
};

export default ForgotPassword;
