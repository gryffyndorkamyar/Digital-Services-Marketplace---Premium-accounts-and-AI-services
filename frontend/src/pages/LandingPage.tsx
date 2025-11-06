import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import Stats from '../components/Stats';
import CTA from '../components/CTA';

const LandingPage: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Services />
      <Stats />
      <CTA />
    </>
  );
};

export default LandingPage;

