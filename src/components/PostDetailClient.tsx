'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  thumbnail: string | null;
  category: string;
  tags: string | null;
  author: string | null;
  readTime: number | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostDetailClient({ backUrl }: { backUrl: string }) {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setPost(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchPost();
  }, [params.id]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-10" />
      <div className="h-72 bg-gray-200 rounded-2xl mb-10" />
      {[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded mb-3" />)}
    </div>
  );

  if (error || !post) return (
    <div className="max-w-4xl mx-auto text-center py-24">
      <p className="text-[var(--primary)]/40 text-xl font-semibold">글을 찾을 수 없습니다.</p>
      <Link href={backUrl} className="mt-6 inline-block text-[#A67C52] underline font-bold">목록으로 돌아가기</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* 뒤로가기 */}
      <Link href={backUrl} className="inline-flex items-center gap-2 text-[var(--primary)]/50 hover:text-[#A67C52] transition-colors text-sm font-semibold mb-8 group">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        목록으로 돌아가기
      </Link>

      {/* 메타 정보 */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[#A67C52]/10 text-[#A67C52] text-xs font-bold rounded-full">
            {post.category === 'REHAB' ? 'About 개인회생' : post.category === 'BANKRUPTCY' ? 'About 개인파산' : post.category}
          </span>
          {post.tags && post.tags.split(',').slice(0, 4).map((tag) => (
            <span key={tag} className="px-3 py-1 bg-gray-100 text-[var(--primary)]/50 text-xs font-semibold rounded-full">
              #{tag.trim()}
            </span>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--primary)] leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--primary)]/50 font-medium border-b border-[var(--border)] pb-6">
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            {post.author || '법무사 김형근'}
          </span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            약 {post.readTime || 5}분 소요
          </span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {post.viewCount.toLocaleString()} 조회
          </span>
        </div>
      </div>

      {/* 썸네일 */}
      {post.thumbnail && (
        <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
          <img src={post.thumbnail} alt={post.title} className="w-full h-72 md:h-96 object-cover" />
        </div>
      )}

      {/* 본문 */}
      <div
        className="prose prose-lg max-w-none text-[var(--primary)]/80 leading-loose"
        style={{ whiteSpace: 'pre-wrap', lineHeight: '2', wordBreak: 'keep-all' }}
      >
        {post.content}
      </div>

      {/* 하단 CTA */}
      <div className="mt-16 p-8 bg-gradient-to-r from-[#A67C52]/8 to-[#A67C52]/4 rounded-2xl border border-[#A67C52]/15 text-center">
        <p className="text-[var(--primary)] font-bold text-xl mb-2">더 궁금한 점이 있으신가요?</p>
        <p className="text-[var(--primary)]/60 text-sm mb-6">법무사 김형근이 직접 전화 상담을 도와드립니다.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/qna/phone" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#A67C52] text-white rounded-xl font-bold hover:bg-[#8B6840] transition-all shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 12.426 10.074 22.5 22.5 22.5 1.242 0 2.25-1.008 2.25-2.25v-4.509c0-1.11-.901-2.009-2.008-2.009l-4.509.006c-1.11 0-2.012.91-2.012 2.009l-.014 2.254c-7.923-1.01-14.332-7.419-15.342-15.342l2.254-.014c1.098 0 2.009-.902 2.009-2.012l.006-4.509c0-1.11-.899-2.008-2.009-2.008H4.5c-1.242 0-2.25 1.008-2.25 2.25v4.5z" />
            </svg>
            전화 상담 신청
          </Link>
          <Link href={backUrl} className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-[var(--primary)] rounded-xl font-bold border border-[var(--border)] hover:border-[#A67C52] hover:text-[#A67C52] transition-all">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
