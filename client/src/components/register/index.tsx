import React from 'react';
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
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { registerUser } from '../../reducers/auth';
import { RootState } from '../../reducers';
import registerSchema from './validation';
import logo from '../../assets/logo.svg';

const Register: React.FC = () => {
  const dispatch: ThunkDispatch<RootState, null, Action> = useDispatch();

  return (
    <Container className="register-container">
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
              <h6 className="has-text-centered pt-1">Join Jokr</h6>
            </Content>
            <Formik
              initialValues={{ username: '', email: '', password: '' }}
              validationSchema={registerSchema}
              validateOnBlur={false}
              validateOnChange={false}
              initialStatus={{ error: '' }}
              onSubmit={async (data, { setSubmitting, setStatus }) => {
                setSubmitting(true);
                dispatch(registerUser({ ...data })).catch(err => {
                  setSubmitting(false);
                  setStatus({ error: err.message });
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
                  {errors.username && touched.username ? (
                    <div className="has-text-danger is-size-7 mb-1">
                      {errors.username}
                    </div>
                  ) : null}
                  <Field
                    name="username"
                    placeholder="Username"
                    type="text"
                    className="mb-3"
                    as={Input}
                  />
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
                  {errors.password && touched.password ? (
                    <div className="has-text-primary is-size-7 mb-1">
                      {errors.password}
                    </div>
                  ) : null}
                  <Field
                    name="password"
                    placeholder="Password"
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
                    Create an account
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
          <Content className="is-size-7 has-text-centered">
            <span className="mr-1">Already have an account?</span>
            <strong>
              <Link to="/login">Log in</Link>
            </strong>
          </Content>
        </Column>
      </Columns>
    </Container>
  );
};

export default Register;
