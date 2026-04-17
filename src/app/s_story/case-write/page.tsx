'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CaseWritePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'REHAB',
    excerpt: '',
    content: '',
    thumbnail: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert('성공사례가 등록되었습니다.');
        const targetPath = formData.category === 'REHAB' ? '/s_story/rehab' : '/s_story/bankruptcy';
        router.push(targetPath);
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
      <div className="mb-12 flex justify-between items-end">
        <div>
          <Link href="/s_story/rehab" className="text-sm font-bold text-[#A67C52] flex items-center gap-2 hover:underline mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            돌아가기
          </Link>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">성공사례 등록 (전문가용)</h2>
          <div className="w-12 h-1 bg-[#A67C52]"></div>
        </div>
      </div>

      <div className="bg-white border border-[var(--border)] rounded-[var(--radius-card)] p-8 md:p-12 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">사건 분류</label>
              <select 
                className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors appearance-none font-medium"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="REHAB">개인회생</option>
                <option value="BANKRUPTCY">개인파산</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">제목</label>
              <input 
                required
                type="text" 
                placeholder="예: [개인회생] 원금 탕감 성공 사례"
                className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">요약 설명 (목록 노출용)</label>
            <input 
              required
              type="text" 
              placeholder="사건 핵심 내용을 한 줄로 요약해주세요."
              className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors"
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">상세 내용 (본문)</label>
            <textarea 
              required
              rows={12}
              placeholder="상세한 진행 과정과 결과를 작성해주세요."
              className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors resize-none"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            ></textarea>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--primary)]/70 ml-1">이미지 URL (선택)</label>
            <input 
              type="text" 
              placeholder="https://..."
              className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:outline-none focus:border-[#A67C52] transition-colors"
              value={formData.thumbnail}
              onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-[var(--primary)]/20 hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {isSubmitting ? '등록 중...' : '사례 등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
