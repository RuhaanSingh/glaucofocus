
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

const Footer = () => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <footer 
      ref={targetRef as React.RefObject<HTMLElement>}
      className={cn(
        "py-8 px-4 relative border-t border-white/5 opacity-0",
        isIntersecting ? "animate-fade-in" : ""
      )}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <p className="text-foreground/60 text-sm">
              © 2025 GlaucoGuard. All Rights Reserved.
            </p>
          </div>
          
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Contact Us'].map((item, index) => (
              <a
                key={index}
                href="#"
                className="text-sm text-foreground/60 hover:text-foreground/90 transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-foreground/30 after:transition-all after:duration-300 hover:after:w-full"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
