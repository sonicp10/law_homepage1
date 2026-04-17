'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WriteReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    author: '',
    title: '',
    content: '',
    rating: 5,
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('후기가 성공적으로 등록되었습니다.');
        router.push('/s_story/review');
        router.refresh();
      } else {
        alert('등록 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('서버 연결 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <Link href="/s_story/review" className="text-sm font-bold text-[#A67C52] flex items-center gap-2 hover:underline mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#A67C52]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          목록으로 돌아가기
        </Link>
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">의뢰인 후기 작성</h2>
        <div className="w-12 h-1 bg-[#A67C52]"></div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-card)] p-8 md:p-12 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">작성자 명</label>
              <input 
                required
                type="text" 
                placeholder="성함 입력 (예: 김*현)"
                className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">비밀번호 (수정/삭제용)</label>
              <input 
                required
                type="password" 
                placeholder="4자리 이상 숫자/문자"
                className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">만족도 별점</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({...formData, rating: star})}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                    formData.rating >= star ? 'bg-[#A67C52] text-white' : 'bg-[var(--background)] text-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">제목</label>
            <input 
              required
              type="text" 
              placeholder="후기 제목을 입력해주세요."
              className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">후기 내용</label>
            <textarea 
              required
              rows={8}
              placeholder="사건 진행 과정에서의 만족하셨던 점이나 소감을 자유롭게 작성해주세요. (개인정보가 포함된 구체적인 내용은 지양해주세요.)"
              className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors resize-none"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            ></textarea>
          </div>

          <div className="pt-4">
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-[var(--primary)]/20 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {isSubmitting ? '등록 중...' : '후기 등록하기'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 p-8 bg-[#F1F2F4] rounded-2xl">
        <p className="text-sm text-[var(--primary)]/50 text-center leading-relaxed">
          * 작성하신 후기는 관리자의 확인 후 공개될 수 있으며, 광고성이나 비방글은 예고 없이 삭제될 수 있습니다. <br />
          사건의 자세한 법적 소명이나 판결 결과는 <strong>[성공사례]</strong> 탭에서 별도로 확인 가능합니다.
        </p>
      </div>
    </div>
  );
}
