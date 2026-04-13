'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, HelpCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { faqs } from './data';

const ITEMS_PER_PAGE = 10;

export default function RehabAskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openId, setOpenId] = useState<number | null>(null);

  // Filter FAQs based on search query
  const filteredFaqs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return faqs;
    return faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Total pages calculation
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);

  // Get current page items
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFaqs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredFaqs, currentPage]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
    setOpenId(null);
  }, [searchQuery]);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-[var(--primary)] mb-6 tracking-tight">
          자주묻는 질문 (FAQ)
        </h2>
        <div className="w-12 h-1 bg-[var(--secondary)] mx-auto mb-8 rounded-full"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium max-w-2xl mx-auto leading-relaxed">
          개인회생 신청부터 절차, 비용까지 가장 많이 궁금해하시는 50가지 질문에 대해 명쾌한 답을 드립니다.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-12 group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-[var(--primary)]/30 group-focus-within:text-[var(--secondary)] transition-colors" />
        </div>
        <input
          type="text"
          placeholder="궁금한 키워드를 입력해보세요 (예: 주식, 비용, 최소생계비...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-[var(--border)] rounded-2xl text-lg font-medium focus:border-[var(--secondary)] focus:ring-4 focus:ring-[var(--secondary)]/5 transition-all outline-none shadow-sm"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-5 flex items-center text-[var(--primary)]/30 hover:text-[var(--primary)] transition-colors"
          >
            초기화
          </button>
        )}
      </div>

      {/* Filter Info */}
      <div className="flex justify-between items-center mb-6 px-2">
        <p className="text-sm font-bold text-[var(--primary)]/40">
          {searchQuery ? (
            <>검색 결과 <span className="text-[var(--secondary)]">{filteredFaqs.length}</span>건</>
          ) : (
            <>전체 <span className="text-[var(--secondary)]">{faqs.length}</span>문항</>
          )}
        </p>
        <p className="text-sm font-bold text-[var(--primary)]/40">
          Page {currentPage} of {totalPages || 1}
        </p>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentItems.length > 0 ? (
            <motion.div
              key={currentPage + searchQuery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {currentItems.map((faq) => (
                <div 
                  key={faq.id}
                  className={`bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    openId === faq.id 
                      ? 'border-[var(--secondary)] shadow-lg' 
                      : 'border-[var(--border)] hover:border-[var(--primary)]/10 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-start gap-5 p-6 md:p-8 text-left outline-none"
                  >
                    <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center font-black flex-shrink-0 transition-colors ${
                      openId === faq.id ? 'bg-[var(--secondary)] text-white' : 'bg-[var(--secondary)]/10 text-[var(--secondary)]'
                    }`}>
                      Q
                    </div>
                    <div className="flex-1 flex justify-between items-center gap-4">
                      <span className={`text-lg font-bold leading-tight transition-colors ${
                        openId === faq.id ? 'text-[var(--primary)]' : 'text-[var(--primary)]/80'
                      }`}>
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[var(--primary)]/20 transition-transform duration-300 ${openId === faq.id ? 'rotate-180 text-[var(--secondary)]' : ''}`} />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 md:px-8 pb-8 pt-0 flex gap-5 border-t border-[var(--border)] pt-6 mx-6 md:mx-8 mt-[-1px]">
                          <div className="w-8 h-8 rounded-full bg-[#2C3E50]/5 text-[#2C3E50]/40 flex items-center justify-center font-black flex-shrink-0">
                            A
                          </div>
                          <div className="flex-1 text-[17px] text-[var(--primary)]/70 leading-relaxed font-medium whitespace-pre-line">
                            {faq.a}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-[var(--surface)] rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-[var(--primary)]/20" />
              </div>
              <h3 className="text-xl font-bold text-[var(--primary)] mb-2">검색 결과가 없습니다.</h3>
              <p className="text-[var(--primary)]/50">다른 키워드로 검색하시거나 고객센터로 직접 문의해 주세요.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="mt-6 text-[var(--secondary)] font-bold underline"
              >
                검색어 초기화
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-2">
          <button
            onClick={() => {
              setCurrentPage(prev => Math.max(prev - 1, 1));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="p-3 bg-white border border-[var(--border)] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface)] transition-colors"
            title="이전 페이지"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className={`w-12 h-12 rounded-xl font-black transition-all ${
                  currentPage === pageNum
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20'
                    : 'bg-white border border-[var(--border)] text-[var(--primary)]/40 hover:border-[var(--primary)]/20'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setCurrentPage(prev => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="p-3 bg-white border border-[var(--border)] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--surface)] transition-colors"
            title="다음 페이지"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-24 p-12 bg-[var(--primary)] rounded-[var(--radius-card)] text-white text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mt-32"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32"></div>
        
        <div className="relative z-10">
          <HelpCircle className="w-16 h-16 text-[var(--secondary)] mx-auto mb-6 opacity-80" />
          <h3 className="text-2xl md:text-3xl font-black mb-6">아직 궁금한 점이 남아있나요?</h3>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            개인회생은 채무자의 상황에 따라 최적의 전략이 다릅니다.<br />
            전문 법무사가 1:1 비밀 방문 상담을 통해 명쾌한 해답을 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-10 py-5 bg-[var(--secondary)] text-white font-black rounded-full hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2">
              무료 상담 신청하기
            </button>
            <button className="px-10 py-5 bg-white/10 text-white font-black rounded-full border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              성공 사례 더보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
