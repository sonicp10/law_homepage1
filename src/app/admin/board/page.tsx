'use client';

import React, { useState, useEffect } from 'react';

const ADMIN_SECRET = 'lawoffice2024admin';

interface BoardQna {
  id: string; author: string; phone: string; title: string;
  content: string; replyContent: string | null; status: string; createdAt: string;
}

export default function AdminBoardPage() {
  const [items, setItems] = useState<BoardQna[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<BoardQna | null>(null);
  const [reply, setReply] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      const res = await fetch(`/api/board-qna?${params}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
    } catch { setItems([]); }
    finally { if (!silent) setLoading(false); }
  };

  useEffect(() => { 
    fetchData(); 
    const interval = setInterval(() => fetchData(true), 10000);
    return () => clearInterval(interval);
  }, [page]);

  const openDetail = (item: BoardQna) => {
    setSelected(item);
    setReply(item.replyContent || '');
  };

  const saveReply = async () => {
    if (!selected || !reply.trim()) { alert('답변 내용을 입력하세요.'); return; }
    setSaving(true);
    try {
      await fetch(`/api/admin/board/${selected.id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': ADMIN_SECRET },
        body: JSON.stringify({ replyContent: reply }),
      });
      alert('답변이 저장되었습니다!');
      setSelected(null);
      fetchData();
    } catch { alert('저장에 실패했습니다.'); }
    finally { setSaving(false); }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">게시판 상담 관리</h1>
        <p className="text-sm text-[var(--primary)]/50 mt-1">총 {total}건의 문의</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--primary)]/40">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-[var(--primary)]/30 font-semibold">게시판 문의가 없습니다.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)] bg-gray-50">
                {['작성자', '제목', '상태', '작성일', '관리'].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-bold text-[var(--primary)] text-sm">{item.author}</td>
                  <td className="px-5 py-4 text-sm text-[var(--primary)]/80 max-w-xs">
                    <p className="line-clamp-1 font-medium">{item.title}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'ANSWERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.status === 'ANSWERED' ? '답변완료' : '미답변'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--primary)]/50">{formatDate(item.createdAt)}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => openDetail(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${item.status === 'ANSWERED' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-[#A67C52]/10 text-[#A67C52] hover:bg-[#A67C52]/20'}`}>
                      {item.status === 'ANSWERED' ? '수정' : '답변'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border)] flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${page === i + 1 ? 'bg-[#A67C52] text-white border-[#A67C52]' : 'border-[var(--border)] text-[var(--primary)]/50 hover:border-[#A67C52]'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 답변 모달 */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="font-bold text-[var(--primary)] text-lg">게시판 문의 답변</h3>
              <button onClick={() => setSelected(null)} className="text-[var(--primary)]/40 hover:text-[var(--primary)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs font-bold text-[var(--primary)]/50 mb-1">작성자: {selected.author} · {formatDate(selected.createdAt)}</p>
                <p className="font-bold text-[var(--primary)] mb-2">{selected.title}</p>
                <p className="text-sm text-[var(--primary)]/70 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-2">답변 내용</label>
                <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={6}
                  placeholder="의뢰인에게 전달할 답변을 작성해 주세요..."
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-xl focus:outline-none focus:border-[#A67C52] text-sm font-medium resize-y" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSelected(null)} className="flex-1 py-3 bg-gray-100 text-[var(--primary)] rounded-xl font-bold hover:bg-gray-200 transition-all">취소</button>
                <button onClick={saveReply} disabled={saving}
                  className="flex-1 py-3 bg-[#A67C52] text-white rounded-xl font-bold hover:bg-[#8B6840] transition-all disabled:opacity-50">
                  {saving ? '저장 중...' : '💾 답변 저장'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
