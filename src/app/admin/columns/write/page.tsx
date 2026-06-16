'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// SSR 비활성화 (Tiptap은 클라이언트 전용)
const RichEditor = dynamic(() => import('@/components/RichEditor'), { ssr: false, loading: () => (
  <div className="border border-[var(--border)] rounded-2xl h-[500px] flex items-center justify-center bg-gray-50 text-[#2C3E50]/30 text-sm">
    에디터 로딩 중...
  </div>
)});

const catOptions = [
  { value: 'REHAB', label: 'About 개인회생' },
  { value: 'BANKRUPTCY', label: 'About 개인파산' },
  { value: 'SUCCESS_STORY', label: '성공사례' },
];

function WriteColumnContent() {
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
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        let errMsg = `업로드 실패 (${res.status})`;
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch {}
        setError(errMsg);
        return;
      }
      const data = await res.json();
      if (data.success) setForm(prev => ({ ...prev, thumbnail: data.url }));
      else setError(data.error || '업로드에 실패했습니다.');
    } catch (err: any) {
      setError(`서버 연결 오류: ${err?.message || '알 수 없는 오류'}`);
    } finally {
      setUploading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || form.content === '<p></p>') {
      setError('제목과 본문은 필수 항목입니다.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    <div className="max-w-5xl space-y-6">
      {/* 헤더 */}
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 메타 정보 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6 space-y-5">
          <h2 className="text-sm font-bold text-[var(--primary)]/50 uppercase tracking-widest">기본 정보</h2>

          {/* 카테고리 & 작성자 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">카테고리 *</label>
              <select
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium appearance-none"
              >
                {catOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">작성자</label>
              <input type="text" value={form.author}
                onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
              />
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">제목 *</label>
            <input type="text" value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="예: 개인회생 신청 자격, 3가지 핵심 요건"
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
            />
          </div>

          {/* 썸네일 이미지 */}
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">썸네일 이미지</label>
            <div className="flex gap-3 mb-3">
              <div className="relative flex-1">
                <input type="text" value={form.thumbnail}
                  onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                  placeholder="이미지 URL 또는 파일 업로드"
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium font-mono pr-10"
                />
                {form.thumbnail && (
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, thumbnail: '' }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 hover:bg-red-400 text-white transition-colors"
                    title="URL 지우기"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <label className={`px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all border ${uploading ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-[var(--primary)] border-[var(--border)] hover:bg-gray-50'}`}>
                {uploading ? '업로드 중...' : '📁 파일 선택'}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
            {form.thumbnail && (
              <div className="relative rounded-xl overflow-hidden border-2 border-[var(--border)] group">
                <img src={form.thumbnail} alt="썸네일 미리보기" className="w-full h-40 object-cover" />
                {/* 이미지 위 어두운 오버레이 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />
                {/* 항상 보이는 삭제 버튼 */}
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, thumbnail: '' }))}
                  className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-bold rounded-lg shadow-lg transition-all duration-150"
                  title="썸네일 이미지 삭제"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                  삭제
                </button>
                {/* 하단 안내 */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xs font-medium truncate opacity-80">{form.thumbnail.split('/').pop()}</p>
                </div>
              </div>
            )}
          </div>

          {/* 태그 & 읽기 시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">태그 (쉼표로 구분)</label>
              <input type="text" value={form.tags}
                onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="신청자격, 채무조정, 면책"
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">예상 읽기 시간 (분)</label>
              <input type="number" value={form.readTime}
                onChange={(e) => setForm(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                min={1} max={60}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium"
              />
            </div>
          </div>

          {/* 요약글 */}
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">요약글 (목록에 표시됩니다)</label>
            <textarea value={form.excerpt}
              onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={2} placeholder="글의 핵심 내용을 2~3문장으로 요약해 주세요."
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium resize-none"
            />
          </div>
        </div>

        {/* 본문 에디터 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)]">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-gray-50/50">
            <h2 className="text-sm font-bold text-[var(--primary)]/50 uppercase tracking-widest">본문 편집 *</h2>
          </div>
          <RichEditor
            value={form.content}
            onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
            placeholder="본문 내용을 자유롭게 작성하세요. 서식, 이미지, 링크 등 다양한 기능을 활용하세요."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-4 bg-gray-100 text-[var(--primary)] rounded-xl font-bold hover:bg-gray-200 transition-all">
            취소
          </button>
          <button type="submit" disabled={submitting}
            className="flex-[2] py-4 bg-[#A67C52] text-white rounded-xl font-bold hover:bg-[#8B6840] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 발행 중...</>
            ) : '✅ 발행하기'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function WriteColumnPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--primary)]/40">로딩 중...</div>}>
      <WriteColumnContent />
    </Suspense>
  );
}
