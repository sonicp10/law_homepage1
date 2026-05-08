'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const catOptions = [
  { value: 'REHAB', label: 'About 개인회생' },
  { value: 'BANKRUPTCY', label: 'About 개인파산' },
  { value: 'SUCCESS_STORY', label: '성공사례' },
];

interface Post {
  id: string;
  title: string;
  category: string;
  author: string | null;
  viewCount: number;
  published: boolean;
  createdAt: string;
  tags: string | null;
}

export default function AdminColumnsPage() {
  const searchParams = useSearchParams();
  const defaultCat = searchParams.get('cat') || 'REHAB';
  const [cat, setCat] = useState(defaultCat);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category: cat, page: String(page), limit: '10' });
      const res = await fetch(`/api/posts?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotal(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const newCat = searchParams.get('cat');
    if (newCat) setCat(newCat);
  }, [searchParams]);

  useEffect(() => { fetchPosts(); }, [cat, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('이 글을 삭제하시겠습니까?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      fetchPosts();
    } catch {
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try {
      await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      fetchPosts();
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">법률 칼럼 관리</h1>
          <p className="text-sm text-[var(--primary)]/50 mt-1">총 {total}건의 게시글</p>
        </div>
        <Link
          href={`/admin/columns/write?cat=${cat}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#A67C52] text-white rounded-xl font-bold text-sm hover:bg-[#8B6840] transition-all shadow-md"
        >
          <span>+</span> 새 글 작성
        </Link>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 bg-white border border-[var(--border)] rounded-xl p-1.5 w-fit shadow-sm">
        {catOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => { setCat(opt.value); setPage(1); }}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              cat === opt.value
                ? 'bg-[#A67C52] text-white shadow-sm'
                : 'text-[var(--primary)]/50 hover:text-[var(--primary)]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--primary)]/40">불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[var(--primary)]/30 font-semibold mb-4">등록된 글이 없습니다</p>
            <Link href="/admin/columns/write" className="text-[#A67C52] underline text-sm font-bold">첫 글 작성하기</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50">
                <th className="text-left px-6 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase tracking-wider">제목</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase tracking-wider w-24">저자</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase tracking-wider w-16">조회</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase tracking-wider w-24">상태</th>
                <th className="text-left px-4 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase tracking-wider w-28">작성일</th>
                <th className="text-right px-6 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase tracking-wider w-32">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-[var(--primary)] text-sm line-clamp-1">{post.title}</p>
                    {post.tags && (
                      <p className="text-xs text-[var(--primary)]/40 mt-0.5 line-clamp-1">
                        {post.tags.split(',').map(t => `#${t.trim()}`).join(' ')}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--primary)]/60 font-medium">{post.author || '법무사 김형근'}</td>
                  <td className="px-4 py-4 text-sm text-[var(--primary)]/60 font-medium">{post.viewCount.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => togglePublish(post.id, post.published)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                        post.published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {post.published ? '발행중' : '미발행'}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-sm text-[var(--primary)]/50 font-medium">{formatDate(post.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/columns/edit/${post.id}`}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {deleting === post.id ? '...' : '삭제'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border)] flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${
                  page === i + 1
                    ? 'bg-[#A67C52] text-white border-[#A67C52]'
                    : 'border-[var(--border)] text-[var(--primary)]/50 hover:border-[#A67C52]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
