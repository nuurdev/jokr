import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, authState, ...rest }) => {
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
