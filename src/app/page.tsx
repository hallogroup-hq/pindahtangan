import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import ValueEstimator from '@/components/landing/ValueEstimator';
import HowItWorks from '@/components/landing/HowItWorks';
import SukabumiCoverage from '@/components/landing/SukabumiCoverage';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ValueEstimator />
      <HowItWorks />
      <SukabumiCoverage />
    </div>
  );
}
