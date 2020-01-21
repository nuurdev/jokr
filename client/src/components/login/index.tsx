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
import { loginUser } from '../../reducers/auth';
import { RootState } from '../../reducers';
import logo from '../../assets/logo.svg';
import loginSchema from './validation';

const Login: React.FC = () => {
  const dispatch: ThunkDispatch<RootState, null, Action> = useDispatch();
  return (
    <Container className="login-container">
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
              <h6 className="has-text-centered pt-1">Log in to Jokr</h6>
            </Content>
            <Formik
              initialValues={{ username: '', password: '' }}
              validationSchema={loginSchema}
              validateOnBlur={false}
              validateOnChange={false}
              initialStatus={{ error: '' }}
              onSubmit={async (data, { setSubmitting, setStatus }) => {
                setSubmitting(true);
                const res = await dispatch(loginUser({ ...data }));
                // setSubmitting(false) react memory leak error
                // Error not being catched hence this approach
                if (res.data.message) {
                  setStatus({ error: res.data.message });
                }
              }}
            >
              {({ isSubmitting, errors, touched, setStatus, status }) => (
                <Form>
                  {status.error ? (
                    <Notification
                      isColor="danger"
                      className="notification is-light is-small"
                    >
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
                  {errors.password && touched.password ? (
                    <div className="has-text-primary is-size-7 mb-1">
                      {errors.password}
                    </div>
                  ) : null}
                  <Field
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="mb-2"
                    as={Input}
                  />
                  <div className="is-size-7 mb-3 is-pulled-right">
                    <Link to="/forgot-password">Forgot password</Link>
                  </div>
                  <Button
                    type="submit"
                    isColor="primary"
                    isLoading={isSubmitting}
                    isFullWidth
                  >
                    Log in
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
          <Content className="is-size-7 has-text-centered">
            <span className="mr-1">New to Jokr?</span>
            <strong>
              <Link to="/register">Create an account</Link>
            </strong>
          </Content>
        </Column>
      </Columns>
    </Container>
  );
};

export default Login;
