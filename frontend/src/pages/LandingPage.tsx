import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Services from '../components/Services';
import Stats from '../components/Stats';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-dark">
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <Stats />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;

