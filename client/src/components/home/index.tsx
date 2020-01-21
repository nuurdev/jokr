import React from 'react';
import { Container, Button } from 'bloomer';
import { Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { User, logoutUser } from '../../reducers/auth';

interface Props {
  currentUser: User;
}

const Account = () => <div>Account page</div>;
const Feed = () => <div>Feed page</div>;

const Home: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch();

  return (
    <Container>
      <div>{props.currentUser.username}</div>
      <Button
        type="submit"
        isColor="dark"
        onClick={() => dispatch(logoutUser())}
      >
        Log out
      </Button>
      <Switch>
        <Route path="/" exact component={Feed} />
        <Route path="/account" exact component={Account} />
      </Switch>
    </Container>
  );
};

export default Home;
