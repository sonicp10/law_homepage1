'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Phone, Calendar, MapPin, 
  User, CheckCircle2, AlertCircle, X, RefreshCw 
} from 'lucide-react';

const statusLabel: Record<string, string> = {
  PENDING: '대기중',
  CONTACTED: '연락완료',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELLED: '취소',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border border-amber-200',
  CONTACTED: 'bg-blue-100 text-blue-800 border border-blue-200',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  COMPLETED: 'bg-green-100 text-green-800 border border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200',
};

interface Consultation {
  id: string;
  name: string;
  phone: string;
  type: string;
  category: string | null;
  location: string | null;
  status: string;
  content: string | null;
  visitDate: string | null;
  visitTime: string | null;
  createdAt: string;
}

export default function AdminConsultationsPage() {
  const [items, setItems] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 상세 모달 상태
  const [selectedItem, setSelectedItem] = useState<Consultation | null>(null);

  const fetchData = async (silent = false) => {
    if (!silent) {
      if (items.length > 0) setIsRefreshing(true);
      else setLoading(true);
    }
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(searchTerm.trim() && { search: searchTerm.trim() }),
      });
      const res = await fetch(`/api/admin/consultations/list?${params}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);

      if (selectedItem) {
        const updated = (data.items || []).find((it: Consultation) => it.id === selectedItem.id);
        if (updated) setSelectedItem(updated);
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
  }, [typeFilter, statusFilter, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const changeStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(prev => prev ? { ...prev, status } : prev);
      }
      fetchData(true);
    } catch {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // CSV 다운로드 기능
  const exportToCsv = () => {
    if (items.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    const headers = ['이름,연락처,유형,희망분야/예약시간,지역,상태,신청일시,상담내용'];
    const rows = items.map(it => {
      const typeStr = it.type === 'VISIT' ? '방문상담' : '전화상담';
      const visitStr = it.type === 'VISIT' ? `${it.visitDate?.split('T')[0] || ''} ${it.visitTime || ''}` : (it.category || '');
      const contentStr = `"${(it.content || '').replace(/"/g, '""')}"`;
      return `"${it.name}","${it.phone}","${typeStr}","${visitStr}","${it.location || ''}","${statusLabel[it.status] || it.status}","${formatDate(it.createdAt)}",${contentStr}`;
    });
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `전화_방문상담목록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const pendingCount = items.filter(it => it.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      {/* 상단 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
            <span>📞</span> 전화/방문 상담 관리
          </h1>
          <p className="text-sm text-[var(--primary)]/60 mt-1">
            총 <span className="font-bold text-[#A67C52]">{total}건</span>의 상담 신청이 접수되었습니다. (현재 페이지 대기: {pendingCount}건)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData()}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#A67C52]' : ''}`} />
            <span>새로고침</span>
          </button>
          <button
            onClick={exportToCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#A67C52] text-white rounded-xl text-xs font-bold hover:bg-[#8B6840] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV 다운로드</span>
          </button>
        </div>
      </div>

      {/* 필터 및 검색 컨트롤러 */}
      <div className="bg-white p-5 rounded-2xl border border-[var(--border)] shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* 1. 유형 필터 (전화/방문) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { value: '', label: '전체 유형' },
              { value: 'PHONE', label: '📞 전화 상담' },
              { value: 'VISIT', label: '📅 방문 상담' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setTypeFilter(opt.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  typeFilter === opt.value
                    ? 'bg-[#A67C52] text-white border-[#A67C52] shadow-sm'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* 2. 검색창 */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름, 연락처, 지역 검색"
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

        {/* 3. 상태 필터 (전체, 대기중, 연락완료, 진행중, 완료, 취소) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-bold mr-1">상태별:</span>
          {[{ value: '', label: '전체 상태' }, ...Object.entries(statusLabel).map(([k, v]) => ({ value: k, label: v }))].map((st) => (
            <button
              key={st.value}
              onClick={() => { setStatusFilter(st.value); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === st.value
                  ? 'bg-gray-900 text-white font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">목록을 불러오는 중입니다...</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-medium space-y-1">
            <p className="text-base font-bold text-gray-500">조회된 상담 내역이 없습니다.</p>
            <p className="text-xs">필터 조건을 변경하거나 검색어를 초기화해보세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50/80">
                  {['이름', '연락처', '유형', '업무분야 / 예약일시', '지역', '상담 내용 요약', '상태', '신청일', '상태 변경'].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedItem(item)}
                    className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-bold text-[var(--primary)] text-sm whitespace-nowrap group-hover:text-[#A67C52] transition-colors">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 font-medium whitespace-nowrap">
                      {item.phone}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.type === 'PHONE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.type === 'PHONE' ? '전화' : '방문'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      {item.type === 'VISIT' ? (
                        item.visitDate ? (
                          <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            📅 {item.visitDate.split('T')[0]} {item.visitTime || ''}
                          </span>
                        ) : '시간 미지정'
                      ) : (
                        item.category || '-'
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">{item.location || '-'}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 max-w-xs truncate">
                      {item.content || <span className="text-gray-300">내용 없음</span>}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[item.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusLabel[item.status] || item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.status}
                        onChange={(e) => changeStatus(item.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#A67C52] font-medium"
                      >
                        {Object.entries(statusLabel).map(([v, l]) => (
                          <option key={v} value={v}>{l}</option>
                        ))}
                      </select>
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

      {/* 상담 상세 조회 모달 */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#0F172A] text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                  {selectedItem.type === 'VISIT' ? <Calendar className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedItem.name} 의뢰인 상담 상세</h3>
                  <p className="text-xs text-gray-400">신청일시: {formatDate(selectedItem.createdAt)}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto bg-gray-50/50">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">신청인 기본 정보</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-400 block">연락처</span>
                    <strong className="text-gray-900">{selectedItem.phone}</strong>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">상담 유형</span>
                    <span className="font-bold text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                      {selectedItem.type === 'VISIT' ? '방문 상담' : '전화 상담'}
                    </span>
                  </div>
                  {selectedItem.type === 'VISIT' && (
                    <div className="col-span-2 bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                      <span className="text-xs text-purple-700 font-bold block">📅 예약 희망 일시</span>
                      <strong className="text-purple-950 text-sm">
                        {selectedItem.visitDate ? selectedItem.visitDate.split('T')[0] : '날짜 미지정'} {selectedItem.visitTime || ''}
                      </strong>
                    </div>
                  )}
                  {selectedItem.location && (
                    <div>
                      <span className="text-xs text-gray-400 block">거주 지역</span>
                      <strong className="text-gray-800">{selectedItem.location}</strong>
                    </div>
                  )}
                  {selectedItem.category && (
                    <div>
                      <span className="text-xs text-gray-400 block">상담 희망 분야</span>
                      <strong className="text-gray-800">{selectedItem.category}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* 상담 내용 본문 */}
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">작성된 상담 내용</h4>
                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed min-h-[80px]">
                  {selectedItem.content || '별도 입력된 상담 내용이 없습니다.'}
                </div>
              </div>
            </div>

            <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">처리 상태:</span>
                <select
                  value={selectedItem.status}
                  onChange={(e) => changeStatus(selectedItem.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:outline-none focus:border-[#A67C52]"
                >
                  {Object.entries(statusLabel).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
