import React from 'react';

interface SubPageBannerProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
}

export default function SubPageBanner({ title, subtitle, backgroundImage }: SubPageBannerProps) {
  const defaultBg = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1600";
  
  return (
    <section className="relative h-[350px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage || defaultBg} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[var(--primary)]/40 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="relative z-10 text-center text-white px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up tracking-tight">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/80 font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {subtitle}
        </p>
      </div>
    </section>
  );
}
