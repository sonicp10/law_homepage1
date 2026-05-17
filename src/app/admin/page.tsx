'use client';

import React, { useState, useEffect, useRef } from 'react';
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

interface ToastMessage {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'LEAD' | 'CONSULTATION';
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-800 border border-amber-200',
  CONTACTED: 'bg-blue-100 text-blue-800 border border-blue-200',
  IN_PROGRESS: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  COMPLETED: 'bg-green-100 text-green-800 border border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200',
  ANSWERED: 'bg-green-100 text-green-800 border border-green-200',
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
  
  // 알림 사운드 및 토스트 설정
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // 모달 상태
  const [selectedItem, setSelectedItem] = useState<{
    item: any;
    itemType: 'LEAD' | 'CONSULTATION' | 'BOARD_QNA';
  } | null>(null);
  const [modalUpdating, setModalUpdating] = useState(false);

  // 이전 데이터 캐싱용 Ref (신규 유입 감지)
  const prevLeadsRef = useRef<any[]>([]);
  const prevConsultsRef = useRef<any[]>([]);

  // 사운드 알림음 톤 생성 (Web Audio API 활용 - 리소스 완전 무결)
  const playAlertChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // 첫 번째 음 C5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.45);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.45);
      
      // 두 번째 음 E5 (150ms 후)
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
        gain2.gain.setValueAtTime(0.12, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.55);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.55);
      }, 140);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  };

  const fetchStats = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      
      // 신규 유입 감지 로직 (ID 비교)
      if (stats !== null) {
        const newLeads = data.recent.leads.filter((nl: any) => 
          prevLeadsRef.current.length > 0 && 
          !prevLeadsRef.current.some((ol: any) => ol.id === nl.id)
        );
        const newConsults = data.recent.consultations.filter((nc: any) => 
          prevConsultsRef.current.length > 0 && 
          !prevConsultsRef.current.some((oc: any) => oc.id === nc.id)
        );

        if (newLeads.length > 0 || newConsults.length > 0) {
          playAlertChime();
          
          const newToasts: ToastMessage[] = [];
          newLeads.forEach((nl: any) => {
            newToasts.push({
              id: Math.random().toString(),
              title: '🆕 신규 빠른 상담(리드) 접수!',
              desc: `${nl.name}님 (${nl.preferredType || '미분류'})의 리드가 도착했습니다.`,
              time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              type: 'LEAD',
            });
          });
          newConsults.forEach((nc: any) => {
            newToasts.push({
              id: Math.random().toString(),
              title: `🆕 신규 ${nc.type === 'VISIT' ? '방문' : '전화'} 상담 신청!`,
              desc: `${nc.name}님 (${nc.type === 'VISIT' ? '방문예약' : nc.category || '미분류'})의 신청이 접수되었습니다.`,
              time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
              type: 'CONSULTATION',
            });
          });
          
          setToasts(prev => [...newToasts, ...prev].slice(0, 5)); // 최대 5개 유지
        }
      }

      // 이전 데이터 Ref 업데이트
      prevLeadsRef.current = data.recent.leads;
      prevConsultsRef.current = data.recent.consultations;

      setStats(data);
      setErr('');
    } catch {
      setErr('통계를 불러오지 못했습니다. DB 연결 또는 세션 상태를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 사운드 설정 로컬저장소 확인
    const savedSound = localStorage.getItem('admin_sound_alert');
    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }

    fetchStats();
    
    // 10초마다 백그라운드 자동 갱신 및 신규 접수 모니터링
    const interval = setInterval(() => fetchStats(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    localStorage.setItem('admin_sound_alert', String(nextVal));
    if (nextVal) {
      // 오디오 동작 허용 보증용 소형 플레이
      playAlertChime();
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // 모달 안에서 상태를 즉시 업데이트하는 기능
  const handleUpdateStatusInModal = async (newStatus: string) => {
    if (!selectedItem) return;
    setModalUpdating(true);
    const { item, itemType } = selectedItem;
    
    try {
      const endpoint = itemType === 'LEAD' 
        ? `/api/admin/leads/${item.id}` 
        : `/api/admin/consultations/${item.id}`;
        
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) throw new Error('Update failed');
      
      // 즉각 데이터 갱신 및 모달 닫기
      await fetchStats(true);
      setSelectedItem(null);
    } catch {
      alert('상태 변경에 실패했습니다. 관리자 권한을 체크하십시오.');
    } finally {
      setModalUpdating(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // 한국 시간(UTC+9) 기준 오늘 날짜 구하기
  const getKoreaTodayStr = () => {
    const offset = 9 * 60 * 60 * 1000; 
    const krDate = new Date(Date.now() + offset);
    return krDate.toISOString().split('T')[0];
  };

  // 오늘 예정된 방문 상담 매핑
  const getTodayVisitors = () => {
    if (!stats) return [];
    const todayStr = getKoreaTodayStr();
    return stats.recent.consultations.filter((item: any) => 
      item.type === 'VISIT' && 
      item.visitDate && 
      item.visitDate.startsWith(todayStr)
    );
  };

  const todayVisitors = getTodayVisitors();
  const statCards = stats ? [
    { label: 'About 개인회생 글', value: stats.posts.rehab, sub: `전체 ${stats.posts.total}건`, color: 'from-blue-500 to-blue-600', icon: '⚖️', link: '/admin/columns?cat=REHAB' },
    { label: 'About 개인파산 글', value: stats.posts.bankruptcy, sub: `전체 ${stats.posts.total}건`, color: 'from-emerald-500 to-emerald-600', icon: '💸', link: '/admin/columns?cat=BANKRUPTCY' },
    { label: '상담 신청', value: stats.consultations.total, sub: `대기 ${stats.consultations.pending}건`, color: 'from-[#A67C52] to-[#8B6840]', icon: '📞', link: '/admin/consultations' },
    { label: '빠른 상담 (리드)', value: stats.leads.total, sub: `대기 ${stats.leads.pending}건`, color: 'from-orange-500 to-orange-600', icon: '📌', link: '/admin/leads' },
    { label: '게시판 문의', value: stats.boardQna.total, sub: `미답변 ${stats.boardQna.pending}건`, color: 'from-green-500 to-green-600', icon: '💬', link: '/admin/board' },
    { label: '의뢰인 후기', value: stats.reviews.total, sub: '공개 후기', color: 'from-pink-500 to-pink-600', icon: '⭐', link: '/' },
  ] : [];

  if (loading) return (
    <div className="space-y-8 animate-pulse">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">관리자 대시보드</h1>
        <p className="text-[var(--primary)]/50 text-sm mt-1">실시간 통계 및 알림 엔진 활성화 중...</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-150 rounded-2xl" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
      {/* 헤더 및 알림 컨트롤러 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] flex items-center gap-2">
            <span>💻</span> 관리자 통합 관제 센터
          </h1>
          <p className="text-[var(--primary)]/60 text-sm mt-1 font-medium">법무사 김형근 사무소 전체 실시간 현황 브리핑</p>
        </div>
        
        <div className="flex items-center gap-4 text-right">
          {/* 사운드 활성 토글 */}
          <button 
            onClick={toggleSound}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              soundEnabled 
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span>{soundEnabled ? '🔔 실시간 알림음 On' : '🔕 사운드 끔'}</span>
            <div className={`w-2 h-2 rounded-full ${soundEnabled ? 'bg-amber-500 animate-ping' : 'bg-gray-300'}`} />
          </button>

          <div className="text-xs text-[var(--primary)]/40 font-medium">
            <p className="text-[var(--primary)]/50">실시간 동기화 완료</p>
            <p className="font-bold text-[var(--primary)] text-sm">{new Date().toLocaleTimeString('ko-KR')}</p>
          </div>
        </div>
      </div>

      {err && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
          ⚠️ {err}
        </div>
      )}

      {/* 강화 기능 1: 오늘의 방문 상담 현황 브리핑 */}
      {todayVisitors.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-3.5 w-3.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-purple-600"></span>
              </span>
              <h2 className="text-base font-bold text-purple-900">📅 오늘 예정된 방문 상담 일정 ({todayVisitors.length}건)</h2>
            </div>
            <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1 rounded-lg">
              오늘: {getKoreaTodayStr()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todayVisitors.map((visitor: any) => (
              <div 
                key={visitor.id} 
                onClick={() => setSelectedItem({ item: visitor, itemType: 'CONSULTATION' })}
                className="bg-white p-4 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-purple-950 text-sm">{visitor.name} 의뢰인</span>
                  <span className="text-xs font-extrabold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                    {visitor.visitTime || '시간 미지정'}
                  </span>
                </div>
                <div className="text-xs text-purple-900/60 font-medium space-y-1">
                  <p>📞 {visitor.phone}</p>
                  <p>📍 지역: {visitor.location || '미입력'}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-purple-600/70 mt-3 font-semibold">💡 방문 30분 전 의뢰인에게 전화를 드려 방문 안내를 도와주시면 더욱 신뢰를 드립니다.</p>
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

      {/* 최근 활동 목록 (각 목록 행 클릭 시 상세 모달 오픈 기능 장착) */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 최근 빠른 상담 (리드) */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-amber-50/20">
              <h3 className="font-bold text-[var(--primary)] text-sm flex items-center gap-1.5">
                <span>📌</span> 최근 빠른 상담 신청
              </h3>
              <Link href="/admin/leads" className="text-[#A67C52] text-xs font-bold hover:underline">전체보기</Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {stats.recent.leads.length === 0 ? (
                <p className="text-center py-8 text-[var(--primary)]/30 text-sm">데이터 없음</p>
              ) : stats.recent.leads.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem({ item, itemType: 'LEAD' })}
                  className="p-4 hover:bg-amber-50/30 active:bg-amber-50/50 cursor-pointer transition-colors duration-200 group animate-fade-in"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-[var(--primary)] text-sm group-hover:text-[#A67C52] transition-colors">{item.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                      {statusLabel[item.status] || item.status}
                    </span>
                  </div>
                  <p className="text-[var(--primary)]/50 text-xs font-semibold">{item.phone} · {item.preferredType || '미분류'} · {formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 전화/방문 상담 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-blue-50/10">
              <h3 className="font-bold text-[var(--primary)] text-sm flex items-center gap-1.5">
                <span>📞</span> 최근 전화/방문 상담 신청
              </h3>
              <Link href="/admin/consultations" className="text-[#A67C52] text-xs font-bold hover:underline">전체보기</Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {stats.recent.consultations.length === 0 ? (
                <p className="text-center py-8 text-[var(--primary)]/30 text-sm">데이터 없음</p>
              ) : stats.recent.consultations.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem({ item, itemType: 'CONSULTATION' })}
                  className="p-4 hover:bg-blue-50/20 active:bg-blue-50/30 cursor-pointer transition-colors duration-200 group animate-fade-in"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-[var(--primary)] text-sm group-hover:text-[#A67C52] transition-colors">{item.name}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      item.type === 'PHONE' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {item.type === 'PHONE' ? '전화' : '방문'}
                    </span>
                  </div>
                  <p className="text-[var(--primary)]/50 text-xs font-semibold">
                    {item.phone} · {item.type === 'VISIT' ? (item.visitDate ? `📅 ${item.visitDate.split('T')[0]} ${item.visitTime || ''}` : '방문 예약') : (item.category || '미분류')} · {formatDate(item.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 게시판 Q&A 문의 */}
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-[var(--border)] bg-green-50/10">
              <h3 className="font-bold text-[var(--primary)] text-sm flex items-center gap-1.5">
                <span>💬</span> 최근 게시판 문의
              </h3>
              <Link href="/admin/board" className="text-[#A67C52] text-xs font-bold hover:underline">전체보기</Link>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {stats.recent.boardQna.length === 0 ? (
                <p className="text-center py-8 text-[var(--primary)]/30 text-sm">데이터 없음</p>
              ) : stats.recent.boardQna.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem({ item, itemType: 'BOARD_QNA' })}
                  className="p-4 hover:bg-green-50/20 active:bg-green-50/30 cursor-pointer transition-colors duration-200 group animate-fade-in"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-[var(--primary)] text-sm line-clamp-1 group-hover:text-[#A67C52] transition-colors">{item.title}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[item.status] || 'bg-gray-100 text-gray-500'}`}>
                      {statusLabel[item.status] || item.status}
                    </span>
                  </div>
                  <p className="text-[var(--primary)]/50 text-xs font-semibold">{item.author} · {formatDate(item.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 기능 빠른 접근 */}
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--border)] p-6">
        <h3 className="font-bold text-[var(--primary)] mb-4">⚡ 관제 센터 퀵 메뉴</h3>
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

      {/* 우측 하단 신규 알림 토스트 레이아웃 */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80 sm:w-96 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-xl shadow-2xl border flex flex-col gap-1.5 animate-bounce bg-white pointer-events-auto transition-all ${
              toast.type === 'LEAD' ? 'border-orange-200 shadow-orange-100/50' : 'border-blue-200 shadow-blue-100/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-gray-800">{toast.title}</span>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-600 font-semibold">{toast.desc}</p>
            <span className="text-[10px] text-gray-400 font-medium text-right mt-1">{toast.time}</span>
          </div>
        ))}
      </div>

      {/* 강화 기능 2: 대시보드 퀵 액션 상세 모달 시스템 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 transform scale-100 transition-all">
            
            {/* 모달 헤더 */}
            <div className={`p-5 text-white flex items-center justify-between bg-gradient-to-r ${
              selectedItem.itemType === 'LEAD' ? 'from-orange-500 to-orange-600' : 
              selectedItem.itemType === 'CONSULTATION' ? 'from-[#A67C52] to-[#8B6840]' : 
              'from-green-500 to-green-600'
            }`}>
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
                  {selectedItem.itemType === 'LEAD' ? '빠른 상담 (리드)' : 
                   selectedItem.itemType === 'CONSULTATION' ? `${selectedItem.item.type === 'VISIT' ? '방문 상담 예약' : '전화 상담 신청'}` :
                   '게시판 문의 내용'}
                </span>
                <h3 className="text-lg font-bold">
                  {selectedItem.itemType === 'BOARD_QNA' ? selectedItem.item.author : selectedItem.item.name} 의뢰인 신청 건
                </h3>
              </div>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* 모달 바디 */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* 고객 기본 정보 */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-150">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold">의뢰인 이름</p>
                  <p className="text-sm font-extrabold text-[var(--primary)]">
                    {selectedItem.itemType === 'BOARD_QNA' ? selectedItem.item.author : selectedItem.item.name}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold">신청일시</p>
                  <p className="text-xs font-semibold text-[var(--primary)]">
                    {new Date(selectedItem.item.createdAt).toLocaleString('ko-KR')}
                  </p>
                </div>
                
                {selectedItem.itemType !== 'BOARD_QNA' && (
                  <div className="col-span-2 flex items-center justify-between border-t border-gray-200/50 pt-2 mt-1">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold">연락처</p>
                      <p className="text-sm font-extrabold text-blue-700">{selectedItem.item.phone}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(selectedItem.item.phone);
                          alert('연락처가 클립보드에 복사되었습니다.');
                        }}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-2.5 py-1.5 rounded-lg border border-blue-200 font-bold transition-all"
                      >
                        📋 복사
                      </button>
                      <a 
                        href={`tel:${selectedItem.item.phone}`}
                        className="bg-green-50 hover:bg-green-100 text-green-700 text-xs px-2.5 py-1.5 rounded-lg border border-green-200 font-bold transition-all"
                      >
                        📞 통화
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* 세부 예약/신청 정보 */}
              <div className="space-y-3">
                
                {selectedItem.itemType === 'LEAD' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.item.debtAmount && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold">부채 규모</p>
                          <p className="text-sm font-bold text-gray-800">{selectedItem.item.debtAmount}</p>
                        </div>
                      )}
                      {selectedItem.item.location && (
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold">거주지역</p>
                          <p className="text-sm font-bold text-gray-800">{selectedItem.item.location}</p>
                        </div>
                      )}
                    </div>
                    {selectedItem.item.content && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">상담 세부 고충</p>
                        <div className="p-3 bg-amber-50/30 border border-amber-100 rounded-lg text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {selectedItem.item.content}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedItem.itemType === 'CONSULTATION' && (
                  <>
                    {selectedItem.item.type === 'VISIT' && (
                      <div className="bg-purple-50/55 p-3 rounded-lg border border-purple-100 grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <p className="text-[10px] text-purple-800 font-bold">📅 방문 예약 일시</p>
                          <p className="text-sm font-extrabold text-purple-900 mt-0.5">
                            {selectedItem.item.visitDate ? selectedItem.item.visitDate.split('T')[0] : '미지정'} {selectedItem.item.visitTime || ''}
                          </p>
                        </div>
                        {selectedItem.item.location && (
                          <div>
                            <p className="text-[10px] text-purple-800 font-bold">📍 방문 예정 지역</p>
                            <p className="text-xs font-bold text-purple-900 mt-0.5">{selectedItem.item.location}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedItem.item.type === 'PHONE' && selectedItem.item.category && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold">관심 상담 업무분야</p>
                        <p className="text-sm font-bold text-gray-800">{selectedItem.item.category}</p>
                      </div>
                    )}

                    {selectedItem.item.content && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">의뢰인 추가 상세 메모</p>
                        <div className="p-3 bg-gray-50 border border-gray-150 rounded-lg text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {selectedItem.item.content}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedItem.itemType === 'BOARD_QNA' && (
                  <>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold mb-0.5">문의 제목</p>
                      <p className="text-sm font-bold text-gray-800">{selectedItem.item.title}</p>
                    </div>
                    {selectedItem.item.content && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold mb-1">문의 본문 내용</p>
                        <div className="p-3 bg-green-50/10 border border-green-100 rounded-lg text-xs text-gray-700 max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                          {selectedItem.item.content}
                        </div>
                      </div>
                    )}
                  </>
                )}

              </div>

              {/* 강화된 상태 변경 기능 (모달 내부에서 direct 업데이트) */}
              {selectedItem.itemType !== 'BOARD_QNA' && (
                <div className="border-t border-gray-200/50 pt-4 mt-2">
                  <p className="text-[10px] text-gray-400 font-bold mb-2">⚡ 진행 상태 변경 처리</p>
                  
                  {modalUpdating ? (
                    <div className="text-center py-2 text-xs font-bold text-[#A67C52] animate-pulse">
                      처리 중... 잠시만 기다려주세요.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {Object.entries(statusLabel).map(([sKey, sLabel]) => (
                        <button
                          key={sKey}
                          onClick={() => handleUpdateStatusInModal(sKey)}
                          className={`px-2 py-2 rounded-lg text-xs font-extrabold transition-all border ${
                            selectedItem.item.status === sKey
                              ? 'bg-[#A67C52] text-white border-[#A67C52] shadow-sm'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-[#A67C52] hover:text-[#A67C52]'
                          }`}
                        >
                          {sLabel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* 모달 푸터 */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-150">
              <span className="text-[10px] text-gray-400 font-semibold">
                ※ 상태 변경 시 목록 데이터에 실시간 자동 반영됩니다.
              </span>
              <button 
                onClick={() => setSelectedItem(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-4 py-2 rounded-xl font-bold transition-all"
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
