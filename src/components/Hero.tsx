
import { useState, useEffect } from 'react';

const Hero = () => {
  const [textIndex, setTextIndex] = useState(0);
  const textOptions = ["Physicians.", "Hospitals.", "Individuals."];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % textOptions.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const scrollToMission = () => {
    const missionSection = document.getElementById('mission');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="hero" className="relative min-h-screen pt-24 pb-16 flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-hero-gradient z-0"></div>
      
      {/* Mock video background (replace with actual video) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-full bg-[#0a0f1f] opacity-40">
          {/* Video would be here */}
        </div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight">
            <span className="text-foreground/90">Powering </span>
            <span className="relative inline-block">
              <span className="animate-text-slide text-gradient">
                {textOptions[textIndex]}
              </span>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/70 mb-8 leading-relaxed">
            Revolutionizing glaucoma detection with 
            <span className="text-gradient font-medium"> machine learning </span> 
            and 
            <span className="text-gradient font-medium"> clinical precision</span>.
          </p>
          
          <button 
            onClick={scrollToMission}
            className="glass px-8 py-3 rounded-full text-foreground font-medium border border-white/10 shadow-glass hover:shadow-glass-hover transition-all duration-300 hover:scale-105"
          >
            Learn More
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-radial from-primary/20 to-transparent blur-2xl"></div>
      </div>
    </section>
  );
};

export default Hero;
