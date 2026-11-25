'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  category: string;
  tags: string | null;
  author: string | null;
  readTime: number | null;
  viewCount: number;
  createdAt: string;
}

interface PostsResponse {
  posts: Post[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const categoryLabel: Record<string, string> = {
  REHAB: '개인회생',
  BANKRUPTCY: '개인파산',
  SUCCESS_STORY: '성공사례',
  COLUMN: '법률칼럼',
};

function InlineDiagnosisBanner({ category, className = '' }: { category: string; className?: string }) {
  const isBankruptcy = category === 'BANKRUPTCY';

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#C5A059]/40 p-5 sm:p-7 md:p-8 shadow-xl text-white ${className}`}>
      {/* 장식용 배경 광원 */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#C5A059]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#C5A059]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5">
        <div className="text-center lg:text-left space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#E5C158] text-xs font-extrabold">
            <span>⚖️</span>
            <span>
              {isBankruptcy
                ? '100% 비밀보장 · 개인파산 면책 자격 무료 시뮬레이션'
                : '100% 비밀보장 · 맞춤형 채무 탕감 시뮬레이션'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight break-keep leading-snug">
            {isBankruptcy ? (
              <>
                내 상황에서도 <span className="text-[#E5C158] underline decoration-[#C5A059]/50 underline-offset-4">원리금 100% 전액 면책</span>이 가능할까?
              </>
            ) : (
              <>
                내 소득과 채무 조건에서 <span className="text-[#E5C158] underline decoration-[#C5A059]/50 underline-offset-4">최대 90%~100% 탕감</span>될 수 있을까?
              </>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-white/75 font-medium break-keep">
            {isBankruptcy
              ? '복잡한 서류 없이 30초 만에 나의 개인파산 신청 자격과 면책 가능성을 무료로 진단해 보세요.'
              : '복잡한 서류 없이 30초 만에 나의 예상 원금 탕감률과 월 변제금을 무료로 진단해 보세요.'}
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

export default function PostsPageClient({ defaultCategory }: { defaultCategory: string }) {
  const [data, setData] = useState<PostsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: defaultCategory,
        page: String(page),
        limit: '6',
        ...(search && { search }),
      });
      const res = await fetch(`/api/posts?${params}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [defaultCategory, page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const pageTitle = defaultCategory === 'REHAB' ? 'About 개인회생' : 'About 개인파산';
  const pageSubtitle = defaultCategory === 'REHAB'
    ? '개인회생 성공을 위한 필수 지식과 실무 노하우를 전해드립니다.'
    : '개인파산 절차와 면책을 위한 전문 법률 정보를 제공합니다.';

  return (
    <div className="max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">{pageTitle}</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-6" />
        <p className="text-lg text-[var(--primary)]/60 font-medium">{pageSubtitle}</p>
      </div>

      {/* 검색 바 */}
      <form onSubmit={handleSearch} className="mb-10 flex gap-3 max-w-xl mx-auto">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="키워드로 검색하세요 (예: 신청자격, 채무조정...)"
          className="flex-1 px-5 py-3.5 bg-white border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-[var(--primary)] text-sm font-medium shadow-sm"
        />
        <button
          type="submit"
          className="px-5 sm:px-6 py-3.5 bg-[#A67C52] text-white rounded-xl font-bold text-sm hover:bg-[#8B6840] transition-all shadow-sm flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          검색
        </button>
      </form>

      {/* 로딩 */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] animate-pulse">
              <div className="h-52 bg-gray-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-5 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 글 목록 */}
      {!loading && data && (
        <>
          {data.posts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 bg-[#A67C52]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-[#A67C52]/50">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-[var(--primary)]/40 font-semibold text-lg">
                {search ? `'${search}' 검색 결과가 없습니다.` : '아직 등록된 글이 없습니다.'}
              </p>
              {search && (
                <button onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="mt-4 text-[#A67C52] underline text-sm font-bold">
                  전체 목록 보기
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-[var(--primary)]/50 font-medium">
                  총 <span className="text-[#A67C52] font-bold">{data.totalCount}</span>개의 글
                  {search && <span> — "{search}" 검색 결과</span>}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.posts.map((post, idx) => {
                  const mobileInsertIdx = Math.min(1, data.posts.length - 1); // 모바일/태블릿: 2번째 카드 바로 뒤
                  const desktopInsertIdx = Math.min(2, data.posts.length - 1); // 데스크톱(3열): 3번째 카드(첫 줄) 바로 뒤
                  const postHref = `${defaultCategory === 'REHAB' ? '/rehab' : '/bankruptcy'}/posts/${post.id}`;

                  return (
                    <React.Fragment key={post.id}>
                      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                        <Link href={postHref} className="block flex-1">
                          {/* 썸네일 */}
                          <div className="relative h-52 overflow-hidden bg-gray-100">
                            {post.thumbnail ? (
                              <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#A67C52]/10 to-[#A67C52]/5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-[#A67C52]/30">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0018 3.75c-1.052 0-2.062.18-3 .512v14.25z" />
                                </svg>
                              </div>
                            )}
                            <div className="absolute top-4 left-4">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#A67C52] text-xs font-bold rounded-full border border-[#A67C52]/20">
                                {categoryLabel[post.category] || post.category}
                              </span>
                            </div>
                          </div>

                          {/* 콘텐츠 */}
                          <div className="p-6 pb-4">
                            <h3 className="font-bold text-[var(--primary)] text-[16px] leading-snug mb-3 group-hover:text-[#A67C52] transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-sm text-[var(--primary)]/55 leading-relaxed mb-4 line-clamp-2">
                                {post.excerpt}
                              </p>
                            )}

                            {/* 태그 */}
                            {post.tags && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.split(',').slice(0, 3).map((tag) => (
                                  <span key={tag} className="px-2.5 py-1 bg-[#A67C52]/8 text-[#A67C52] text-xs font-semibold rounded-lg">
                                    #{tag.trim()}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* 메타 정보 */}
                            <div className="flex items-center justify-between text-xs text-[var(--primary)]/40 font-medium border-t border-[var(--border)] pt-4">
                              <span>{post.author || '법무사 김형근'}</span>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {post.readTime || 5}분
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {post.viewCount.toLocaleString()}
                                </span>
                                <span>{formatDate(post.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* 카드 하단 전환 CTA 버튼: 칼럼 읽기 + 30초 자가진단 */}
                        <div className="px-6 pb-6 pt-1 grid grid-cols-2 gap-2">
                          <Link
                            href={postHref}
                            className="py-2.5 px-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                          >
                            <span>📖 칼럼 읽어보기</span>
                          </Link>
                          <Link
                            href="/qna/diagnosis"
                            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#A67C52] to-[#8B6840] hover:from-[#B5895D] hover:to-[#9A754B] active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                          >
                            <span>📊 30초 자격진단</span>
                          </Link>
                        </div>
                      </div>

                      {idx === mobileInsertIdx && (
                        <InlineDiagnosisBanner category={defaultCategory} className="lg:hidden md:col-span-2" />
                      )}
                      {idx === desktopInsertIdx && (
                        <InlineDiagnosisBanner category={defaultCategory} className="hidden lg:block lg:col-span-3" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* 페이지네이션 */}
              {data.totalPages > 1 && (
                <div className="mt-14 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--primary)]/50 bg-white hover:border-[#A67C52] hover:text-[#A67C52] transition-all disabled:opacity-30"
                  >
                    ‹
                  </button>
                  {[...Array(data.totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm transition-all ${
                        page === i + 1
                          ? 'border-[#A67C52] bg-[#A67C52] text-white'
                          : 'border-[var(--border)] text-[var(--primary)]/40 bg-white hover:border-[#A67C52] hover:text-[#A67C52]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    className="w-10 h-10 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--primary)]/50 bg-white hover:border-[#A67C52] hover:text-[#A67C52] transition-all disabled:opacity-30"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
