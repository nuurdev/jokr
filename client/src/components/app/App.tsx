/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container, Columns, Column, Box, Button } from 'bloomer';
import logo from '../../assets/logo.svg';

const Home: React.FC = () => (
  <div>
    <Container>
      <Columns isCentered className="mt-5">
        <Column isSize={{ mobile: 12, desktop: 3 }}>
          <div style={{ textAlign: 'center' }}>
            <img style={{ width: '90px' }} src={logo} alt="logo" />
          </div>
          <Box>
            <Button isColor="primary" isFullWidth>
              Log In
            </Button>
          </Box>
        </Column>
      </Columns>
    </Container>
  </div>
);

const NotFound: React.FC = () => <div>404 Page not found</div>;

// eslint-disable-next-line react/prefer-stateless-function
class App extends React.Component<{}, {}> {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
