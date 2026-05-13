import React from 'react';
import Navbar from '../sections/Navbar';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import HowItWorks from '../sections/HowItWorks';
import CTA from '../sections/CTA';
import Footer from '../sections/Footer';
import useScrollReveal from '../services/useScrollReveal';

const LandingPage = () => {
  useScrollReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </>
  );
};

export default LandingPage;
