import AnimatedFooter from '../ui/AnimatedFooter';

export const Footer = () => {
  return (
    <div className="w-full relative bg-background flex flex-col">
      <AnimatedFooter 
        headingLines={["PAIRLY"]} 
        background="transparent" 
        textColor="white" 
        className="!h-96 md:!h-[500px]" 
        parallaxStrength={15}
        charColor="#ec4899"
        hoverColor="#f43f5e"
      />
      
      {/* Copyright and Social Media Bar */}
      <div className="border-t border-white/20 py-8 px-6 relative z-50 bg-black text-white w-full">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white text-sm order-2 md:order-1 text-center md:text-left font-medium">
            <p>Strictly Copyright © {new Date().getFullYear()} Pairly. All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-8 order-1 md:order-2">
            <a href="#" aria-label="Instagram" className="text-white hover:text-primary transition-colors flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span className="hidden md:inline text-sm font-medium">Instagram</span>
            </a>
            <a href="#" aria-label="Twitter" className="text-white hover:text-primary transition-colors flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              <span className="hidden md:inline text-sm font-medium">Twitter</span>
            </a>
            <a href="#" aria-label="Facebook" className="text-white hover:text-primary transition-colors flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <span className="hidden md:inline text-sm font-medium">Facebook</span>
            </a>
            <a href="#" aria-label="YouTube" className="text-white hover:text-primary transition-colors flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.1C2.5 7.1 2.3 5.4 3 4.6c.9-1 1.8-1 2.3-1 3.2-.2 8.7-.2 8.7-.2s5.5 0 8.7.2c.5 0 1.4 0 2.3 1 .7.8 1 2.5 1 2.5s.2 2 .2 4.1v1.6c0 2.1-.2 4.1-.2 4.1s-.2 1.7-1 2.5c-.9 1-2 1-2.5 1.1-3.6.3-8.5.2-8.5.2s-5.5 0-8.7-.2c-.5 0-1.4 0-2.3-1-.7-.8-1-2.5-1-2.5s-.2-2-.2-4.1V11c0-2.1.2-4.1.2-4.1z"/><polygon points="9.7 15.5 15.6 11.5 9.7 7.5 9.7 15.5"/></svg>
              <span className="hidden md:inline text-sm font-medium">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
