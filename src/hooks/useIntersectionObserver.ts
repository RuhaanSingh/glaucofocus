
import { useEffect, useRef, useState } from "react";

type IntersectionObserverOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
};

export function useIntersectionObserver(
  options: IntersectionObserverOptions = {}
) {
  const { root = null, rootMargin = "0px", threshold = 0.1, triggerOnce = true } = options;
  
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (hasTriggered && triggerOnce) return;
    
    const element = targetRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
            observer.unobserve(element);
          }
        } else {
          setIsIntersecting(false);
        }
      },
      { root, rootMargin, threshold }
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [root, rootMargin, threshold, hasTriggered, triggerOnce]);
  
  return { targetRef, isIntersecting };
}
