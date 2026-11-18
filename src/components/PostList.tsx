import React from 'react';
import Link from 'next/link';
import PostCard from './PostCard';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  thumbnail?: string;
  date: string;
  category: string;
  href: string;
}

interface PostListProps {
  posts: Post[];
}

function InlineDiagnosisBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[var(--radius-card)] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#C5A059]/40 p-5 sm:p-7 md:p-8 shadow-xl text-white ${className}`}>
      {/* 장식용 배경 광원 */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#C5A059]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5">
        <div className="text-center lg:text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C158] text-xs font-extrabold">
            <span>⚖️</span>
            <span>100% 비밀보장 · 맞춤형 채무 탕감 시뮬레이션</span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight break-keep leading-snug">
            위 성공사례처럼 <span className="text-[#E5C158] underline decoration-[#C5A059]/50 underline-offset-4">내 빚도 최대 90%~100% 탕감</span>될 수 있을까?
          </h3>
          <p className="text-xs sm:text-sm text-white/75 font-medium break-keep">
            복잡한 서류 없이 30초 만에 나의 예상 원금 탕감률과 월 변제금을 무료로 진단해 보세요.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
          <Link
            href="/qna/diagnosis"
            className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#A67C52] hover:from-[#D4AF6A] hover:to-[#B5895D] text-[#0F172A] font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A059]/20 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <span>📊 30초 간편 자격진단 시작하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
          <a
            href="tel:02-6405-6363"
            className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <span>📞 무료 전화상담 연결</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PostList({ posts }: PostListProps) {
  const mobileInsertIdx = Math.min(1, posts.length - 1); // 모바일/태블릿: 2번째 카드 바로 뒤
  const desktopInsertIdx = Math.min(2, posts.length - 1); // 데스크톱(3열): 3번째 카드(첫 줄) 바로 뒤

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 py-3 md:py-10">
      {posts.map((post, idx) => (
        <React.Fragment key={post.id}>
          <PostCard {...post} />
          {idx === mobileInsertIdx && (
            <InlineDiagnosisBanner className="lg:hidden md:col-span-2" />
          )}
          {idx === desktopInsertIdx && (
            <InlineDiagnosisBanner className="hidden lg:block lg:col-span-3" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
