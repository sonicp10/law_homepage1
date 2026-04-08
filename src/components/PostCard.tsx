import React from 'react';
import Link from 'next/link';

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  date: string;
  category: string;
  href: string;
}

export default function PostCard({ title, excerpt, thumbnail, date, category, href }: PostCardProps) {
  const defaultThumbnail = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800";

  return (
    <Link href={href} className="group relative bg-white rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] transition-all hover:shadow-xl hover:-translate-y-2">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={thumbnail || defaultThumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-[var(--primary)] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="text-[12px] text-[var(--primary)]/40 font-bold mb-3 uppercase tracking-widest">{date}</div>
        <h3 className="text-xl font-bold text-[var(--primary)] mb-4 group-hover:text-[#A67C52] transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-sm text-[var(--primary)]/60 line-clamp-3 leading-relaxed mb-6">
          {excerpt}
        </p>
        
        {/* Read More Link */}
        <div className="flex items-center gap-2 text-sm font-extrabold text-[#A67C52] group-hover:gap-3 transition-all">
          <span>자세히 보기</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
