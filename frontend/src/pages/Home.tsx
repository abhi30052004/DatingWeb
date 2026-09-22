
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { SocialProof } from '../components/landing/SocialProof';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { DiscoverSection } from '../components/landing/DiscoverSection';
import { CompatibilitySection } from '../components/landing/CompatibilitySection';
import { MatchingExperience } from '../components/landing/MatchingExperience';
import { ChatSimulation } from '../components/landing/ChatSimulation';
import { SafetySection } from '../components/landing/SafetySection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { FinalCTA } from '../components/landing/FinalCTA';
import { Footer } from '../components/landing/Footer';

export default function Home() {
  return (
    <div className="bg-background text-white min-h-screen">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <HowItWorksSection />
      <DiscoverSection />
      <CompatibilitySection />
      <MatchingExperience />
      <ChatSimulation />
      <SafetySection />
      <TestimonialsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
