import React from 'react';
import { Title, HeroBody, Container } from 'bloomer';
import { Hero } from 'bloomer/lib/layout/Hero/Hero';

const NotFound: React.FC = () => (
  <Hero isFullHeight>
    <HeroBody>
      <Container hasTextAlign="centered">
        <Title isSize={1}>404</Title>
        <Title isSize={2} hasTextColor="grey">
          Oops, page not found
        </Title>
      </Container>
    </HeroBody>
  </Hero>
);

export default NotFound;
