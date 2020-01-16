/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-empty-interface */
import React, { Component } from 'react';
import axios from 'axios';
import { Container } from 'bloomer';

interface Props {
  match: any;
}
interface State {
  confirmLoading: boolean;
  confirmed: boolean;
}

class ConfirmEmail extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: true,
      confirmed: false
    };
  }

  componentDidMount() {
    const { token } = this.props.match.params;

    axios
      .post('/api/user/confirm-email', { token })
      .then(() => {
        this.setState({ confirmed: true, confirmLoading: false });
      })
      .catch(() => {
        this.setState({ confirmLoading: false });
      });
  }

  render() {
    const { confirmLoading } = this.state;

    if (confirmLoading) {
      return <p data-testid="loading">Loading...</p>;
    }

    return (
      <div>
        <Container>
          {this.state.confirmed
            ? 'Your email is confirmed!'
            : 'Oops invalid token'}
        </Container>
      </div>
    );
  }
}

export default ConfirmEmail;
