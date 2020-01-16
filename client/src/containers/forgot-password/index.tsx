/* eslint-disable no-alert */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { Component, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Columns,
  Column,
  Box,
  Button,
  Input,
  Field,
  Control,
  Content
} from 'bloomer';
import logo from '../../assets/logo.svg';

interface State {
  email: string;
  loading: boolean;
}

class ForgotPassword extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>): void =>
    this.setState({ email: event.target.value });

  handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    this.setState({ loading: true });

    axios
      .post('api/user/forgot-password', { email: this.state.email })
      .then(() => {
        this.setState({ email: '', loading: false });
        alert('Email sent to you!');
      })
      .catch(() => {
        this.setState({ email: '', loading: false });
        alert('Oops unable to send email');
      });
    // Make axios call
  };

  render() {
    const { email, loading } = this.state;

    return (
      <div>
        <Container>
          <Columns isCentered className="mt-5">
            <Column isSize={{ mobile: 12, desktop: 3 }}>
              <div className="has-text-centered mb-3">
                <img style={{ width: '90px' }} src={logo} alt="logo" />
              </div>
              <Box>
                <form onSubmit={this.handleSubmit}>
                  <Field>
                    <Content>
                      <h6 className="has-text-centered py-1">
                        Forgot your password?
                      </h6>
                      <p>
                        Not to worry, just enter your email below and we will
                        send you an email with a link to create a new password.
                      </p>
                    </Content>
                    <Control>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        placeholder="Email"
                        onChange={this.handleChange}
                      />
                    </Control>
                  </Field>
                  <Button
                    type="submit"
                    isColor="primary"
                    isLoading={loading}
                    isFullWidth
                  >
                    Request reset link
                  </Button>
                </form>
              </Box>
              <Content className="is-size-7 has-text-centered">
                <strong>
                  <Link to="/login">Back to Log In</Link>
                </strong>
              </Content>
            </Column>
          </Columns>
        </Container>
      </div>
    );
  }
}

export default ForgotPassword;
