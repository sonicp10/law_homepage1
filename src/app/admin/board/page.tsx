'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, MessageSquare, Trash2, Send, 
  RefreshCw, CheckCircle2, Clock, Lock, X 
} from 'lucide-react';

interface BoardQna {
  id: string;
  author: string;
  phone: string;
  email: string | null;
  location: string | null;
  title: string;
  content: string;
  replyContent: string | null;
  status: string;
  isSecret: boolean;
  createdAt: string;
}

export default function AdminBoardPage() {
  const [items, setItems] = useState<BoardQna[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<BoardQna | null>(null);
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchData = async (silent = false) => {
    if (!silent) {
      if (items.length > 0) setIsRefreshing(true);
      else setLoading(true);
    }
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      });
      const res = await fetch(`/api/board-qna?${params}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);

      if (selected) {
        const updated = (data.items || []).find((it: BoardQna) => it.id === selected.id);
        if (updated) setSelected(updated);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 10000);
    return () => clearInterval(interval);
  }, [statusFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const openDetail = (item: BoardQna) => {
    setSelected(item);
    setReply(item.replyContent || '');
  };

  const saveReply = async () => {
    if (!selected || !reply.trim()) {
      alert('답변 내용을 입력하세요.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/board/${selected.id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyContent: reply }),
      });
      if (!res.ok) throw new Error();
      alert('답변이 성공적으로 등록되었습니다.');
      setSelected(null);
      fetchData();
    } catch {
      alert('답변 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, author: string) => {
    if (!confirm(`정말로 "${author}" 의뢰인의 게시글을 영구 삭제하시겠습니까?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/board/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error();
      alert('게시글이 삭제되었습니다.');
      if (selected && selected.id === id) setSelected(null);
      fetchData();
    } catch {
      alert('삭제 처리에 실패했습니다.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const pendingCount = items.filter(it => it.status !== 'ANSWERED').length;

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
            <span>💬</span> 게시판 상담 관리
          </h1>
          <p className="text-sm text-[var(--primary)]/60 mt-1">
            총 <span className="font-bold text-[#A67C52]">{total}건</span>의 1:1 상담 문의 (현재 페이지 미답변: {pendingCount}건)
          </p>
        </div>

        <button
          onClick={() => fetchData()}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#A67C52]' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 필터 및 검색 바 */}
      <div className="bg-white p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* 상태 필터 탭 */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { value: '', label: '전체 보기' },
              { value: 'PENDING', label: '⏳ 미답변' },
              { value: 'ANSWERED', label: '✅ 답변완료' },
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => { setStatusFilter(st.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  statusFilter === st.value
                    ? 'bg-[#A67C52] text-white border-[#A67C52] font-bold shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
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
                placeholder="제목, 작성자, 내용 검색"
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

      {/* 목록 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">목록을 불러오는 중입니다...</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-medium space-y-1">
            <p className="text-base font-bold text-gray-500">게시판 상담 문의가 없습니다.</p>
            <p className="text-xs">필터 조건을 변경하거나 검색어를 초기화해보세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50/80">
                  {['작성자', '제목', '공개 여부', '상태', '작성일', '관리'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => openDetail(item)}
                    className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5 font-bold text-[var(--primary)] text-sm whitespace-nowrap group-hover:text-[#A67C52] transition-colors">
                      {item.author}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[var(--primary)]/80 max-w-sm truncate">
                      <p className="font-semibold">{item.title}</p>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {item.isSecret ? (
                        <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-medium">
                          <Lock className="w-3 h-3" /> 비공개
                        </span>
                      ) : (
                        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                          공개글
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.status === 'ANSWERED' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {item.status === 'ANSWERED' ? '답변완료' : '미답변'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="px-5 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetail(item)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                            item.status === 'ANSWERED' 
                              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                              : 'bg-[#A67C52] text-white hover:bg-[#8B6840]'
                          }`}
                        >
                          {item.status === 'ANSWERED' ? '답변 수정' : '답변 작성'}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.author)}
                          disabled={deletingId === item.id}
                          className="text-xs px-2 py-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors border border-red-100"
                          title="게시글 삭제"
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

      {/* 답변 작성 및 상세 모달 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0F172A] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">1:1 게시판 상담 답변</h3>
                  <p className="text-xs text-gray-400">작성자: {selected.author} ({formatDate(selected.createdAt)})</p>
                </div>
              </div>
              <button 
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-gray-50/50">
              {/* 고객 질문 영역 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400 uppercase">의뢰인 문의</span>
                  {selected.isSecret && (
                    <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 비밀글
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 text-base">{selected.title}</h4>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {selected.content}
                </div>
                {selected.phone && (
                  <p className="text-xs text-gray-400 pt-1">
                    연락처: <span className="font-bold text-gray-700">{selected.phone}</span>
                    {selected.email && ` | 이메일: ${selected.email}`}
                    {selected.location && ` | 지역: ${selected.location}`}
                  </p>
                )}
              </div>

              {/* 답변 작성 영역 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <span>✍️</span> 관리자 답변 입력
                  </label>
                  <span className="text-[11px] text-emerald-600 font-medium">
                    저장 시 자동으로 &apos;답변완료&apos; 상태로 전환됩니다.
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="의뢰인에게 전달할 법률 상담 답변 내용을 정성껏 작성해주세요."
                  className="w-full p-3.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] focus:bg-white transition-all leading-relaxed"
                />
              </div>
            </div>

            <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <button
                type="button"
                onClick={() => handleDelete(selected.id, selected.author)}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>게시글 삭제</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={saveReply}
                  disabled={saving}
                  className="px-5 py-2 bg-[#A67C52] text-white hover:bg-[#8B6840] rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{saving ? '저장 중...' : '답변 저장하기'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
