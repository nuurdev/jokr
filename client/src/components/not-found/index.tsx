import React from 'react';
import { Title, HeroBody, Container } from 'bloomer';
import { Hero } from 'bloomer/lib/layout/Hero/Hero';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <Hero isFullHeight>
    <HeroBody>
      <Container hasTextAlign="centered">
        <Title isSize={2}>
          404
          <span className="ml-2" role="img" aria-label="sob">
            😭
          </span>
        </Title>
        <Title isSize={3} hasTextColor="grey">
          Oops, page not found.
        </Title>
        <Link to="/">Back to application</Link>
      </Container>
    </HeroBody>
  </Hero>
);

export default NotFound;
