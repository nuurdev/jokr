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
import { RegisterRequest, registerUser } from '../../reducers/auth';
import { RootState } from '../../reducers';
import logo from '../../assets/logo.svg';

interface Props extends DispatchProps, StateProps {}
interface State extends RegisterRequest {}

class Register extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
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

    this.props.registerUser(this.state);
  };

  render() {
    const { username, email, password } = this.state;
    const { registerLoading } = this.props.authState;

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
                      <h6 className="has-text-centered py-1">
                        Create an account
                      </h6>
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
                        type="email"
                        id="email"
                        value={email}
                        placeholder="Email"
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
                    isLoading={registerLoading}
                    isFullWidth
                  >
                    Register
                  </Button>
                </form>
              </Box>
              <Content className="is-size-7 has-text-centered">
                Already have an account?
                <strong>
                  <Link to="/login">Log In</Link>
                </strong>
              </Content>
            </Column>
          </Columns>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = { registerUser };
const mapStateToProps = (storeState: RootState): any => ({
  authState: storeState.authState
});

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Register);
