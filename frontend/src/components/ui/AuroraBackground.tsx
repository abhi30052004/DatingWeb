

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: React.ReactNode;
}

export const AuroraBackground = ({ children, className = '', ...props }: AuroraBackgroundProps) => {
  return (
    <div
      className={`relative flex flex-col h-[100vh] items-center justify-center bg-background text-white transition-bg ${className}`}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="
            absolute -inset-[10px] opacity-50 will-change-transform
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,#ec4899_10%,#8b5cf6_20%,#3b82f6_30%,#ec4899_40%)]
            [background-image:var(--aurora)]
            [background-size:300%,_200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[50px]
            animate-aurora
            after:content-['']
            after:absolute
            after:inset-0
            after:[background-image:var(--dark-gradient)]
            after:[background-size:200%,_100%]
            after:mix-blend-overlay
          "
        ></div>
        <div className="absolute inset-0 bg-background/80"></div>
      </div>
      {children}
    </div>
  );
};
