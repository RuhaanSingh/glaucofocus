
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { Monitor, Globe, BarChartBig } from 'lucide-react';

const PurposeCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  delay: string;
}) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <div 
      ref={targetRef as React.RefObject<HTMLDivElement>}
      className={cn(
        "glass-card p-6 opacity-0",
        isIntersecting ? `animate-fade-in ${delay}` : ""
      )}
    >
      <div className="w-12 h-12 rounded-full bg-blue-gradient flex items-center justify-center mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-3 text-center text-foreground/90">{title}</h3>
      <p className="text-center text-foreground/70">{description}</p>
    </div>
  );
};

const Purpose = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <section id="purpose" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={targetRef as React.RefObject<HTMLDivElement>}
          className={cn(
            "text-center mb-16 opacity-0",
            isIntersecting ? "animate-fade-in" : ""
          )}
        >
          <h2 className="section-title inline-block text-center">Our Purpose</h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            Revolutionizing eye care through computational-driven precision diagnostics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PurposeCard 
            icon={<Monitor className="text-white" size={24} />} 
            title="AI-Powered Screening" 
            description="Advanced ML algorithms for early-stage glaucoma detection" 
            delay="animation-delay-100"
          />
          
          <PurposeCard 
            icon={<Globe className="text-white" size={24} />} 
            title="Global Accessibility" 
            description="Cloud-based diagnostics reaching underserved populations" 
            delay="animation-delay-300"
          />
          
          <PurposeCard 
            icon={<BarChartBig className="text-white" size={24} />} 
            title="Data-Driven Insights" 
            description="Continuous learning from millions of diagnostic cases" 
            delay="animation-delay-500"
          />
        </div>
      </div>
    </section>
  );
};

export default Purpose;
