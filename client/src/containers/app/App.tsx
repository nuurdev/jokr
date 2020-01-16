/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'bloomer';
import { fetchUser } from '../../reducers/auth';
import { RootState } from '../../reducers';
import Register from '../register';
import Login from '../login';
import Home from '../home';
import ConfirmEmail from '../confirm-email';

interface Props extends DispatchProps, StateProps {}

class App extends React.Component<Props, {}> {
  componentDidMount() {
    this.props.fetchUser();
  }

  // Useful for when jokes are introduced in redux state
  shouldComponentUpdate(nextProps) {
    return (
      this.props.authState.isAuthenticated !==
        nextProps.authState.isAuthenticated ||
      this.props.authState.fetchLoading !== nextProps.authState.fetchLoading
    );
  }

  render() {
    const ForgotPassword = () => <div>Forgot password</div>;
    const ResetPassword = () => <div>Reset password</div>;
    const NotFound = () => <div>404 not found</div>;

    if (this.props.authState.fetchLoading) {
      return <p data-testid="loading">Loading...</p>;
    }

    function PrivateRoute({ component: Component, authState, ...rest }) {
      return (
        <Route
          {...rest}
          render={props =>
            authState.isAuthenticated ? (
              <Component currentUser={authState.currentUser} {...props} />
            ) : (
              <Redirect
                to={{ pathname: '/login', state: { from: props.location } }}
              />
            )
          }
        />
      );
    }

    return (
      <Container>
        <BrowserRouter>
          <Switch>
            <Route exact path="/login">
              {this.props.authState.isAuthenticated ? (
                <Redirect to="/" />
              ) : (
                <Login />
              )}
            </Route>
            <Route exact path="/register">
              {this.props.authState.isAuthenticated ? (
                <Redirect to="/" />
              ) : (
                <Register />
              )}
            </Route>
            <PrivateRoute
              exact
              authState={this.props.authState}
              path={['/', '/account']}
              component={Home}
            />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
              exact
              path="/reset-password/:token"
              component={ResetPassword}
            />
            <Route
              exact
              path="/confirm-email/:token"
              component={ConfirmEmail}
            />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </Container>
    );
  }
}

const mapDispatchToProps = { fetchUser };
const mapStateToProps = (storeState: RootState) => ({
  authState: storeState.authState
});

type DispatchProps = typeof mapDispatchToProps;
type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(App);
