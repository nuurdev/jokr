import React from 'react';
import { Container, Title, Section } from 'bloomer';
import { Switch, Route, RouteProps } from 'react-router-dom';
import { User } from '../../reducers/auth';
import Nav from '../navbar';

interface Props extends RouteProps {
  currentUser: User;
}

const Account = () => <Title isSize={4}>Account page</Title>;
const Notifications = () => <Title isSize={4}>Notifications</Title>;
const Feed = () => <Title isSize={4}>Feed page</Title>;

const Home: React.FC<Props> = () => {
  return (
    <div data-testid="home">
      <Section className="p-0">
        <Nav />
      </Section>
      <Section className="px-3">
        <Container>
          <Switch>
            <Route path="/" exact component={Feed} />
            <Route path="/account" exact component={Account} />
            <Route path="/notifications" exact component={Notifications} />
          </Switch>
        </Container>
      </Section>
    </div>
  );
};

export default Home;
