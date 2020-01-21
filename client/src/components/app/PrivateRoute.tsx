/* eslint-disable react/prop-types */
import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { AuthState } from '../../reducers/auth';

interface PrivateRouteProps extends RouteProps {
  authState: AuthState;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  authState,
  ...rest
}) => {
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
