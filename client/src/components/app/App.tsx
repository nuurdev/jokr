import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container } from 'bloomer';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fetchUser, AuthState } from '../../reducers/auth';
import { RootState } from '../../reducers';
import PrivateRoute from './PrivateRoute';
import Register from '../register';
import Login from '../login';
import Home from '../home';
import ConfirmEmail from '../confirm-email';
import ForgotPassword from '../forgot-password';
import ResetPassword from '../reset-password';
import NotFound from '../not-found';

const App: React.FC = () => {
  const dispatch: ThunkDispatch<RootState, null, Action> = useDispatch();
  const authState: AuthState = useSelector(
    (state: RootState) => state.authState
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (authState.fetchLoading) return <div data-testid="fetching-user" />;

  return (
    <Container>
      <BrowserRouter>
        <Switch>
          <Route exact path="/login">
            {authState.isAuthenticated ? <Redirect to="/" /> : <Login />}
          </Route>
          <Route exact path="/register">
            {authState.isAuthenticated ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route
            exact
            path="/reset-password/:token"
            component={ResetPassword}
          />
          <PrivateRoute
            exact
            authState={authState}
            path={['/', '/account']}
            component={Home}
          />
          <Route exact path="/confirm-email/:token" component={ConfirmEmail} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </Container>
  );
};

export default App;
