'use client';

import React, { useState, useEffect } from 'react';

const statusLabel: Record<string, string> = {
  PENDING: '대기중', CONTACTED: '연락완료', IN_PROGRESS: '진행중', COMPLETED: '완료', CANCELLED: '취소',
};
const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700', CONTACTED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700', COMPLETED: 'bg-green-100 text-green-700', CANCELLED: 'bg-gray-100 text-gray-500',
};

interface Lead {
  id: string; name: string; phone: string; location: string | null; debtAmount: string | null;
  preferredType: string | null; content: string | null; status: string;
  source: string | null; createdAt: string;
}

export default function AdminLeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      const res = await fetch(`/api/admin/leads?${params}`);
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

  const changeStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchData();
    } catch { alert('상태 변경에 실패했습니다.'); }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">빠른 상담 신청 (리드) 관리</h1>
        <p className="text-sm text-[var(--primary)]/50 mt-1">총 {total}건의 상담 신청</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--primary)]/40">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-[var(--primary)]/30 font-semibold">상담 신청이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50">
                  {['이름', '연락처', '지역', '채무액', '희망제도', '상담내용', '유입경로', '상태', '신청일', '변경'].map((h) => (
                    <th key={h} className="text-left px-4 py-4 text-xs font-bold text-[var(--primary)]/50 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-bold text-[var(--primary)] text-sm whitespace-nowrap">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-[var(--primary)]/70 font-medium whitespace-nowrap">{item.phone}</td>
                    <td className="px-4 py-4 text-sm text-[var(--primary)]/60 whitespace-nowrap">{item.location || '-'}</td>
                    <td className="px-4 py-4 text-sm text-[var(--primary)]/60 whitespace-nowrap">{item.debtAmount || '-'}</td>
                    <td className="px-4 py-4 text-sm text-[var(--primary)]/60 whitespace-nowrap">{item.preferredType || '-'}</td>
                    <td className="px-4 py-4 text-sm text-[var(--primary)]/60 max-w-xs">
                      <p className="line-clamp-1">{item.content || '-'}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                        {item.source || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                        {statusLabel[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-[var(--primary)]/50 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => changeStatus(item.id, e.target.value)}
                        className="text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#A67C52] font-medium appearance-none"
                      >
                        {Object.entries(statusLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
