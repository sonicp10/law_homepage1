'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ReviewWritePage() {
  const router = useRouter();

  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!author.trim()) {
      setErrorMsg('작성자 이름을 입력해주세요.');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('후기 제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      setErrorMsg('후기 내용을 입력해주세요.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setErrorMsg('글 관리용 비밀번호(4자리 이상)를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: author.trim(),
          rating,
          title: title.trim(),
          content: content.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert('소중한 후기가 성공적으로 등록되었습니다.');
        router.push('/s_story/review');
      } else {
        setErrorMsg(data.error || '후기 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setErrorMsg('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 상단 안내 */}
      <div className="mb-10 text-center md:text-left">
        <Link
          href="/s_story/review"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#A67C52] hover:text-[#8D6541] mb-4 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          후기 목록으로 돌아가기
        </Link>
        <h2 className="text-3xl font-black text-[var(--primary)] mb-3">소중한 후기 작성</h2>
        <p className="text-[var(--primary)]/60 text-sm leading-relaxed">
          법무사 김형근 사무소와 함께 새로운 희망을 찾으신 의뢰인 여러분의 소중한 경험과 목소리를 들려주세요.
        </p>
      </div>

      {/* 작성 폼 카드 */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-[var(--border)] shadow-xl p-8 sm:p-12"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
              </svg>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 만족도 별점 선택 */}
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-3">
              상담 및 사건 진행 만족도 <span className="text-[#A67C52]">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  aria-label={`${star}점 선택`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`w-9 h-9 transition-colors ${
                      star <= rating ? 'text-[#A67C52]' : 'text-gray-200'
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              ))}
              <span className="ml-3 text-sm font-bold text-[#A67C52]">
                {rating === 5 && '★★★★★ (매우 만족)'}
                {rating === 4 && '★★★★☆ (만족)'}
                {rating === 3 && '★★★☆☆ (보통)'}
                {rating === 2 && '★★☆☆☆ (다소 아쉬움)'}
                {rating === 1 && '★☆☆☆☆ (불만족)'}
              </span>
            </div>
          </div>

          {/* 작성자 & 비밀번호 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">
                작성자 이름 <span className="text-[#A67C52]">*</span>
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="예: 홍길동 (목록에는 홍*동 표기)"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 text-[var(--primary)] transition-all"
                maxLength={20}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">
                글 관리용 비밀번호 <span className="text-[#A67C52]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="수정/삭제 시 사용할 비밀번호 (4자리 이상)"
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 text-[var(--primary)] transition-all"
                maxLength={20}
              />
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">
              후기 제목 <span className="text-[#A67C52]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 막막했던 채무 문제, 친절한 상담 덕분에 새 희망을 찾았습니다."
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 text-[var(--primary)] transition-all font-medium"
              maxLength={80}
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">
              후기 내용 <span className="text-[#A67C52]">*</span>
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="사무소와의 상담 과정이나 사건 진행 중 인상 깊었던 점, 다른 분들에게 전하고 싶은 따뜻한 한마디를 적어주세요."
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A67C52] focus:ring-2 focus:ring-[#A67C52]/20 text-[var(--primary)] transition-all leading-relaxed"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t border-gray-100">
            <Link
              href="/s_story/review"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 text-center transition-colors"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#A67C52] text-white font-bold hover:bg-[#8D6541] shadow-lg shadow-[#A67C52]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>등록 중...</span>
                </>
              ) : (
                <span>후기 등록 완료</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
