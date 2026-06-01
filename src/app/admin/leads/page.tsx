'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, User, Phone, MapPin, Calendar, HelpCircle, 
  Briefcase, Wallet, Award, Scale, CheckCircle2, ShieldAlert
} from 'lucide-react';

const statusLabel: Record<string, string> = {
  PENDING: '대기중', CONTACTED: '연락완료', IN_PROGRESS: '진행중', COMPLETED: '완료', CANCELLED: '취소',
};
const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-200', 
  CONTACTED: 'bg-blue-100 text-blue-700 border border-blue-200',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700 border border-indigo-200', 
  COMPLETED: 'bg-green-100 text-green-700 border border-green-200', 
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
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
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
      // 모달 활성화 중이면 모달 데이터 즉각 업데이트
      setSelectedLead(prev => prev && prev.id === id ? { ...prev, status } : prev);
      fetchData(true);
    } catch { alert('상태 변경에 실패했습니다.'); }
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">상담 신청 (리드) 관리</h1>
        <p className="text-sm text-[var(--primary)]/50 mt-1">총 {total}건의 상담 신청 | 행을 클릭하면 상세 내역을 조회할 수 있습니다.</p>
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
                  <tr 
                    key={item.id} 
                    onClick={() => setSelectedLead(item)}
                    className="hover:bg-gray-50/80 transition-colors cursor-pointer"
                  >
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
                    <td className="px-4 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.status}
                        onChange={(e) => changeStatus(item.id, e.target.value)}
                        className="text-xs border border-[var(--border)] rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#A67C52] font-medium"
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

      {/* 고객 상세 보기 모달 */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* 모달 헤더 (Deep Navy & Gold 테마) */}
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

            {/* 모달 바디 (스크롤 가능) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
              
              {/* 기본 연락 정보 */}
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
                </div>
              </div>

              {/* 자가진단 결과 (extraInfo)가 있을 때 상세 정보 출력 */}
              {selectedLead.extraInfo ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 px-1">
                    <Scale className="w-4 h-4 text-[#C5A059]" /> 1분 자가진단 작성 내역
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 카테고리 1: 기초 자격 */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                      <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                        <Briefcase className="w-3.5 h-3.5" /> 01. 인적 및 소득 자격
                      </div>
                      <table className="w-full text-sm divide-y divide-gray-100">
                        <tbody>
                          <tr className="py-2 flex justify-between">
                            <td className="text-gray-400">생년월일</td>
                            <td className="font-semibold text-gray-800">{selectedLead.extraInfo.birth ? `${selectedLead.extraInfo.birth} (6자리)` : '-'}</td>
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

                    {/* 카테고리 3: 심층 상황 (1열 확장 가능) */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 md:col-span-2">
                      <div className="text-xs font-bold text-[#C5A059] flex items-center gap-1.5 uppercase tracking-wider">
                        <ShieldAlert className="w-3.5 h-3.5" /> 03. 면책 이력 및 강제집행 상황
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                        <div className="flex justify-between border-b pb-2 md:border-none md:pb-0">
                          <span className="text-gray-400">주된 채무 사유</span>
                          <strong className="text-gray-800">{selectedLead.extraInfo.debtReason || '-'}</strong>
                        </div>
                        <div className="flex justify-between border-b pb-2 md:border-none md:pb-0">
                          <span className="text-gray-400">최근 면책 이력</span>
                          <strong className="text-gray-800">{selectedLead.extraInfo.reliefHistory || '-'}</strong>
                        </div>
                        <div className="flex justify-between md:col-span-2 mt-1">
                          <span className="text-gray-400">현재 압류 / 독촉 여부</span>
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${selectedLead.extraInfo.seizureHistory === '진행 중' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                            {selectedLead.extraInfo.seizureHistory || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 자가진단 결과가 없는 일반 문의 */
                <div className="bg-[#FFF8EE] p-5 rounded-2xl border-l-4 border-[#C5A059] flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-sm text-[#7a6040]">자가진단 데이터 없음</h5>
                    <p className="text-xs text-[#7a6040]/80 mt-1">
                      이 신청은 메인 화면의 실시간 퀵 상담위젯 또는 상담 게시판을 통해 인적 사항과 간단한 상담 희망 내용만을 남긴 리드입니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 상담 내용 요약 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b pb-2">
                  <FileText className="w-4 h-4 text-[#C5A059]" /> 상세 상담 희망 내용
                </h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed py-2">
                  {selectedLead.content || '상세 입력된 상담 내용이 없습니다.'}
                </p>
              </div>
            </div>

            {/* 모달 푸터 (상태 조작 및 닫기) */}
            <div className="bg-gray-100 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#0F172A]">처리 상태 변경</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => changeStatus(selectedLead.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#C5A059] font-medium"
                >
                  {Object.entries(statusLabel).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 bg-[#0F172A] text-white hover:bg-[#1E293B] rounded-xl text-sm font-bold transition-colors"
              >
                확인 완료 / 닫기
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
