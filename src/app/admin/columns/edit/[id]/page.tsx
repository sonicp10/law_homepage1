'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const ADMIN_SECRET = 'lawoffice2024admin';

const catOptions = [
  { value: 'REHAB', label: 'All 개인회생' },
  { value: 'BANKRUPTCY', label: 'All 개인파산' },
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
  const [error, setError] = useState('');

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
    if (!form.title || !form.content) { setError('제목과 본문은 필수입니다.'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`/api/posts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        alert('수정되었습니다!');
        router.push(`/admin/columns?cat=${form.category}`);
      } else {
        setError(data.error || '수정에 실패했습니다.');
      }
    } catch { setError('서버 오류가 발생했습니다.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="text-[var(--primary)]/40 p-8">불러오는 중...</div>;

  return (
    <div className="max-w-4xl space-y-6">
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

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">카테고리</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium appearance-none">
              {catOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">작성자</label>
            <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">제목</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium" />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">썸네일 URL</label>
          <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-mono" />
          {form.thumbnail && <div className="mt-3 rounded-xl overflow-hidden h-32"><img src={form.thumbnail} alt="미리보기" className="w-full h-full object-cover" /></div>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">태그</label>
            <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--primary)] mb-2">읽기 시간 (분)</label>
            <input type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: parseInt(e.target.value) || 5 })}
              min={1} max={60} className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">요약글</label>
          <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm resize-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-[var(--primary)] mb-2">본문</label>
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={20}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm resize-y min-h-[400px] leading-relaxed" />
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="published" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })}
            className="w-5 h-5 accent-[#A67C52]" />
          <label htmlFor="published" className="text-sm font-bold text-[var(--primary)]">발행 상태 (체크 해제 시 미발행)</label>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">⚠️ {error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="flex-1 py-4 bg-gray-100 text-[var(--primary)] rounded-xl font-bold hover:bg-gray-200 transition-all">취소</button>
          <button type="submit" disabled={submitting} className="flex-1 py-4 bg-[#A67C52] text-white rounded-xl font-bold hover:bg-[#8B6840] transition-all shadow-md disabled:opacity-50">
            {submitting ? '저장 중...' : '💾 저장하기'}
          </button>
        </div>
      </form>
    </div>
  );
}
