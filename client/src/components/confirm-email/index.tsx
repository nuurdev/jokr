import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Hero, HeroBody, Title, Box } from 'bloomer';
import { Link, useParams } from 'react-router-dom';

const ConfirmEmail: React.FC = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(true);
  const { token } = useParams();

  useEffect(() => {
    axios
      .post('/api/user/confirm-email', { token })
      .then(() => {
        setConfirmed(true);
        setConfirmLoading(false);
      })
      .catch(() => {
        setConfirmLoading(false);
      });
  }, [token]);

  if (confirmLoading) {
    return <p data-testid="loading">Verifying token...</p>;
  }

  return (
    <Hero isFullHeight>
      <HeroBody>
        <Container hasTextAlign="centered">
          {confirmed ? (
            <Box>
              <Title isSize={1}>Good news!</Title>
              <Title isSize={2} hasTextColor="grey">
                Your email has been confirmed
              </Title>
              <Link to="/">Back to application</Link>
            </Box>
          ) : (
            <Box>
              <Title isSize={1}>Oh no!</Title>
              <Title isSize={2} hasTextColor="grey">
                That token did not work
                <span role="img" aria-label="anguish">
                  😧
                </span>
              </Title>
              <Link to="/">Back to application</Link>
            </Box>
          )}
        </Container>
      </HeroBody>
    </Hero>
  );
};

export default ConfirmEmail;
