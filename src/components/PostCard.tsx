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
  const isSuccessStory = category === 'SUCCESS_STORY' || category.includes('성공사례') || href.includes('/s_story/');
  const categoryLabel =
    category === 'REHAB'
      ? 'About 개인회생'
      : category === 'BANKRUPTCY'
      ? 'About 개인파산'
      : category === 'SUCCESS_STORY'
      ? (href.includes('/bankruptcy') ? '개인파산 성공사례' : '개인회생 성공사례')
      : category;

  return (
    <div className="group relative bg-white rounded-[var(--radius-card)] overflow-hidden border border-[var(--border)] shadow-sm transition-all hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between">
      <Link href={href} className="block flex-1">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
          <img 
            src={thumbnail || defaultThumbnail} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 md:top-4 md:left-4">
            <span className="px-3 py-1 bg-[#0F172A]/90 backdrop-blur-sm text-[#E5C158] border border-[#C5A059]/40 text-[11px] font-extrabold rounded-full tracking-wide shadow-md">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 md:p-7 pb-4">
          <div className="text-[12px] text-[var(--primary)]/45 font-bold mb-2 uppercase tracking-widest">{date}</div>
          <h3 className="text-lg md:text-xl font-extrabold text-[var(--primary)] mb-2.5 group-hover:text-[#A67C52] transition-colors leading-snug break-keep">
            {title}
          </h3>
          <p className="text-sm text-[var(--primary)]/65 line-clamp-2 md:line-clamp-3 leading-relaxed">
            {(excerpt || '').replace(/\*\*/g, '')}
          </p>
        </div>
      </Link>

      {/* Action CTA Footer */}
      <div className="px-5 md:px-7 pb-5 md:pb-7 pt-2">
        {isSuccessStory ? (
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={href}
              className="py-3 px-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white text-xs sm:text-[13px] font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            >
              <span>🔍 소명과정 보기</span>
            </Link>
            <Link
              href="/qna/diagnosis"
              className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#A67C52] to-[#8B6840] hover:from-[#B5895D] hover:to-[#9A754B] active:scale-[0.98] text-white text-xs sm:text-[13px] font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            >
              <span>📞 이 사례처럼 상담</span>
            </Link>
          </div>
        ) : (
          <Link
            href={href}
            className="w-full py-3 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.99] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>🔍 칼럼 전문 자세히 보기</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#E5C158] group-hover:translate-x-1 transition-transform">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
