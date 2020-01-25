import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import {
  Container,
  Columns,
  Column,
  Box,
  Button,
  Input,
  Content,
  Notification,
  Delete,
  Title,
  HeroBody,
  Hero
} from 'bloomer';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import resetPasswordSchema from './validation';
import logo from '../../assets/logo.svg';
import { logoutUser } from '../../reducers/auth';

const ResetPassword: React.FC = () => {
  const [verifyingToken, setVerifyingToken] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
    axios
      .get('/api/user/reset-password', { params: { token } })
      .then(() => {
        setValidToken(true);
        setVerifyingToken(false);
      })
      .catch(() => {
        setVerifyingToken(false);
      });
  }, [dispatch, token]);

  if (verifyingToken) {
    return <div data-testid="verifying-password-token" />;
  }

  return (
    <Container className="resetpassword-container">
      {validToken ? (
        <Columns isCentered className="mt-5">
          <Column
            isSize={{ mobile: 12, desktop: 4 }}
            style={{ maxWidth: 360, margin: '0 auto' }}
          >
            <div className="mb-4 has-text-centered">
              <img style={{ width: '90px' }} src={logo} alt="logo" />
            </div>
            <Box>
              <Content>
                <h6 className="has-text-centered pt-1">Reset password</h6>
              </Content>
              <Formik
                initialValues={{ newPassword: '', newPasswordConfirm: '' }}
                validationSchema={resetPasswordSchema}
                validateOnBlur={false}
                validateOnChange={false}
                initialStatus={{ error: '', success: '' }}
                onSubmit={async (data, { setSubmitting, setStatus }) => {
                  setSubmitting(true);

                  return axios
                    .post('/api/user/reset-password/', { ...data, token })
                    .then(() => {
                      // Could use message from server
                      setStatus({ success: 'Password updated successfully' });
                    })
                    .catch(err => {
                      const { message } = err.response.data;
                      return message
                        ? setStatus({ error: message })
                        : setStatus({ error: 'Something went wrong' });
                    });
                }}
              >
                {({ isSubmitting, errors, touched, setStatus, status }) => (
                  <Form>
                    {status.error ? (
                      <Notification className="is-danger is-light is-small">
                        <Delete onClick={() => setStatus({ error: '' })} />
                        {status.error}
                      </Notification>
                    ) : null}
                    {status.success ? (
                      <Notification className="is-success is-light is-small">
                        <Delete onClick={() => setStatus({ success: '' })} />
                        {status.success}
                      </Notification>
                    ) : null}
                    {errors.newPassword && touched.newPassword ? (
                      <div className="has-text-danger is-size-7 mb-1">
                        {errors.newPassword}
                      </div>
                    ) : null}
                    <Field
                      name="newPassword"
                      placeholder="New password"
                      type="password"
                      className="mb-3"
                      as={Input}
                    />
                    {errors.newPasswordConfirm && touched.newPasswordConfirm ? (
                      <div className="has-text-primary is-size-7 mb-1">
                        {errors.newPasswordConfirm}
                      </div>
                    ) : null}
                    <Field
                      name="newPasswordConfirm"
                      placeholder="Confirm password"
                      type="password"
                      className="mb-3"
                      as={Input}
                    />
                    <Button
                      type="submit"
                      isColor="primary"
                      isLoading={isSubmitting}
                      isFullWidth
                    >
                      Set new password
                    </Button>
                  </Form>
                )}
              </Formik>
            </Box>
            <Content className="is-size-7 has-text-centered">
              <strong>
                <Link to="/login">Back to Log In</Link>
              </strong>
            </Content>
          </Column>
        </Columns>
      ) : (
        <Hero isFullHeight>
          <HeroBody>
            <Container hasTextAlign="centered">
              <div>
                <Title isSize={2}>
                  That link did not work
                  <span className="ml-2" role="img" aria-label="anguish">
                    😧
                  </span>
                </Title>
                <Title isSize={4} hasTextColor="grey">
                  Sorry, your password reset link is expired or invalid.
                </Title>
                <Link to="/forgot-password" className="mr-3">
                  Request new link
                </Link>
                <Link to="/">Back to application</Link>
              </div>
            </Container>
          </HeroBody>
        </Hero>
      )}
    </Container>
  );
};

export default ResetPassword;
