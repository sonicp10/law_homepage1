'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, ExternalLink, Plus, Trash2, Edit3, 
  Eye, EyeOff, RefreshCw, BookOpen, Trophy, Scale, DollarSign 
} from 'lucide-react';

const catOptions = [
  { value: 'REHAB', label: 'About 개인회생', icon: '⚖️' },
  { value: 'BANKRUPTCY', label: 'About 개인파산', icon: '💸' },
  { value: 'SUCCESS_STORY', label: '성공사례 관리', icon: '🏆' },
];

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [publishedFilter, setPublishedFilter] = useState(''); // '' | 'true' | 'false'
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (silent = false) => {
    if (!silent) {
      if (posts.length > 0) setIsRefreshing(true);
      else setLoading(true);
    }
    try {
      const params = new URLSearchParams({
        category: cat,
        page: String(page),
        limit: '10',
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      });
      const res = await fetch(`/api/posts?${params}`);
      const data = await res.json();
      let fetchedPosts: Post[] = data.posts || [];
      
      // 공개 여부 클라이언트 필터링 (필요 시)
      if (publishedFilter === 'true') {
        fetchedPosts = fetchedPosts.filter(p => p.published);
      } else if (publishedFilter === 'false') {
        fetchedPosts = fetchedPosts.filter(p => !p.published);
      }

      setPosts(fetchedPosts);
      setTotal(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const newCat = searchParams.get('cat');
    if (newCat) setCat(newCat);
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [cat, page, publishedFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 글을 완전히 삭제하시겠습니까?`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      fetchPosts();
    } catch {
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublish = async (id: string, currentPublished: boolean) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !currentPublished }),
      });
      if (!res.ok) throw new Error();
      fetchPosts(true);
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  // 사용자 웹사이트 실제 URL 매핑
  const getPublicPostUrl = (item: Post) => {
    if (item.category === 'REHAB') return `/rehab/posts/${item.id}`;
    if (item.category === 'BANKRUPTCY') return `/bankruptcy/posts/${item.id}`;
    if (item.category === 'SUCCESS_STORY') return `/s_story/posts/${item.id}`;
    return `/rehab/posts/${item.id}`;
  };

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
            <span>📝</span> 법률 칼럼 & 성공사례 관리
          </h1>
          <p className="text-sm text-[var(--primary)]/60 mt-1">
            선택된 카테고리에 총 <span className="font-bold text-[#A67C52]">{total}건</span>의 글이 등록되어 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchPosts()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#A67C52]' : ''}`} />
            <span>새로고침</span>
          </button>
          <Link
            href={`/admin/columns/write?cat=${cat}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#A67C52] text-white rounded-xl text-xs font-bold hover:bg-[#8B6840] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>새 글 작성</span>
          </Link>
        </div>
      </div>

      {/* 카테고리 탭 & 검색/필터 바 */}
      <div className="bg-white p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
        
        {/* 카테고리 탭 */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
          {catOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setCat(opt.value); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                cat === opt.value
                  ? 'bg-[#A67C52] text-white border-[#A67C52] shadow-sm'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* 공개 여부 필터 */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-bold mr-1">공개 상태:</span>
            {[
              { value: '', label: '전체' },
              { value: 'true', label: '공개글' },
              { value: 'false', label: '비공개글' },
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => { setPublishedFilter(st.value); setPage(1); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  publishedFilter === st.value
                    ? 'bg-gray-900 text-white font-bold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* 검색창 */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="제목, 태그, 요약 검색"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] focus:bg-white transition-all font-medium"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-gray-800 text-white rounded-xl text-xs font-bold hover:bg-gray-700 transition-colors shrink-0"
            >
              검색
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setPage(1); }}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                초기화
              </button>
            )}
          </form>
        </div>

      </div>

      {/* 테이블 영역 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">칼럼 목록을 불러오는 중입니다...</div>
        ) : posts.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-medium space-y-1">
            <p className="text-base font-bold text-gray-500">등록된 게시글이 없습니다.</p>
            <p className="text-xs">상단의 &apos;새 글 작성&apos; 버튼을 눌러 첫 번째 칼럼을 발행해보세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50/80">
                  {['제목 / 요약', '작성자', '조회수', '공개 여부', '작성일', '관리'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {posts.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-5 py-4 max-w-md">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/admin/columns/edit/${item.id}`}
                            className="font-bold text-gray-900 text-sm hover:text-[#A67C52] transition-colors line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          {/* 의뢰인 공개 페이지 새 창 열기 버튼 */}
                          <a
                            href={getPublicPostUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-600 transition-colors shrink-0 p-0.5 rounded"
                            title="의뢰인 화면에서 미리보기"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        {item.excerpt && (
                          <p className="text-xs text-gray-500 line-clamp-1">{item.excerpt}</p>
                        )}
                        {item.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.tags.split(',').filter(Boolean).slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                #{tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {item.author || '법무사 김형근'}
                    </td>

                    <td className="px-5 py-4 text-xs font-bold text-gray-700 whitespace-nowrap">
                      👁️ {item.viewCount.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublish(item.id, item.published)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          item.published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-150 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{item.published ? '공개 중' : '비공개'}</span>
                      </button>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/columns/edit/${item.id}`}
                          className="px-2.5 py-1 text-xs font-bold text-[#A67C52] bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>수정</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={deleting === item.id}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border)] flex justify-center gap-1.5">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all ${
                  page === i + 1 
                    ? 'bg-[#A67C52] text-white border-[#A67C52]' 
                    : 'border-gray-200 text-gray-600 hover:border-[#A67C52]'
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
