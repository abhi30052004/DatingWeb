import React from 'react';
import { SpotlightCard } from '../ui/SpotlightCard';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Create your profile",
      description: "Show people what makes you unique."
    },
    {
      number: "02",
      title: "Discover",
      description: "Swipe through people who match your preferences."
    },
    {
      number: "03",
      title: "Connect",
      description: "Match, chat, and start something real."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your next connection is <span className="text-gradient">three steps away.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <SpotlightCard key={index} className="h-full group">
              <div className="p-10 flex flex-col h-full transform transition-transform duration-500 group-hover:-translate-y-2">
                <div className="text-6xl font-black text-white/5 mb-8 group-hover:text-primary/20 transition-colors duration-500">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-white/60 leading-relaxed text-lg flex-1">
                  {step.description}
                </p>
                
                {/* Decorative line that appears on hover */}
                <div className="h-1 w-0 bg-gradient-to-r from-primary to-secondary mt-8 rounded-full transition-all duration-500 group-hover:w-full" />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};
