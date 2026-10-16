'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell 
} from 'recharts';
import { 
  Users, Eye, MousePointer2, ArrowUpRight, Calendar, 
  RefreshCcw, Globe, Link2, ExternalLink,
  Sparkles, Lightbulb, TrendingUp, Clock, Smartphone, Monitor, PhoneCall, MessageSquare, ShieldCheck
} from 'lucide-react';

export default function StatisticsPage() {
  const [period, setPeriod] = useState('month'); // day, week, month, quarter, 3m, 6m, 1y, custom

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      let url = `/api/admin/analytics/stats?period=${period}`;
      if (period === 'custom') {
        url = `/api/admin/analytics/stats?start=${startDate}&end=${endDate}`;
      }
      const res = await fetch(url);
      const result = await res.json();
      if (res.ok) {
        setData(result);
      } else {
        setError(result.error || '통계 데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (period !== 'custom') {
      const end = new Date();
      let start = new Date();
      
      switch (period) {
        case 'day': start = new Date(); break;
        case 'week': start.setDate(end.getDate() - 7); break;
        case 'month': start.setMonth(end.getMonth() - 1); break;
        case '3m': start.setMonth(end.getMonth() - 3); break;
        case '6m': start.setMonth(end.getMonth() - 6); break;
        case '1y': start.setFullYear(end.getFullYear() - 1); break;
      }
      
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [period]);

  useEffect(() => {
    fetchStats();
  }, [period, (period === 'custom' ? startDate : ''), (period === 'custom' ? endDate : '')]);

  if (isLoading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#A67C52] border-t-transparent"></div>
        <p className="text-sm font-semibold text-[var(--primary)]/60">방문자 및 전환 통계를 정밀 분석 중입니다...</p>
      </div>
    );
  }

  const breakdown = data?.summary?.consultationBreakdown || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 헤더 섹션 */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#A67C52]/10 text-[#A67C52] text-xs font-bold rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 실시간 분석 대시보드
            </span>
            {data?.summary?.peakHours && data.summary.peakHours.length > 0 && (
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> 최다 방문 시간: {data.summary.peakHours.join(', ')}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--primary)]">정밀 방문 및 상담 통계</h1>
          <p className="text-sm text-[var(--primary)]/60 mt-1">
            의뢰인들의 유입 채널, 페이지 반응, 상담 전환율을 한눈에 분석합니다. (조회 기준: {startDate} ~ {endDate})
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* 기간 필터 프리셋 */}
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl shadow-sm border border-[var(--border)] overflow-x-auto max-w-full">
            {[
              { label: '오늘', value: 'day' },
              { label: '최근 7일', value: 'week' },
              { label: '최근 30일', value: 'month' },
              { label: '3개월', value: '3m' },
              { label: '6개월', value: '6m' },
              { label: '1년', value: '1y' },
              { label: '직접 지정', value: 'custom' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPeriod(item.value)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  period === item.value 
                    ? 'bg-[#A67C52] text-white shadow-md' 
                    : 'text-[var(--primary)]/60 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 직접 선택 시 날짜 입력 칸 */}
          {period === 'custom' && (
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[var(--border)] shadow-sm">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent px-2 py-1 text-xs font-bold text-[var(--primary)] focus:outline-none"
              />
              <span className="text-gray-300">~</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent px-2 py-1 text-xs font-bold text-[var(--primary)] focus:outline-none"
              />
            </div>
          )}

          <button 
            onClick={fetchStats}
            className="p-3 bg-white text-[#A67C52] border border-[var(--border)] rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
            title="새로고침"
          >
            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchStats} className="underline text-xs">다시 시도</button>
        </div>
      )}

      {/* 1. 핵심 성과 요약 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="총 페이지뷰 (조회수)" 
          value={data?.summary?.totalViews?.toLocaleString() || '0'} 
          unit="회"
          icon={<Eye className="w-6 h-6" />}
          trend={data?.summary?.trends?.viewsTrend || 0}
          color="blue"
          description="홈페이지 전체 화면 열람 건수"
        />
        <StatCard 
          title="순 방문자 수 (UV)" 
          value={data?.summary?.uniqueVisitors?.toLocaleString() || '0'} 
          unit="명"
          icon={<Users className="w-6 h-6" />}
          trend={data?.summary?.trends?.visitorsTrend || 0}
          color="amber"
          description="중복 접속을 제외한 고유 방문자"
        />
        <StatCard 
          title="총 상담 전환 건수" 
          value={data?.summary?.leadCount?.toLocaleString() || '0'} 
          unit="건"
          icon={<MousePointer2 className="w-6 h-6" />}
          trend={data?.summary?.trends?.leadTrend || 0}
          color="rose"
          description="자가진단 + 전화예약 + 게시판 문의"
        />
        <StatCard 
          title="최종 상담 전환율" 
          value={`${data?.summary?.conversionRate || '0'}`} 
          unit="%"
          icon={<ArrowUpRight className="w-6 h-6" />}
          trend={data?.summary?.trends?.rateTrend || 0}
          color="emerald"
          description="방문자 중 실제 상담을 신청한 비율"
        />
      </div>

      {/* 2. 세부 상담 전환 리포트 카드 (새로 추가된 상세 분석) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-[#A67C52]" />
              상담 창구별 전환 세부 분석
            </h3>
            <p className="text-xs sm:text-sm text-[var(--primary)]/50 mt-1">
              어떤 상담 창구를 통해 의뢰인들이 가장 많이 유입되고 문의를 남겼는지 분석합니다.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl">
            총 {data?.summary?.leadCount || 0}건 문의 접수
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {breakdown.map((item: any) => (
            <div key={item.name} className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 block mb-1">상담 유형</span>
                <p className="font-bold text-[var(--primary)] text-base">{item.name}</p>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-[var(--primary)]">{item.count}</span>
                  <span className="text-sm font-semibold text-gray-400 ml-1">건</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#A67C52]">{item.percentage}%</span>
                  <span className="text-[11px] text-gray-400 block">전체 중 비중</span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 날짜별 방문자 추이 메인 차트 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#A67C52]" />
              일자별 방문 트렌드 추이
            </h3>
            <p className="text-xs sm:text-sm text-[var(--primary)]/50 mt-1">일별 유입 방문자 수 변화 곡선</p>
          </div>
        </div>
        <div className="h-[360px] w-full">
          {data?.chartData && data.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={data.chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A67C52" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#A67C52" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 18px',
                    fontWeight: 700
                  }}
                  formatter={(val: any) => [`${val}회`, '방문 페이지뷰']}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#A67C52" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300 font-semibold">
              해당 기간의 방문 데이터가 아직 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* 4. 유입 경로 & 인기 페이지 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 스마트 유입 경로 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <Link2 className="w-5 h-5 text-[#A67C52]" />
              스마트 유입 출처 분석
            </h3>
            <span className="text-xs text-gray-400">네이버/구글/포털/SNS 자동 분류</span>
          </div>
          
          <div className="space-y-4">
            {data?.referrers && data.referrers.length > 0 ? (
              data.referrers.map((ref: any, idx: number) => {
                const total = data?.summary?.totalViews || 1;
                const percent = Math.min(100, Number(((ref.count / total) * 100).toFixed(1)));
                return (
                  <div key={ref.name + idx} className="p-4 bg-gray-50/80 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-bold text-[var(--primary)] flex items-center gap-2">
                        <span>{ref.icon || '🌐'}</span>
                        <span>{ref.name}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[var(--primary)]">{ref.count.toLocaleString()}회</span>
                        <span className="text-xs font-bold text-[#A67C52] bg-[#A67C52]/10 px-2 py-0.5 rounded-md">
                          {percent}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#A67C52] rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-gray-300 font-medium">유입 데이터가 없습니다.</div>
            )}
          </div>
        </div>

        {/* 인기 페이지 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#A67C52]" />
              의뢰인 인기 열람 페이지 (Top 10)
            </h3>
            <span className="text-xs text-gray-400">조회수 순위</span>
          </div>

          <div className="space-y-3">
            {data?.popularPages && data.popularPages.length > 0 ? (
              data.popularPages.map((page: any, index: number) => (
                <div key={page.path} className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl hover:bg-gray-100 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-white rounded-lg text-xs font-bold text-[#A67C52] shadow-sm">
                      {index + 1}
                    </span>
                    <span className="font-bold text-[var(--primary)] text-sm truncate">
                      {page.path === '/' ? '메인 홈 (홈페이지 첫 화면)' : page.path}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-extrabold text-[var(--primary)]">{page._count.path.toLocaleString()}회</span>
                    <a 
                      href={page.path} 
                      target="_blank" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white rounded-lg shadow-sm text-[#A67C52]" 
                      rel="noreferrer"
                      title="해당 페이지 새창 열기"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-gray-300 font-medium">열람된 페이지 데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      {/* 5. 시간대별 & 요일별 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 24시간 시간대별 분포 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#A67C52]" />
              24시간대별 방문 패턴
            </h3>
            <span className="text-xs text-gray-400">집중 상담 시간 파악</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.hourlyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{fill: '#94a3b8', fontSize: 11}} interval={2} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 11}} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  formatter={(val: any) => [`${val}회`, '방문 횟수']}
                />
                <Bar dataKey="count" fill="#A67C52" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 요일별 방문 분포 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--primary)] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8B6840]" />
              요일별 방문 분포
            </h3>
            <span className="text-xs text-gray-400">주중/주말 트래픽 비교</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data?.dayChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                  formatter={(val: any) => [`${val}회`, '방문 횟수']}
                />
                <Bar dataKey="count" fill="#8B6840" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. 디바이스 & 브라우저 점유율 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 디바이스 분포 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-[#A67C52]" />
            접속 디바이스 환경
          </h3>
          <div className="space-y-5">
            {data?.deviceChart?.map((device: any, idx: number) => (
              <div key={device.device} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[var(--primary)]">{device.device}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{device.count.toLocaleString()}건</span>
                    <span className="text-[#A67C52] font-black text-sm">{device.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${device.percentage}%`,
                      backgroundColor: ['#A67C52', '#3B82F6', '#10B981'][idx % 3]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 브라우저 분포 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-[#A67C52]" />
            사용 브라우저 분포
          </h3>
          <div className="space-y-5">
            {data?.browserChart?.map((browser: any, idx: number) => (
              <div key={browser.browser} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[var(--primary)]">{browser.browser}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{browser.count.toLocaleString()}건</span>
                    <span className="text-[#A67C52] font-black text-sm">{browser.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      width: `${browser.percentage}%`,
                      backgroundColor: ['#A67C52', '#D4A574', '#8B6840', '#6B5230', '#4B5563'][idx % 5]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. AI 수임 증대 맞춤 인사이트 패널 */}
      <AIInsightReportPanel data={data} adminName={data?.adminName || '김형근 대표 법무사'} />
    </div>
  );
}

function StatCard({ title, value, unit, icon, trend, color, description }: any) {
  const isPositive = trend >= 0;
  
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colors[color] || 'bg-gray-50 text-gray-600'}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
          isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
        }`}>
          {isPositive ? '↑' : '↓'} {Math.abs(trend)}% 대비
        </span>
      </div>
      <div>
        <p className="text-xs font-bold text-[var(--primary)]/50 uppercase tracking-wide mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-black text-[var(--primary)]">{value}</span>
          {unit && <span className="text-sm font-bold text-gray-400">{unit}</span>}
        </div>
        {description && (
          <p className="text-[11px] text-gray-400 mt-2 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}

function AIInsightReportPanel({ data, adminName }: { data: any; adminName: string }) {
  if (!data) return null;

  const { summary, referrers, popularPages } = data;
  const conversionRate = summary?.conversionRate || 0;
  const isGoodConversion = conversionRate >= 3.0;
  const isLowTraffic = (summary?.totalViews || 0) < 50;

  const topReferrer = referrers && referrers.length > 0 ? referrers[0] : null;
  const topPage = popularPages && popularPages.length > 0 ? popularPages[0] : null;

  return (
    <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A0E17] rounded-3xl p-8 border border-[#A67C52]/30 shadow-2xl relative overflow-hidden">
      {/* 장식용 은은한 글로우 */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#A67C52]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-[#A67C52]/20 rounded-2xl border border-[#A67C52]/30">
          <Sparkles className="w-6 h-6 text-[#D4A574]" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white">{adminName} 님을 위한 수임 증대 맞춤 전략</h3>
          <p className="text-gray-400 mt-1 text-sm font-medium">실시간 통계 수치 기반 AI 마케팅 진단 및 액션 플랜</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* 1. 종합 진단 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base font-bold text-white">종합 진단 및 방향</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {isLowTraffic ? (
              "현재 전체 트래픽 모수가 다소 부족한 상태입니다. 초기 유입을 촉진하기 위한 네이버 파워링크 검색광고나 지역 기반 블로그 칼럼 배포가 우선 필요합니다."
            ) : isGoodConversion ? (
              "전환율이 3% 이상으로 매우 우수합니다! 홈페이지의 신뢰 구축과 상담 신청 동선이 훌륭하게 작동하고 있으므로, 광고 예산을 확대하여 유입 방문자 수만 늘리면 수임이 비례하여 증가합니다."
            ) : (
              "방문 대비 상담 전환율이 다소 정체되어 있습니다. 메인 화면의 '성공 사례'나 '자가진단 신청' 버튼의 클릭 유도 문구를 보다 강력하고 안심을 주는 카피로 보강하는 것을 추천합니다."
            )}
          </p>
          <div className="bg-[#A67C52]/20 text-[#D4A574] px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <Lightbulb className="w-4 h-4 shrink-0" />
            <span>추천 우선순위: {isLowTraffic ? '유입 트래픽 확대' : isGoodConversion ? '공격적 마케팅 집행' : '상담 신청 유도 UX 강화'}</span>
          </div>
        </div>

        {/* 2. 유입 최적화 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            <h4 className="text-base font-bold text-white">최다 유입 채널 공략</h4>
          </div>
          {topReferrer ? (
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                현재 가장 많은 의뢰인이 <strong className="text-white bg-blue-500/20 px-2 py-0.5 rounded font-bold">{topReferrer.name}</strong>을(를) 통해 유입되고 있습니다.
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-400 font-medium">
                <li>해당 채널과 연계된 키워드(개인회생 비용, 파산 면책 등)의 콘텐츠를 집중 보강하세요.</li>
                <li>채널 특성에 맞추어 모바일 화면에서의 가독성을 높이면 전환율이 추가 상승합니다.</li>
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 text-xs">유입 채널 데이터가 집계되는 중입니다.</p>
          )}
        </div>

        {/* 3. 콘텐츠 효자 페이지 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-rose-400" />
            <h4 className="text-base font-bold text-white">핵심 관심 콘텐츠</h4>
          </div>
          {topPage ? (
            <div className="space-y-3 text-sm text-gray-300">
              <p>
                의뢰인들이 가장 오래 머무르고 조회한 페이지는 <strong className="text-white bg-rose-500/20 px-2 py-0.5 rounded font-bold break-all">{topPage.path}</strong> 입니다.
              </p>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-gray-300 font-medium">
                <p className="text-rose-200 font-bold mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Action Item
                </p>
                해당 페이지 하단에 <strong>'김형근 법무사 1:1 직접 상담'</strong> 신청 바로가기 플로팅 배너를 배치하여 이탈 고객을 즉시 수임으로 연결하세요.
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-xs">페이지 조회 데이터가 집계되는 중입니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
