'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditColumnPage() {
  const router = useRouter();
  const params = useParams();
  const [form, setForm] = useState({
    title: '', content: '', excerpt: '', category: 'REHAB',
    thumbnail: '', tags: '', author: '법무사 김형근', readTime: 5, published: true,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) setForm(prev => ({ ...prev, thumbnail: data.url }));
      else setError(data.error || '업로드에 실패했습니다.');
    } catch {
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        const data = await res.json();
        setForm({
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          category: data.category || 'REHAB',
          thumbnail: data.thumbnail || '',
          tags: data.tags || '',
          author: data.author || '법무사 김형근',
          readTime: data.readTime || 5,
          published: data.published ?? true,
        });
      } catch {
        setError('글을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || form.content === '<p></p>') {
      setError('제목과 본문은 필수입니다.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('수정되었습니다!');
        router.push(`/admin/columns?cat=${form.category}`);
      } else {
        setError(data.error || '수정에 실패했습니다.');
      }
    } catch {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-3 border-[var(--border)] border-t-[#A67C52] rounded-full animate-spin" />
    </div>
  );

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
          <h1 className="text-2xl font-bold text-[var(--primary)]">글 수정</h1>
          <p className="text-sm text-[var(--primary)]/50 mt-0.5">내용을 수정하고 저장하세요</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 메타 정보 카드 */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6 space-y-5">
          <h2 className="text-sm font-bold text-[var(--primary)]/50 uppercase tracking-widest">기본 정보</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">카테고리</label>
              <select value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium appearance-none">
                {catOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">작성자</label>
              <input type="text" value={form.author} onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">제목</label>
            <input type="text" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium" />
          </div>

          {/* 썸네일 */}
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">썸네일 이미지</label>
            <div className="flex gap-3 mb-3">
              <input type="text" value={form.thumbnail} onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                placeholder="이미지 URL 또는 파일 업로드"
                className="flex-1 px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium font-mono" />
              <label className={`px-5 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all border ${uploading ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-[var(--primary)] border-[var(--border)] hover:bg-gray-50'}`}>
                {uploading ? '업로드 중...' : '📁 파일 선택'}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
            {form.thumbnail && (
              <div className="relative group rounded-xl overflow-hidden h-36 border border-[var(--border)]">
                <img src={form.thumbnail} alt="미리보기" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setForm(prev => ({ ...prev, thumbnail: '' }))}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">태그 (쉼표 구분)</label>
              <input type="text" value={form.tags} onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-2">읽기 시간 (분)</label>
              <input type="number" value={form.readTime} onChange={(e) => setForm(prev => ({ ...prev, readTime: parseInt(e.target.value) || 5 }))}
                min={1} max={60} className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">요약글</label>
            <textarea value={form.excerpt} onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))} rows={2}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm resize-none" />
          </div>

          {/* 발행 상태 */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <input type="checkbox" id="published" checked={form.published}
              onChange={(e) => setForm(prev => ({ ...prev, published: e.target.checked }))}
              className="w-5 h-5 accent-[#A67C52]" />
            <label htmlFor="published" className="text-sm font-bold text-[var(--primary)]">
              발행 상태 <span className="text-[var(--primary)]/40 font-normal">(체크 해제 시 미발행으로 저장)</span>
            </label>
          </div>
        </div>

        {/* 본문 에디터 */}
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-gray-50/50">
            <h2 className="text-sm font-bold text-[var(--primary)]/50 uppercase tracking-widest">본문 편집</h2>
          </div>
          <RichEditor
            value={form.content}
            onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
            placeholder="본문 내용을 수정하세요."
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">⚠️ {error}</div>
        )}

        <div className="flex gap-3 pb-8">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-4 bg-gray-100 text-[var(--primary)] rounded-xl font-bold hover:bg-gray-200 transition-all">취소</button>
          <button type="submit" disabled={submitting}
            className="flex-[2] py-4 bg-[#A67C52] text-white rounded-xl font-bold hover:bg-[#8B6840] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 저장 중...</>
            ) : '💾 저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
