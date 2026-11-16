'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search, Plus, Trash2, Edit3, Eye, EyeOff, RefreshCw, Star, ExternalLink, X
} from 'lucide-react';

interface Review {
  id: string;
  author: string;
  title: string;
  content: string;
  rating: number;
  isPublic: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [publicFilter, setPublicFilter] = useState(''); // '' | 'true' | 'false'
  const [searchTerm, setSearchTerm] = useState('');

  // 작성 / 수정 모달 상태
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [form, setForm] = useState({
    author: '',
    title: '',
    content: '',
    rating: 5,
    isPublic: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchReviews = async (silent = false, overrideSearch?: string) => {
    if (!silent) {
      if (reviews.length > 0) setIsRefreshing(true);
      else setLoading(true);
    }
    try {
      const q = overrideSearch !== undefined ? overrideSearch : searchTerm;
      const params = new URLSearchParams({
        ...(publicFilter && { isPublic: publicFilter }),
        ...(q.trim() && { search: q.trim() }),
      });
      const res = await fetch(`/api/admin/reviews?${params}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [publicFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReviews();
  };

  const openCreateModal = () => {
    setEditingReview(null);
    setForm({ author: '', title: '', content: '', rating: 5, isPublic: true });
    setShowModal(true);
  };

  const openEditModal = (item: Review) => {
    setEditingReview(item);
    setForm({
      author: item.author,
      title: item.title,
      content: item.content,
      rating: item.rating || 5,
      isPublic: item.isPublic,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.title.trim() || !form.content.trim()) {
      alert('작성자, 제목, 내용을 모두 입력해주세요.');
      return;
    }
    setSaving(true);
    try {
      const url = editingReview ? `/api/admin/reviews/${editingReview.id}` : '/api/admin/reviews';
      const method = editingReview ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowModal(false);
        fetchReviews(true);
      } else {
        alert(data.error || '저장에 실패했습니다.');
      }
    } catch {
      alert('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const togglePublic = async (item: Review) => {
    try {
      const res = await fetch(`/api/admin/reviews/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !item.isPublic }),
      });
      if (!res.ok) throw new Error();
      fetchReviews(true);
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (item: Review) => {
    if (!confirm(`"${item.author}" 의뢰인의 후기를 영구 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/admin/reviews/${item.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      fetchReviews(true);
    } catch {
      alert('삭제에 실패했습니다.');
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
            <span>⭐</span> 의뢰인 후기 관리
          </h1>
          <p className="text-sm text-[var(--primary)]/60 mt-1">
            총 <span className="font-bold text-[#A67C52]">{reviews.length}건</span>의 의뢰인 후기를 관리하고 홈페이지 노출 여부를 설정합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/s_story/review"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>홈페이지 후기 화면</span>
          </a>
          <button
            onClick={() => fetchReviews()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#A67C52]' : ''}`} />
            <span>새로고침</span>
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#A67C52] text-white rounded-xl text-xs font-bold hover:bg-[#8B6840] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>새 후기 등록</span>
          </button>
        </div>
      </div>

      {/* 필터 & 검색 */}
      <div className="bg-white p-5 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-400 font-bold mr-1">공개 상태:</span>
          {[
            { value: '', label: '전체' },
            { value: 'true', label: '공개 후기' },
            { value: 'false', label: '숨김(비공개)' },
          ].map((st) => (
            <button
              key={st.value}
              onClick={() => setPublicFilter(st.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                publicFilter === st.value
                  ? 'bg-gray-900 text-white border-gray-900 font-bold'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="작성자, 제목, 내용 검색"
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
              onClick={() => {
                setSearchTerm('');
                fetchReviews(false, '');
              }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              초기화
            </button>
          )}
        </form>
      </div>

      {/* 목록 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">후기 목록을 불러오는 중입니다...</div>
        ) : reviews.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-medium space-y-1">
            <p className="text-base font-bold text-gray-500">등록된 의뢰인 후기가 없습니다.</p>
            <p className="text-xs">상단의 &apos;새 후기 등록&apos; 버튼을 눌러 후기를 추가해보세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50/80">
                  {['작성자', '만족도', '제목 / 내용', '공개 상태', '작성일', '관리'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {reviews.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-[var(--primary)] whitespace-nowrap">
                      {item.author}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-0.5 text-[#A67C52]">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={`w-3.5 h-3.5 ${idx < item.rating ? 'fill-[#A67C52] text-[#A67C52]' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 max-w-md">
                      <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.content}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublic(item)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          item.isPublic
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {item.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{item.isPublic ? '공개 중' : '숨김'}</span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="px-2.5 py-1 text-xs font-bold text-[#A67C52] bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>수정</span>
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
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
      </div>

      {/* 작성 / 수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0F172A] text-white px-6 py-5 flex items-center justify-between">
              <h3 className="font-bold text-lg">
                {editingReview ? '의뢰인 후기 수정' : '새 의뢰인 후기 등록'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">작성자 이름 *</label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                    placeholder="예: 김철수 (화면에는 김*수 표시)"
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">별점 (1~5점)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                  >
                    <option value={5}>★★★★★ (5점)</option>
                    <option value={4}>★★★★☆ (4점)</option>
                    <option value={3}>★★★☆☆ (3점)</option>
                    <option value={2}>★★☆☆☆ (2점)</option>
                    <option value={1}>★☆☆☆☆ (1점)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">후기 제목 *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="후기 제목을 입력하세요"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">후기 내용 *</label>
                <textarea
                  rows={5}
                  required
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="후기 본문 내용을 입력하세요"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52] resize-none"
                />
              </div>

              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublic}
                  onChange={(e) => setForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 accent-[#A67C52]"
                />
                <span className="text-xs font-bold text-gray-700">홈페이지에 공개 노출</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#A67C52] hover:bg-[#8B6840] rounded-xl shadow-sm disabled:opacity-50"
                >
                  {saving ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
