import React from 'react';
import Navbar from '../sections/Navbar';
import Hero from '../sections/Hero';
import Features from '../sections/Features';
import HowItWorks from '../sections/HowItWorks';
import CTA from '../sections/CTA';
import Footer from '../sections/Footer';

const LandingPage = () => {
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
