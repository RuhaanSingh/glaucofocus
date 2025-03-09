
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

const MetricItem = ({ label, value }: { label: string; value: string }) => (
  <li className="flex items-center justify-between border-b border-white/10 py-2">
    <span className="text-foreground/70">{label}:</span>
    <span className="font-medium">{value}</span>
  </li>
);

const BiomarkerItem = ({ title, value, description }: { title: string; value: string; description: string }) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <li 
      ref={targetRef as React.RefObject<HTMLLIElement>}
      className={cn(
        "mb-6 opacity-0",
        isIntersecting ? "animate-fade-in" : ""
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">{title}:</span>
        <span className="text-gradient">{value}</span>
      </div>
      <p className="text-sm text-foreground/70">{description}</p>
    </li>
  );
};

const FormulaCard = ({ title, formula }: { title: string; formula: string }) => (
  <div className="glass-card p-4 my-6 overflow-x-auto">
    <div className="text-sm font-medium mb-2 text-foreground/80">{title}</div>
    <div className="font-mono text-glaucogreen-light">{formula}</div>
  </div>
);

const Product = () => {
  const { targetRef: headingRef, isIntersecting: headingVisible } = useIntersectionObserver({ threshold: 0.1 });
  const { targetRef: contentRef, isIntersecting: contentVisible } = useIntersectionObserver({ threshold: 0.1 });
  
  return (
    <section id="product" className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={headingRef as React.RefObject<HTMLDivElement>}
          className={cn(
            "text-center mb-16 opacity-0",
            headingVisible ? "animate-fade-in" : ""
          )}
        >
          <h2 className="section-title inline-block text-center">Our Product</h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            GlaucoGuard: AI-Powered Precision Glaucoma Diagnosis
          </p>
        </div>
        
        <div 
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className={cn(
            "glass-card p-8 md:p-10 opacity-0",
            contentVisible ? "animate-scale-in" : ""
          )}
        >
          <div className="grid md:grid-cols-3 gap-10">
            <div className="md:col-span-2">
              <p className="mb-6 leading-relaxed text-foreground/80">
                Glaucoma is a leading cause of irreversible blindness, often progressing
                silently until significant vision loss occurs. Our AI-driven platform,
                <strong className="text-foreground"> GlaucoGuard</strong>, leverages deep learning and advanced clinical
                biomarker analysis to detect and assess glaucoma risk with high accuracy.
                Utilizing <strong className="text-foreground">ResNet50</strong>, a state-of-the-art convolutional neural
                network, our system provides a comprehensive risk assessment, combining
                image-based diagnostics with quantitative clinical parameters.
              </p>
              
              <h3 className="text-xl font-medium mb-4 text-foreground/90">Glaucoma Risk Assessment</h3>
              
              <div className="glass-card p-6 mb-8">
                <ul className="space-y-1">
                  <MetricItem label="Risk Level" value="Medium" />
                  <MetricItem label="Risk Probability" value="59.0%" />
                  <MetricItem label="Model Confidence" value="92.2%" />
                  <MetricItem label="GRI Index" value="18.38" />
                </ul>
              </div>
              
              <h3 className="text-xl font-medium mb-4 text-foreground/90">Why Our Approach is Superior?</h3>
              
              <div className="space-y-6 mb-8">
                <div className="glass-card p-6">
                  <h4 className="font-medium mb-2">Deep Learning for High-Fidelity Diagnostics</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    GlaucoGuard is powered by ResNet50, a highly efficient convolutional neural
                    network designed to extract intricate patterns from color fundus photographs
                    (CFPs). The model is trained on extensive datasets of glaucoma-affected and
                    healthy eyes, allowing it to differentiate subtle optic nerve changes beyond
                    human perception.
                  </p>
                </div>
                
                <div className="glass-card p-6">
                  <h4 className="font-medium mb-2">A Novel Risk Index: The Glaucoma Risk Index (GRI)</h4>
                  <p className="text-foreground/70 text-sm leading-relaxed mb-4">
                    A key innovation of GlaucoGuard is the <strong>GRI</strong> (Glaucoma Risk Index),
                    a proprietary metric that synthesizes multiple biomarkers into a single,
                    interpretable risk factor.
                  </p>
                  
                  <FormulaCard 
                    title="GRI Calculation" 
                    formula="GRI = (Cup-to-Disc Ratio × IOP (mmHg)) / (RNFL Thickness (µm)) × 100" 
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-medium mb-4 text-foreground/90">Key Performance Metrics</h3>
              
              <div className="glass-card p-6 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "AUC", value: "0.92", description: "High precision in distinguishing cases" },
                  { label: "Accuracy", value: "90%", description: "Consistently reliable diagnostics" },
                  { label: "Sensitivity", value: "94%", description: "Detects early-stage cases" },
                  { label: "Specificity", value: "87%", description: "Minimizes false positives" }
                ].map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xl font-medium text-gradient mb-1">{metric.value}</div>
                    <div className="text-sm font-medium mb-1">{metric.label}</div>
                    <div className="text-xs text-foreground/60">{metric.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4 text-foreground/90">Clinical Biomarkers</h3>
              <p className="mb-6 text-sm text-foreground/70">
                Unlike traditional methods that rely solely on intraocular pressure (IOP),
                GlaucoGuard incorporates a suite of advanced biomarkers to enhance diagnostic
                precision.
              </p>
              
              <ul className="space-y-1">
                <BiomarkerItem 
                  title="Intraocular Pressure (IOP)" 
                  value="24 mmHg" 
                  description="Elevated IOP remains a primary risk factor for glaucoma." 
                />
                
                <BiomarkerItem 
                  title="Central Corneal Thickness" 
                  value="519 µm" 
                  description="Thinner corneas are associated with higher susceptibility." 
                />
                
                <BiomarkerItem 
                  title="Cup-to-Disc Ratio (CDR)" 
                  value="0.72" 
                  description="A key structural marker of optic nerve damage." 
                />
                
                <BiomarkerItem 
                  title="Mean Deviation (MD)" 
                  value="-3.04 dB" 
                  description="Captures functional vision loss via perimetry." 
                />
                
                <BiomarkerItem 
                  title="RNFL Thickness" 
                  value="94 µm" 
                  description="RNFL thinning is an early indicator of progression." 
                />
                
                <BiomarkerItem 
                  title="Optic Nerve Head Volume" 
                  value="0.78 mm³" 
                  description="Novel 3D volumetric parameter for assessment." 
                />
              </ul>
              
              <div className="glass-card p-6 mt-8">
                <h4 className="text-sm font-medium mb-3 text-foreground/90">Demo Video</h4>
                <div className="aspect-video bg-black/30 rounded overflow-hidden">
                  <video 
                    className="w-full h-full object-cover" 
                    controls 
                    poster="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-medical-technology-interface-for-heart-analysis-10622-large.mp4" type="video/mp4" />
                    Your browser does not support HTML5 video.
                  </video>
                </div>
              </div>
              
              <div className="glass-card p-6 mt-4">
                <h4 className="text-sm font-medium mb-3 text-foreground/90">Analysis Image</h4>
                <div className="aspect-square bg-black/30 rounded overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Glaucoma Analysis" 
                    className="w-full h-full object-cover"
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

export default Product;
