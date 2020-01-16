/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  newPassword: string;
  newPasswordConfirm: string;
  loading: boolean;
  tokenLoading: boolean;
  tokenValid: boolean;
}

interface Props {
  match: any;
}

class ResetPassword extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: '',
      newPasswordConfirm: '',
      loading: false,
      tokenLoading: false,
      tokenValid: false
    };
  }

  componentDidMount() {
    const { token } = this.props.match.params;

    // Confirm if token is valid
    this.setState({ tokenLoading: true });
    axios
      .get('/api/user/reset-password', { params: { token } })
      .then(() => {
        this.setState({ tokenLoading: false, tokenValid: true });
      })
      .catch(() => {
        this.setState({ tokenLoading: false, tokenValid: false });
      });
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    this.setState(prevState => ({
      ...prevState,
      [event.target.id]: event.target.value
    }));
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const { token } = this.props.match.params;
    const { newPassword, newPasswordConfirm } = this.state;

    this.setState({ loading: true });

    axios
      .post('/api/user/reset-password', {
        newPassword,
        newPasswordConfirm,
        token
      })
      .then(() => {
        this.setState({
          newPassword: '',
          newPasswordConfirm: '',
          loading: false
        });
        alert(
          'Password updated successfully. Take your new password for a spin!'
        );
      })
      .catch(() => {
        this.setState({
          newPassword: '',
          newPasswordConfirm: '',
          loading: false
        });
        alert('Oops unable to update password');
      });
  };

  render() {
    const {
      newPassword,
      newPasswordConfirm,
      loading,
      tokenLoading,
      tokenValid
    } = this.state;

    if (tokenLoading) {
      return <div>Verifying token...</div>;
    }

    return (
      <div>
        <Container>
          {tokenValid ? (
            <Columns isCentered className="mt-5">
              <Column isSize={{ mobile: 12, desktop: 3 }}>
                <div className="has-text-centered mb-3">
                  <img style={{ width: '90px' }} src={logo} alt="logo" />
                </div>
                <Box>
                  <form onSubmit={this.handleSubmit}>
                    <Content>
                      <h6 className="has-text-centered py-1">
                        Set new password
                      </h6>
                    </Content>
                    <Field>
                      <Control>
                        <Input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          placeholder="New password"
                          onChange={this.handleChange}
                        />
                      </Control>
                    </Field>
                    <Field>
                      <Control>
                        <Input
                          type="password"
                          id="newPasswordConfirm"
                          value={newPasswordConfirm}
                          placeholder="Confirm new password"
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
                      Set new password
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
          ) : (
            <div>Oops token is invalid</div>
          )}
        </Container>
      </div>
    );
  }
}

export default ResetPassword;
