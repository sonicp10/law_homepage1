'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-20">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-[var(--border)] text-[var(--primary)] hover:border-[#A67C52] hover:text-[#A67C52] transition-all disabled:opacity-30 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--primary)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold transition-all ${
            currentPage === page
              ? 'bg-[#A67C52] text-white shadow-lg shadow-[#A67C52]/20'
              : 'bg-white border border-[var(--border)] text-[var(--primary)]/60 hover:border-[#A67C52] hover:text-[#A67C52]'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-[var(--border)] text-[var(--primary)] hover:border-[#A67C52] hover:text-[#A67C52] transition-all disabled:opacity-30 disabled:hover:border-[var(--border)] disabled:hover:text-[var(--primary)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  );
}
