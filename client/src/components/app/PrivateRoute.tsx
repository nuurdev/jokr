import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthState } from '../../reducers/auth';

interface Props extends RouteProps {
  // Remove any
  component: React.FC<any>;
  authState: AuthState;
}

const PrivateRoute = ({ component: Component, authState, ...rest }: Props) => {
  return (
    <Route
      {...rest}
      render={(props: any) =>
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
};

export default PrivateRoute;
