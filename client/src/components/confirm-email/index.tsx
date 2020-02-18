import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Hero, HeroBody, Title } from 'bloomer';
import { Link, useParams } from 'react-router-dom';

const ConfirmEmail: React.FC = () => {
  const [confirmed, setConfirmed] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(true);
  const { token } = useParams();

  useEffect(() => {
    axios
      .post('/api/user/confirm-email/', { token })
      .then(() => {
        setConfirmed(true);
        setConfirmLoading(false);
      })
      .catch(() => {
        setConfirmLoading(false);
      });
  }, [token]);

  if (confirmLoading) {
    return <div data-testid="verifying-email-token" />;
  }

  return (
    <Hero isFullHeight>
      <HeroBody>
        <Container hasTextAlign="centered">
          {confirmed ? (
            <div data-testid="email-confirm-valid">
              <Title isSize={1}>Good news!</Title>
              <Title isSize={2} hasTextColor="grey">
                Your email has been confirmed
              </Title>
              <Link to="/">Back to application</Link>
            </div>
          ) : (
            <div data-testid="email-confirm-invalid">
              <Title isSize={2}>
                That link did not work
                <span className="ml-2" role="img" aria-label="anguish">
                  😧
                </span>
              </Title>
              <Title isSize={4} hasTextColor="grey">
                Sorry, your email authentication link is expired or invalid.
              </Title>
              {/* <Link to="/confirm-email" className="mr-3">
                Request new link
              </Link> */}
              <Link to="/">Back to application</Link>
            </div>
          )}
        </Container>
      </HeroBody>
    </Hero>
  );
};

export default ConfirmEmail;
