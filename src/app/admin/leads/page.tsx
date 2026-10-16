'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, MapPin, Calendar, HelpCircle, 
  Briefcase, Wallet, Scale, ShieldAlert, FileText,
  Search, Download, RefreshCw, Trash2
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

interface Lead {
  id: string; 
  name: string; 
  phone: string; 
  location: string | null; 
  debtAmount: string | null;
  preferredType: string | null; 
  content: string | null; 
  status: string;
  source: string | null; 
  createdAt: string;
  extraInfo?: any;
}

export default function AdminLeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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
      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.totalCount || 0);
      setTotalPages(data.totalPages || 1);
      
      // 모달이 열려있는 상태라면 최신 데이터로 모달 상태 갱신
      if (selectedLead) {
        const currentUpdated = (data.items || []).find((item: Lead) => item.id === selectedLead.id);
        if (currentUpdated) {
          setSelectedLead(currentUpdated);
        }
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

  const changeStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setSelectedLead(prev => prev && prev.id === id ? { ...prev, status } : prev);
      fetchData(true);
    } catch { 
      alert('상태 변경에 실패했습니다.'); 
    }
  };

  const deleteLead = async (id: string, name: string) => {
    if (!confirm(`'${name}' 고객의 상담 신청 내역을 영구 삭제하시겠습니까?`)) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedLead?.id === id) setSelectedLead(null);
        fetchData(true);
      } else {
        alert('삭제에 실패했습니다.');
      }
    } catch {
      alert('서버 연결 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const exportToCsv = () => {
    if (items.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    const headers = ['이름,연락처,지역,채무액,희망제도,상태,유입경로,신청일시,상담내용'];
    const rows = items.map(it => {
      const contentStr = `"${(it.content || '').replace(/"/g, '""')}"`;
      return `"${it.name}","${it.phone}","${it.location || ''}","${it.debtAmount || ''}","${it.preferredType || ''}","${statusLabel[it.status] || it.status}","${it.source || ''}","${formatDate(it.createdAt)}",${contentStr}`;
    });
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `빠른상담_리드목록_${new Date().toISOString().split('T')[0]}.csv`;
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
            <span>📌</span> 빠른 상담 (리드) 관리
          </h1>
          <p className="text-sm text-[var(--primary)]/60 mt-1">
            총 <span className="font-bold text-[#A67C52]">{total}건</span>의 상담 신청 (현재 페이지 대기: {pendingCount}건) | 행을 클릭하면 자가진단 상세 내역을 조회할 수 있습니다.
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* 상태 필터 버튼 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-gray-400 font-bold mr-1">상태별:</span>
            {[{ value: '', label: '전체' }, ...Object.entries(statusLabel).map(([k, v]) => ({ value: k, label: v }))].map((st) => (
              <button
                key={st.value}
                onClick={() => { setStatusFilter(st.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  statusFilter === st.value
                    ? 'bg-gray-900 text-white border-gray-900 font-bold shadow-sm'
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
                placeholder="이름, 연락처, 지역, 희망제도"
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
          <div className="p-12 text-center text-gray-400 text-sm">목록을 불러오는 중입니다...</div>
        ) : items.length === 0 ? (
          <div className="p-16 text-center text-gray-400 font-medium space-y-1">
            <p className="text-base font-bold text-gray-500">상담 신청 리드가 없습니다.</p>
            <p className="text-xs">필터 조건을 변경하거나 검색어를 초기화해보세요.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-[var(--border)] bg-gray-50/80">
                  {['이름', '연락처', '지역', '채무액', '희망제도', '상담내용 요약', '유입경로', '상태', '신청일', '상태 변경', '관리'].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedLead(item)}
                    className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3.5 font-bold text-[var(--primary)] text-sm whitespace-nowrap group-hover:text-[#A67C52] transition-colors">
                      {item.name}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700 font-medium whitespace-nowrap">
                      {item.phone}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">{item.location || '-'}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-red-600 whitespace-nowrap">{item.debtAmount || '-'}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-600 whitespace-nowrap">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                        {item.preferredType || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 max-w-xs truncate">
                      {item.content || (item.extraInfo ? '1분 자가진단 작성완료' : '-')}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        {item.source || '일반 접수'}
                      </span>
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
                    <td className="px-4 py-3.5 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => deleteLead(item.id, item.name)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="상담 신청 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* 고객 상세 보기 모달 */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* 모달 헤더 */}
            <div className="bg-[#0F172A] text-white px-6 py-5 flex items-center justify-between border-b border-[#C5A059]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center">
                  <User className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {selectedLead.name} 고객 상세 정보
                  </h3>
                  <p className="text-xs text-gray-400">신청일시: {formatDate(selectedLead.createdAt)}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 모달 바디 */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
              
              {/* 기본 신청 정보 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-[#0F172A] border-b pb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C5A059]" /> 기본 신청 정보
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs">연락처</span>
                    <strong className="text-[#0F172A] text-base">{selectedLead.phone}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs">유입 경로</span>
                    <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/10">
                      {selectedLead.source || '일반 접수'}
                    </span>
                  </div>
                  {selectedLead.location && (
                    <div>
                      <span className="text-gray-400 block text-xs">지역</span>
                      <strong className="text-gray-800">{selectedLead.location}</strong>
                    </div>
                  )}
                  {selectedLead.preferredType && (
                    <div>
                      <span className="text-gray-400 block text-xs">희망 제도</span>
                      <strong className="text-gray-800">{selectedLead.preferredType}</strong>
                    </div>
                  )}
                  {selectedLead.debtAmount && (
                    <div>
                      <span className="text-gray-400 block text-xs">채무 금액</span>
                      <strong className="text-red-600 font-bold">{selectedLead.debtAmount}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* 자가진단 항목 (extraInfo가 있는 경우) */}
              {selectedLead.extraInfo ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 px-1">
                    <Scale className="w-4 h-4 text-[#C5A059]" /> 1분 자가진단 세부 내역
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 카테고리 1: 소득 자격 */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                        <Briefcase className="w-3.5 h-3.5" /> 01. 인적 및 소득 자격
                      </div>
                      <table className="w-full text-sm divide-y divide-gray-100">
                        <tbody>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">생년월일</td>
                            <td className="font-semibold text-gray-800">{selectedLead.extraInfo.birth || '-'}</td>
                          </tr>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">현재 직업</td>
                            <td className="font-semibold text-gray-800">{selectedLead.extraInfo.occupation || '-'}</td>
                          </tr>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">월 평균 소득</td>
                            <td className="font-semibold text-[#C5A059]">{selectedLead.extraInfo.monthlyIncome || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 카테고리 2: 재산 및 채무 */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                        <Wallet className="w-3.5 h-3.5" /> 02. 재산 및 채무 상황
                      </div>
                      <table className="w-full text-sm divide-y divide-gray-100">
                        <tbody>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">총 채무 원금</td>
                            <td className="font-bold text-[#e74c3c]">{selectedLead.extraInfo.totalDebt || selectedLead.debtAmount || '-'}</td>
                          </tr>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">채권자 수</td>
                            <td className="font-semibold text-gray-800">{selectedLead.extraInfo.creditorCount ? `${selectedLead.extraInfo.creditorCount}곳` : '-'}</td>
                          </tr>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">거주 형태</td>
                            <td className="font-semibold text-gray-800">{selectedLead.extraInfo.housingType || '-'}</td>
                          </tr>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">주요 자산 보유</td>
                            <td className="font-semibold text-gray-800">{selectedLead.extraInfo.hasMajorAssets || '-'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 카테고리 3: 심층 상황 */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 md:col-span-2">
                      <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                        <ShieldAlert className="w-3.5 h-3.5" /> 03. 면책 이력 및 독촉 상황
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex justify-between border-b pb-2 md:border-none md:pb-0">
                          <span className="text-gray-400">주된 채무 사유</span>
                          <strong className="text-gray-800">{selectedLead.extraInfo.debtReason || '-'}</strong>
                        </div>
                        <div className="flex justify-between border-b pb-2 md:border-none md:pb-0">
                          <span className="text-gray-400">최근 면책 이력</span>
                          <strong className="text-gray-800">{selectedLead.extraInfo.reliefHistory || '-'}</strong>
                        </div>
                        <div className="flex justify-between md:col-span-2 pt-2">
                          <span className="text-gray-400 font-semibold">현재 압류 / 독촉 상태</span>
                          <span className={`px-2.5 py-0.5 rounded font-bold text-xs ${
                            selectedLead.extraInfo.seizureHistory === '진행 중' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                          }`}>
                            {selectedLead.extraInfo.seizureHistory || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* 상담 내용 메모 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b pb-2">
                  <FileText className="w-4 h-4 text-[#C5A059]" /> 상담 문의 및 접수 메모
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed py-2">
                  {selectedLead.content || '작성된 추가 상담 내용이 없습니다.'}
                </p>
              </div>

            </div>

            {/* 모달 푸터 */}
            <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">처리 상태 변경:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => changeStatus(selectedLead.id, e.target.value)}
                  className="text-xs border border-gray-300 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#C5A059] font-medium"
                >
                  {Object.entries(statusLabel).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => deleteLead(selectedLead.id, selectedLead.name)}
                  className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-rose-200"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 삭제
                </button>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="px-5 py-2 bg-[#0F172A] text-white hover:bg-[#1E293B] rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  닫기
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
