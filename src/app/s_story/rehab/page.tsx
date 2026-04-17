'use client';

import React, { useEffect, useState } from 'react';
import PostList from '@/components/PostList';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export default function RehabStoryPage() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCases = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cases?category=REHAB&page=${page}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases.map((item: any) => ({
          ...item,
          date: new Date(item.createdAt).toLocaleDateString(),
          href: `/s_story/rehab/${item.id}`
        })));
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases(currentPage);
  }, [currentPage]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">개인회생 성공사례</h2>
          <div className="w-12 h-1 bg-[#A67C52] mb-6 md:mx-0 mx-auto"></div>
          <p className="text-lg text-[var(--primary)]/60 font-medium">
            어려운 상황에서도 김형근 사무소와 함께 희망을 찾은 분들의 실제 사례입니다.
          </p>
        </div>
        
        <Link 
          href="/s_story/case-write" 
          className="group flex items-center gap-2 px-8 py-4 bg-[var(--primary)] text-white rounded-2xl font-bold shadow-lg hover:bg-[var(--primary)]/90 hover:-translate-y-1 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          성공사례 등록
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32">
          <div className="w-8 h-8 border-4 border-[#A67C52] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : cases.length > 0 ? (
        <>
          <PostList posts={cases} />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)} 
          />
        </>
      ) : (
        <div className="text-center py-32 bg-[var(--background)] rounded-[var(--radius-card)] border border-dashed border-[var(--border)]">
          <p className="text-[var(--primary)]/40 font-medium">등록된 성공사례가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
