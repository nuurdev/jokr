/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/jsx-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { Container } from 'bloomer';
import { Switch, Route } from 'react-router-dom';

interface Props {
  currentUser: any;
}

class Home extends React.Component<Props, {}> {
  render() {
    const Account = () => <div>Account page</div>;
    const Feed = () => <div>Feed page</div>;

    return (
      <Container>
        <Switch>
          <Route path="/" exact component={Feed} />
          <Route path="/account" exact component={Account} />
        </Switch>
      </Container>
    );
  }
}

export default Home;
