import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Home: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <p>Application</p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
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
