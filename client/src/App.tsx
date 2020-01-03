import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import logo from './logo.svg';

const Home: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <div className="App-logo">
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    </header>
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
