'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  author: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
}

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews');
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header with Write Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">의뢰인 후기</h2>
          <div className="w-12 h-1 bg-[#A67C52] mb-6 md:mx-0 mx-auto"></div>
          <p className="text-lg text-[var(--primary)]/60 font-medium flex items-center justify-center md:justify-start gap-x-1 flex-wrap break-keep leading-relaxed">
            <span className="flex items-center">
              <span className="text-[#A67C52] font-black text-xl self-start translate-y-1">“</span>
              <span className="text-[32px] font-black text-[#A67C52] inline-block transform rotate-12 mx-1 group-hover:scale-110 transition-transform">숨</span>
              <span className="text-[#A67C52] font-black text-xl self-end -translate-y-1">”</span>
            </span>
            <span>통이 트이는 순간! 의뢰인분들의 생생한 목소리입니다.</span>
          </p>
        </div>
        
        <Link 
          href="/s_story/write" 
          className="group flex items-center gap-2 px-8 py-4 bg-[#A67C52] text-white rounded-2xl font-bold shadow-lg shadow-[#A67C52]/20 hover:bg-[#8D6541] hover:-translate-y-1 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:rotate-12 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          글쓰기
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-32">
          <div className="w-8 h-8 border-4 border-[#A67C52] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--border)] hover:border-[#A67C52]/40 hover:shadow-xl transition-all h-full flex flex-col"
            >
              <div className="flex items-center gap-1 text-[#A67C52] mb-4">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-4 h-4 ${idx < review.rating ? '' : 'text-gray-200'}`}>
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                ))}
              </div>
              <h3 className="text-xl font-bold text-[var(--primary)] mb-4 line-clamp-1">{review.title}</h3>
              <p className="text-[var(--primary)]/60 leading-relaxed mb-8 flex-1 line-clamp-4">
                {review.content}
              </p>
              <div className="flex justify-between items-center pt-6 border-t border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[var(--background)] rounded-full flex items-center justify-center font-bold text-xs text-[var(--primary)]/50">
                    {review.author[0]}
                  </div>
                  <span className="text-sm font-bold text-[var(--primary)]/80">{review.author} 의뢰인님</span>
                </div>
                <span className="text-[12px] text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[var(--background)] rounded-[var(--radius-card)] border border-dashed border-[var(--border)]">
          <p className="text-[var(--primary)]/40 font-medium">아직 등록된 후기가 없습니다. 첫 번째 후기를 남겨주세요!</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-20 p-10 bg-white border border-[var(--border)] rounded-[var(--radius-card)] shadow-sm">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-[#A67C52]/10 text-[#A67C52] rounded-2xl flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-[var(--primary)] mb-2 uppercase tracking-wide">성공 사례 게시판 안내</h4>
            <p className="text-sm text-[var(--primary)]/60 leading-relaxed">
              의뢰인 후기 게시판은 실제 사건을 진행하신 분들의 후기로 운영됩니다. <br />
              개인회생 및 개인파산의 구체적인 판결 정보나 변제 계획 등은 보안을 위해 상세 성공사례 탭에서 보실 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
