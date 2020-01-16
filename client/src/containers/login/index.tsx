/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { Component, FormEvent, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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
import { LoginRequest, loginUser } from '../../reducers/auth';
import { RootState } from '../../reducers';
import logo from '../../assets/logo.svg';

interface Props extends DispatchProps, StateProps {}
interface State extends LoginRequest {}

class Login extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();

    this.setState(prevState => ({
      ...prevState,
      [event.target.id]: event.target.value
    }));
  };

  handleRegisterSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    this.props.loginUser(this.state);
  };

  render() {
    const { username, password } = this.state;
    const { loginLoading } = this.props.authState;

    return (
      <div>
        <Container>
          <Columns isCentered className="mt-5">
            <Column isSize={{ mobile: 12, desktop: 3 }}>
              <div className="has-text-centered mb-3">
                <img style={{ width: '90px' }} src={logo} alt="logo" />
              </div>
              <Box>
                <form onSubmit={this.handleRegisterSubmit}>
                  <Field>
                    <Content>
                      <h6 className="has-text-centered py-1">Login to Jokr</h6>
                    </Content>
                    <Control>
                      <Input
                        type="text"
                        id="username"
                        value={username}
                        placeholder="Username"
                        onChange={this.handleChange}
                      />
                    </Control>
                  </Field>
                  <Field>
                    <Control>
                      <Input
                        type="password"
                        id="password"
                        value={password}
                        placeholder="Password"
                        onChange={this.handleChange}
                      />
                    </Control>
                  </Field>
                  <Button
                    type="submit"
                    isColor="primary"
                    isLoading={loginLoading}
                    isFullWidth
                  >
                    Login
                  </Button>
                </form>
              </Box>
              <Content className="is-size-7 has-text-centered">
                New to Jokr?
                <strong>
                  <Link to="/register">Create an account</Link>
                </strong>
              </Content>
            </Column>
          </Columns>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = { loginUser };
const mapStateToProps = (storeState: RootState): any => ({
  authState: storeState.authState
});

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Login);
