import React from 'react';

interface SubPageBannerProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export default function SubPageBanner({ title, subtitle, backgroundImage }: SubPageBannerProps) {
  const defaultBg = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600";
  
  return (
    <section className="relative h-[480px] flex items-center justify-center overflow-hidden pt-36">
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage || defaultBg} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/20 via-[var(--primary)]/50 to-[var(--primary)]/80 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-6 -translate-y-4 max-w-4xl">
        <h1 
          className="text-5xl md:text-7xl font-black mb-8 animate-slide-up tracking-tight"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
        >
          {title}
        </h1>
        <p 
          className="text-xl md:text-2xl text-white/90 font-bold animate-slide-up" 
          style={{ 
            animationDelay: '0.1s',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
