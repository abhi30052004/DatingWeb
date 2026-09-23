import AnimatedFooter from '../ui/AnimatedFooter';

export const Footer = () => {
  return (
    <div className="w-full relative bg-background">
      <AnimatedFooter 
        headingLines={["PAIRLY"]} 
        background="transparent" 
        textColor="white" 
        className="!h-96 md:!h-[500px]" 
        parallaxStrength={15}
        charColor="#ec4899"
        hoverColor="#f43f5e"
      />
    </div>
  );
};
