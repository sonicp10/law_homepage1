'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';


const catOptions = [
  { value: 'REHAB', label: 'About 개인회생' },
  { value: 'BANKRUPTCY', label: 'About 개인파산' },
  { value: 'SUCCESS_STORY', label: '성공사례' },
];

export default function WriteColumnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get('cat') || 'REHAB';

  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: defaultCat,
    thumbnail: '',
    tags: '',
    author: '법무사 김형근',
    readTime: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setForm({ ...form, thumbnail: data.url });
      } else {
        setError(data.error || '업로드에 실패했습니다.');
      }
    } catch {
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      setError('제목과 본문은 필수 항목입니다.');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('글이 성공적으로 발행되었습니다!');
        router.push(`/admin/columns?cat=${form.category}`);
      } else {
        setError(data.error || '저장에 실패했습니다.');
      }
    } catch {
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-[var(--primary)]/50 hover:text-[var(--primary)] transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">새 글 작성</h1>
          <p className="text-sm text-[var(--primary)]/50 mt-0.5">법률 칼럼 작성 후 즉시 발행됩니다</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8 space-y-6">
        {/* 카테고리 & 작성자 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">카테고리 *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium appearance-none"
            >
              {catOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">작성자</label>
            <input
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
            />
          </div>
        </div>

        {/* 제목 */}
        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">제목 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="예: 개인회생 신청 자격, 3가지 핵심 요건"
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
          />
        </div>

        {/* 썸네일 이미지 */}
        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">썸네일 이미지</label>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              value={form.thumbnail}
              onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
              placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
              className="flex-1 px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium font-mono"
            />
            <label className={`px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all border ${uploading ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-[var(--primary)] border-[var(--border)] hover:bg-gray-50'}`}>
              {uploading ? '업로드 중...' : '📁 파일 선택'}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          {form.thumbnail && (
            <div className="relative group rounded-xl overflow-hidden h-40 border border-[var(--border)]">
              <img src={form.thumbnail} alt="미리보기" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => setForm({ ...form, thumbnail: '' })}
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* 태그 & 읽기 시간 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="신청자격, 채무조정, 면책"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">예상 읽기 시간 (분)</label>
            <input
              type="number"
              value={form.readTime}
              onChange={(e) => setForm({ ...form, readTime: parseInt(e.target.value) || 5 })}
              min={1}
              max={60}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
            />
          </div>
        </div>

        {/* 요약글 */}
        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">요약글 (목록에 표시됩니다)</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            rows={2}
            placeholder="글의 핵심 내용을 2~3문장으로 요약해 주세요."
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium resize-none"
          />
        </div>

        {/* 본문 */}
        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">본문 *</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={20}
            placeholder="본문 내용을 입력하세요..."
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium resize-y min-h-[400px] leading-relaxed"
          />
          <p className="text-xs text-[var(--primary)]/40 mt-2 font-medium">{form.content.length}자 입력됨</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-4 bg-gray-100 text-[var(--primary)] rounded-xl font-bold hover:bg-gray-200 transition-all"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-4 bg-[#A67C52] text-white rounded-xl font-bold hover:bg-[#8B6840] transition-all shadow-md disabled:opacity-50"
          >
            {submitting ? '발행 중...' : '✅ 발행하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
