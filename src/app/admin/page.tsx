'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatsData {
  posts: { total: number; rehab: number; bankruptcy: number };
  leads: { total: number; pending: number };
  consultations: { total: number; pending: number };
  boardQna: { total: number; pending: number };
  reviews: { total: number };
  recent: {
    leads: any[];
    consultations: any[];
    boardQna: any[];
  };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONTACTED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
  ANSWERED: 'bg-green-100 text-green-700',
};
const statusLabel: Record<string, string> = {
  PENDING: '대기중',
  CONTACTED: '연락완료',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  CANCELLED: '취소',
  ANSWERED: '답변완료',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        setStats(data);
        setErr(''); // Clear error on success
      } catch {
        setErr('통계를 불러오지 못했습니다. DB 연결을 확인하세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // 10초마다 데이터 자동 갱신 (폴링)
    const interval = setInterval(fetchStats, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const statCards = stats ? [
    { label: 'About 개인회생 글', value: stats.posts.rehab, sub: `전체 ${stats.posts.total}건`, color: 'from-blue-500 to-blue-600', icon: '⚖️', link: '/admin/columns?cat=REHAB' },
    { label: 'About 개인파산 글', value: stats.posts.bankruptcy, sub: `전체 ${stats.posts.total}건`, color: 'from-emerald-500 to-emerald-600', icon: '💸', link: '/admin/columns?cat=BANKRUPTCY' },
    { label: '상담 신청', value: stats.consultations.total, sub: `대기 ${stats.consultations.pending}건`, color: 'from-[#A67C52] to-[#8B6840]', icon: '📞', link: '/admin/consultations' },
    { label: '빠른 상담 (리드)', value: stats.leads.total, sub: `대기 ${stats.leads.pending}건`, color: 'from-orange-500 to-orange-600', icon: '📌', link: '/admin/leads' },
    { label: '게시판 문의', value: stats.boardQna.total, sub: `미답변 ${stats.boardQna.pending}건`, color: 'from-green-500 to-green-600', icon: '💬', link: '/admin/board' },
    { label: '의뢰인 후기', value: stats.reviews.total, sub: '공개 후기', color: 'from-pink-500 to-pink-600', icon: '⭐', link: '/' },
  ] : [];

  if (loading) return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">관리자 대시보드</h1>
        <p className="text-[var(--primary)]/50 text-sm mt-1">통계를 불러오는 중입니다...</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">관리자 대시보드</h1>
          <p className="text-[var(--primary)]/50 text-sm mt-1">법무사 김형근 사무소 전체 현황</p>
        </div>
        <div className="text-right text-xs text-[var(--primary)]/40 font-medium">
          <p>마지막 업데이트</p>
          <p className="font-bold">{new Date().toLocaleTimeString('ko-KR')}</p>
        </div>
      </div>

      {err && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          ⚠️ {err}
        </div>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <Link key={card.label} href={card.link} className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`} />
            <div className="relative p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{card.icon}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white/60 group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <p className="text-4xl font-black mb-1">{card.value.toLocaleString()}</p>
              <p className="text-white/80 text-sm font-semibold">{card.label}</p>
              <p className="text-white/60 text-xs mt-1">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 최근 활동 */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 최근 빠른 상담 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-bold text-[var(--primary)] text-sm">📌 최근 빠른 상담 신청</h3>
              <Link href="/admin/leads" className="text-[#A67C52] text-xs font-bold hover:underline">전체보기</Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {stats.recent.leads.length === 0 ? (
                <p className="text-center py-8 text-[var(--primary)]/30 text-sm">데이터 없음</p>
              ) : stats.recent.leads.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-[var(--primary)] text-sm">{item.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                      {statusLabel[item.status] || item.status}
                    </span>
                  </div>
                  <p className="text-[var(--primary)]/50 text-xs">{item.phone} · {item.preferredType || '미분류'} · {formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 상담 신청 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-bold text-[var(--primary)] text-sm">📞 최근 상담 신청</h3>
              <Link href="/admin/consultations" className="text-[#A67C52] text-xs font-bold hover:underline">전체보기</Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {stats.recent.consultations.length === 0 ? (
                <p className="text-center py-8 text-[var(--primary)]/30 text-sm">데이터 없음</p>
              ) : stats.recent.consultations.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-[var(--primary)] text-sm">{item.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {item.type === 'PHONE' ? '전화' : '방문'}
                    </span>
                  </div>
                  <p className="text-[var(--primary)]/50 text-xs">
                    {item.phone} · {item.type === 'VISIT' ? (item.visitDate ? `📅 ${item.visitDate.split('T')[0]} ${item.visitTime || ''}` : '방문 예약') : (item.category || '미분류')} · {formatDate(item.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 게시판 문의 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
              <h3 className="font-bold text-[var(--primary)] text-sm">💬 최근 게시판 문의</h3>
              <Link href="/admin/board" className="text-[#A67C52] text-xs font-bold hover:underline">전체보기</Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {stats.recent.boardQna.length === 0 ? (
                <p className="text-center py-8 text-[var(--primary)]/30 text-sm">데이터 없음</p>
              ) : stats.recent.boardQna.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-[var(--primary)] text-sm line-clamp-1">{item.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                      {statusLabel[item.status] || item.status}
                    </span>
                  </div>
                  <p className="text-[var(--primary)]/50 text-xs">{item.author} · {formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 기능 빠른 접근 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
        <h3 className="font-bold text-[var(--primary)] mb-4">⚡ 빠른 실행</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/admin/columns/write" className="flex flex-col items-center gap-2 p-4 bg-[#A67C52]/5 border border-[#A67C52]/20 rounded-xl hover:bg-[#A67C52]/10 transition-all text-center">
            <span className="text-2xl">✍️</span>
            <span className="text-xs font-bold text-[var(--primary)]">새 글 작성</span>
          </Link>
          <Link href="/admin/consultations" className="flex flex-col items-center gap-2 p-4 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-all text-center">
            <span className="text-2xl">📋</span>
            <span className="text-xs font-bold text-[var(--primary)]">상담 관리</span>
          </Link>
          <Link href="/admin/board" className="flex flex-col items-center gap-2 p-4 bg-green-50 border border-green-100 rounded-xl hover:bg-green-100 transition-all text-center">
            <span className="text-2xl">💬</span>
            <span className="text-xs font-bold text-[var(--primary)]">게시판 답변</span>
          </Link>
          <Link href="/admin/leads" className="flex flex-col items-center gap-2 p-4 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 transition-all text-center">
            <span className="text-2xl">📌</span>
            <span className="text-xs font-bold text-[var(--primary)]">리드 관리</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
