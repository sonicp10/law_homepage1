'use client';

import React, { useEffect, useState } from 'react';
import PostList from '@/components/PostList';
import Link from 'next/link';
import Pagination from '@/components/Pagination';

export default function BankruptcyStoryPage() {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCases = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cases?category=BANKRUPTCY&page=${page}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases.map((item: any) => ({
          ...item,
          date: new Date(item.createdAt).toLocaleDateString(),
          href: `/s_story/bankruptcy/${item.id}`
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
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">개인파산 성공사례</h2>
          <div className="w-12 h-1 bg-[#A67C52] mb-6 md:mx-0 mx-auto"></div>
          <p className="text-lg text-[var(--primary)]/60 font-medium flex items-center gap-x-1 flex-wrap">
            <span>여러분도 다시</span>
            <span className="flex items-center mx-1">
              <span className="text-[#A67C52] font-black text-xl self-start translate-y-1">“</span>
              <span className="text-[32px] font-black text-[#A67C52] inline-block transform rotate-12 mx-1 transition-transform">숨</span>
              <span className="text-[#A67C52] font-black text-xl self-end -translate-y-1">”</span>
            </span>
            <span>쉴 수 있습니다. 채무에서 벗어난 진짜 이야기!!</span>
          </p>
        </div>
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
