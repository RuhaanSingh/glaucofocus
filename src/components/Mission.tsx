
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

const StatBar = ({ 
  value, 
  title, 
  description, 
  color = 'from-primary/80 to-primary/5', 
  animationDelay = '', 
  barHeight = '80%' 
}: {
  value: string;
  title: string;
  description: string;
  color?: string;
  animationDelay?: string;
  barHeight?: string;
}) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.3 });
  
  return (
    <div 
      ref={targetRef as React.RefObject<HTMLDivElement>} 
      className="flex flex-col items-center w-full max-w-xs"
    >
      <div className="mb-3">
        <div className={cn(
          "text-3xl md:text-4xl font-medium mb-1 opacity-0",
          isIntersecting ? `animate-fade-in ${animationDelay}` : ""
        )}>
          {value}
        </div>
        <h3 className={cn(
          "text-lg font-medium text-foreground/90 opacity-0",
          isIntersecting ? `animate-fade-in animation-delay-200 ${animationDelay}` : ""
        )}>
          {title}
        </h3>
        <p className={cn(
          "text-sm text-foreground/60 opacity-0",
          isIntersecting ? `animate-fade-in animation-delay-300 ${animationDelay}` : ""
        )}>
          {description}
        </p>
      </div>
      
      <div className="w-full h-48 relative flex justify-center">
        <div className={cn(
          "w-16 rounded-t-xl bg-gradient-to-t absolute bottom-0",
          color, 
          "transition-[height] duration-1000 ease-out",
          isIntersecting ? `h-[${barHeight}]` : "h-0"
        )}></div>
      </div>
    </div>
  );
};

const VisionStage = ({ title, imageUrl, type }: { title: string; imageUrl: string; type: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-28 h-28 rounded-lg overflow-hidden mb-2 relative",
        type === "normal" ? "" : type === "early" ? "after:absolute after:inset-0 after:bg-black/30" : "after:absolute after:inset-0 after:bg-black/70"
      )}>
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <span className="text-sm text-foreground/80">{title}</span>
    </div>
  );
};

const Mission = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <section id="mission" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        {/* Stats Bars */}
        <div className="mb-20">
          <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-16">
            <StatBar 
              value="76M" 
              title="Global Cases" 
              description="Projected by 2024 with 3.5% annual growth" 
              color="from-glaucogreen/80 to-glaucogreen/5"
              animationDelay="animation-delay-100"
              barHeight="95%"
            />
            
            <StatBar 
              value="50%" 
              title="Undiagnosed" 
              description="Remain untreated until vision loss occurs" 
              color="from-primary/80 to-primary/5"
              animationDelay="animation-delay-300"
              barHeight="70%"
            />
            
            <StatBar 
              value="90%" 
              title="Preventable" 
              description="Of blindness cases with early detection" 
              color="from-glaucoblue/80 to-glaucoblue/5"
              animationDelay="animation-delay-500"
              barHeight="85%"
            />
          </div>
        </div>
        
        {/* Mission Content */}
        <div ref={targetRef as React.RefObject<HTMLDivElement>} className="glass-card p-8 md:p-10">
          <h2 className="section-title text-center mb-12">Our Mission</h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className={cn(
              "opacity-0",
              isIntersecting ? "animate-fade-in-left" : ""
            )}>
              <h3 className="text-xl font-medium mb-4 text-foreground/90">Combating Silent Vision Loss</h3>
              <p className="mb-6 text-foreground/80 leading-relaxed">
                Glaucoma steals vision silently – by the time symptoms appear,
                irreversible damage has already occurred. GlaucoGuard exists to:
              </p>
              
              <ul className="space-y-4">
                {[
                  "Prevent avoidable blindness through early detection",
                  "Democratize access to expert-level diagnostics",
                  "Continuously improve through machine learning"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-gradient flex items-center justify-center mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </span>
                    <span className="text-foreground/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={cn(
              "flex items-center justify-center opacity-0",
              isIntersecting ? "animate-fade-in-right" : ""
            )}>
              <div className="space-y-6">
                <h3 className="text-xl font-medium mb-4 text-foreground/90 text-center">Vision Progression</h3>
                <div className="flex justify-between gap-6">
                  <VisionStage 
                    title="Normal Vision" 
                    imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    type="normal"
                  />
                  <VisionStage 
                    title="Early Glaucoma" 
                    imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    type="early"
                  />
                  <VisionStage 
                    title="Advanced Glaucoma" 
                    imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    type="advanced"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
