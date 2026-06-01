'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  Users, Eye, MousePointer2, MapPin, ArrowUpRight, Calendar, ChevronDown, 
  RefreshCcw, Search, Globe, Link2, ExternalLink,
  Sparkles, Lightbulb, TrendingUp
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
        setError('통계 데이터를 불러오는데 실패했습니다.');
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#A67C52] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 헤더 섹션 */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--primary)] mb-2">방문 통계 분석</h1>
          <p className="text-[var(--primary)]/60">홈페이지 유입 및 이용 행태를 분석합니다. (기준: {startDate} ~ {endDate})</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* 기간 필터 프리셋 */}
          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl shadow-sm border border-[var(--border)] overflow-x-auto max-w-full">
            {[
              { label: '오늘', value: 'day' },
              { label: '주간', value: 'week' },
              { label: '월간', value: 'month' },
              { label: '3개월', value: '3m' },
              { label: '6개월', value: '6m' },
              { label: '1년', value: '1y' },
              { label: '직접 선택', value: 'custom' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setPeriod(item.value)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  period === item.value 
                    ? 'bg-[#A67C52] text-white shadow-md' 
                    : 'text-[var(--primary)]/50 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 직접 선택 시 날짜 입력 칸 */}
          <div className={`flex items-center gap-2 transition-all duration-300 ${period === 'custom' ? 'opacity-100 translate-x-0' : 'opacity-40 pointer-events-none'}`}>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPeriod('custom');
              }}
              className="bg-white border border-[var(--border)] rounded-xl px-3 py-2 text-sm font-bold text-[var(--primary)] focus:outline-none focus:border-[#A67C52]"
            />
            <span className="text-[var(--primary)]/30">~</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPeriod('custom');
              }}
              className="bg-white border border-[var(--border)] rounded-xl px-3 py-2 text-sm font-bold text-[var(--primary)] focus:outline-none focus:border-[#A67C52]"
            />
            <button 
              onClick={fetchStats}
              className="p-2 bg-[#A67C52]/5 text-[#A67C52] rounded-xl hover:bg-[#A67C52]/10 transition-colors"
              title="새로고침"
            >
              <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard 
          title="총 페이지 뷰" 
          value={data?.summary?.totalViews?.toLocaleString() || '0'} 
          icon={<Eye className="w-6 h-6" />}
          trend={data?.summary?.trends?.viewsTrend || 0}
          color="blue"
        />
        <StatCard 
          title="순 방문자 수" 
          value={data?.summary?.uniqueVisitors?.toLocaleString() || '0'} 
          icon={<Users className="w-6 h-6" />}
          trend={data?.summary?.trends?.visitorsTrend || 0}
          color="amber"
        />
        <StatCard 
          title="평균 보완 유입률" 
          value={`${data?.summary?.conversionRate || '0'}%`} 
          icon={<ArrowUpRight className="w-6 h-6" />}
          trend={data?.summary?.trends?.rateTrend || 0}
          color="emerald"
        />
        <StatCard 
          title="전환 신청 건수" 
          value={data?.summary?.leadCount?.toLocaleString() || '0'} 
          icon={<MousePointer2 className="w-6 h-6" />}
          trend={data?.summary?.trends?.leadTrend || 0}
          color="rose"
        />
      </div>

      {/* 메인 차트 */}
      <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-[var(--primary)]">방문자 추이</h3>
            <p className="text-sm text-[var(--primary)]/50">기간별 방문자 활성 통계</p>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data?.chartData}>

              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A67C52" stopOpacity={0.1}/>
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
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px'
                }}
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 인기 페이지 */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#A67C52]" />
            인기 페이지
          </h3>
          <div className="space-y-4">
            {data?.popularPages?.map((page: any, index: number) => (
              <div key={page.path} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-sm font-bold text-[#A67C52] shadow-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--primary)] text-sm">{page.path}</p>
                    <p className="text-xs text-[var(--primary)]/40">조회수 분석 완료</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[var(--primary)]">{page._count.path.toLocaleString()}회</span>
                  <a href={page.path} target="_blank" className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-lg shadow-sm" rel="noreferrer">
                    <ExternalLink className="w-4 h-4 text-[#A67C52]" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 유입 경로 */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-[#A67C52]" />
            유입 경로
          </h3>
          <div className="space-y-4">
            {data?.referrers?.map((ref: any) => (
              <div key={ref.referrer || '직접 접속'} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[var(--primary)] truncate max-w-[200px]">
                    {ref.referrer || '직접 유입 (Direct)'}
                  </span>
                  <span className="text-[var(--primary)]/50 font-medium">
                    {ref._count.referrer.toLocaleString()} 명
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#A67C52] rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(100, (ref._count.referrer / (data?.summary?.totalViews || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 고도의 분석 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 시간대별 방문 분석 */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6">시간대별 방문 분석</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.hourlyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#A67C52" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 요일별 방문 분석 */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6">요일별 방문 분석</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.dayChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#8B6840" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 디바이스 및 브라우저 분석 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 디바이스 분포 */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6">디바이스 분포</h3>
          <div className="space-y-6">
            {data?.deviceChart?.map((device: any, idx: number) => (
              <div key={device.device} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--primary)] text-sm">{device.device}</span>
                  <span className="text-[#A67C52] font-bold text-sm">{device.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${device.percentage}%`,
                      backgroundColor: ['#A67C52', '#D4A574', '#8B6840'][idx % 3]
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--primary)]/50">{device.count.toLocaleString()}명</span>
              </div>
            ))}
          </div>
        </div>

        {/* 브라우저 분포 */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-bold text-[var(--primary)] mb-6">브라우저 분포</h3>
          <div className="space-y-6">
            {data?.browserChart?.map((browser: any, idx: number) => (
              <div key={browser.browser} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--primary)] text-sm">{browser.browser}</span>
                  <span className="text-[#A67C52] font-bold text-sm">{browser.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${browser.percentage}%`,
                      backgroundColor: ['#A67C52', '#D4A574', '#8B6840', '#6B5230'][idx % 4]
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--primary)]/50">{browser.count.toLocaleString()}회</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 페이지별 성과 상세 분석 */}
      <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
        <h3 className="text-xl font-bold text-[var(--primary)] mb-6">페이지별 성과 분석</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[var(--border)] whitespace-nowrap">
                <th className="text-left px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">페이지</th>
                <th className="text-right px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">조회수</th>
                <th className="text-right px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">상담 신청</th>
                <th className="text-right px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">전환율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data?.pageWithLeads?.map((page: any, idx: number) => (
                <tr key={page.path} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <td className="px-4 py-4 font-bold text-[var(--primary)] text-sm">{page.path}</td>
                  <td className="text-right px-4 py-4 text-[var(--primary)]/70 font-medium text-sm">{page.views.toLocaleString()}</td>
                  <td className="text-right px-4 py-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-bold">
                      {page.leads}건
                    </span>
                  </td>
                  <td className="text-right px-4 py-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      page.conversionRate > 5 ? 'bg-emerald-50 text-emerald-600' : 
                      page.conversionRate > 2 ? 'bg-amber-50 text-amber-600' : 
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {page.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 리드 소스 귀속 분석 */}
      <div className="bg-white rounded-3xl p-8 border border-[var(--border)] shadow-sm">
        <h3 className="text-xl font-bold text-[var(--primary)] mb-6">유입 채널별 상담 신청 분석</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[var(--border)] whitespace-nowrap">
                <th className="text-left px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">유입 채널</th>
                <th className="text-right px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">방문수</th>
                <th className="text-right px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">신청건수</th>
                <th className="text-right px-4 py-4 font-bold text-[var(--primary)]/50 text-xs uppercase">전환율</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data?.leadsByReferrer?.map((ref: any) => (
                <tr key={ref.referrer} className="hover:bg-gray-50 transition-colors whitespace-nowrap">
                  <td className="px-4 py-4 font-bold text-[var(--primary)] text-sm truncate max-w-[200px]">
                    {ref.referrer === 'Direct' ? '📌 직접 방문' : ref.referrer}
                  </td>
                  <td className="text-right px-4 py-4 text-[var(--primary)]/70 font-medium text-sm">{ref.views.toLocaleString()}</td>
                  <td className="text-right px-4 py-4">
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-sm font-bold">
                      {ref.leads}건
                    </span>
                  </td>
                  <td className="text-right px-4 py-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                      ref.conversionRate > 5 ? 'bg-emerald-50 text-emerald-600' : 
                      ref.conversionRate > 2 ? 'bg-amber-50 text-amber-600' : 
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {ref.conversionRate.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIInsightReportPanel data={data} userId="sonicp" />
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: any) {
  const isPositive = trend >= 0;
  
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-2xl ${colors[color] || 'bg-gray-50 text-gray-600'}`}>
          {icon}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
          isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
        }`}>
          {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--primary)]/50 mb-1">{title}</p>
        <p className="text-3xl font-extrabold text-[var(--primary)]">{value}</p>
      </div>
    </div>
  );
}

function AIInsightReportPanel({ data, userId }: { data: any, userId: string }) {
  if (!data) return null;

  const { summary, leadsByReferrer, pageWithLeads } = data;
  
  // 1. 유입 채널 (Referrer) 분석
  let bestReferrer = null;
  let worstReferrer = null;
  
  if (leadsByReferrer && leadsByReferrer.length > 0) {
    const validRefs = leadsByReferrer.filter((r: any) => r.views >= 5);
    if (validRefs.length > 0) {
      bestReferrer = validRefs.reduce((prev: any, curr: any) => (prev.conversionRate > curr.conversionRate) ? prev : curr);
      worstReferrer = validRefs.reduce((prev: any, curr: any) => (prev.conversionRate < curr.conversionRate) ? prev : curr);
    } else {
      bestReferrer = leadsByReferrer[0];
    }
  }

  // 2. 인기 페이지 (Page) 분석
  let bestPage = null;
  if (pageWithLeads && pageWithLeads.length > 0) {
    bestPage = pageWithLeads.reduce((prev: any, curr: any) => (prev.conversionRate > curr.conversionRate) ? prev : curr);
  }

  // 3. 종합 상태 평가
  const conversionRate = summary?.conversionRate || 0;
  const isGoodConversion = conversionRate >= 3.0;
  const isLowTraffic = (summary?.totalViews || 0) < 100;

  return (
    <div className="bg-gradient-to-br from-[#1a1f2c] to-[#0F172A] rounded-3xl p-8 border border-[#A67C52]/30 shadow-xl mt-12 relative overflow-hidden">
      {/* 장식용 배경 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#A67C52]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="p-3 bg-[#A67C52]/20 rounded-xl">
          <Sparkles className="w-6 h-6 text-[#A67C52]" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{userId} 대표님을 위한 수임 증대 맞춤 전략</h3>
          <p className="text-gray-400 mt-1 text-sm font-medium">현재 통계 데이터를 기반으로 AI가 분석한 종합 액션 플랜입니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        
        {/* 1. 종합 진단 및 방향성 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-inner hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-bold text-white">종합 진단</h4>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {isLowTraffic ? (
              "현재 전체 트래픽이 다소 부족한 상태입니다. 초기 유입을 늘리기 위한 적극적인 검색 광고(SA)나 블로그 배포 등 매체 예산 확보가 우선되어야 합니다."
            ) : isGoodConversion ? (
              "현재 사이트 전환율이 평균 이상을 기록하고 있습니다. 랜딩 페이지의 설득력이 충분하므로, 방문자 수(트래픽)만 늘려준다면 비례하여 수임이 크게 증가할 수 있는 최적의 상태입니다."
            ) : (
              "트래픽 대비 전환율이 아쉬운 상태입니다. 방문자는 꽤 있으나 상담 신청으로 이어지지 않고 있으므로, 히어로 섹션의 신뢰성 높은 성공 사례 배치나 자가진단 유도 배너 추가 등 UI/UX 개선이 필요합니다."
            )}
          </p>
          <div className="bg-[#A67C52]/20 text-[#D4A574] px-4 py-3 rounded-xl text-sm font-bold flex items-start gap-2">
            <Lightbulb className="w-4 h-4 mt-0.5 shrink-0" />
            <span>핵심 요약: {isLowTraffic ? '마케팅 예산 확대 필요' : isGoodConversion ? '공격적인 트래픽 증대(광고 집행)' : '홈페이지 내부 전환율(UX) 개선'}</span>
          </div>
        </div>

        {/* 2. 매체/광고 최적화 제안 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-inner hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-bold text-white">광고/유입 채널 최적화</h4>
          </div>
          {bestReferrer ? (
            <div className="space-y-4 text-sm text-gray-300">
              <p>
                가장 효율이 좋은 유입 채널은 <strong className="text-white bg-blue-500/20 px-2 py-0.5 rounded">{bestReferrer.referrer === 'Direct' ? '직접 유입' : bestReferrer.referrer}</strong> (전환율 {bestReferrer.conversionRate.toFixed(1)}%) 입니다.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400 font-medium">
                <li>해당 채널의 광고 예산을 현재 대비 <span className="text-emerald-400 font-bold">20~30% 증액</span>하여 수임을 극대화하세요.</li>
                {worstReferrer && worstReferrer.referrer !== bestReferrer.referrer && (
                  <li>반면, <strong className="text-gray-200">{worstReferrer.referrer === 'Direct' ? '직접 유입' : worstReferrer.referrer}</strong>의 경우 효율이 떨어지므로 타겟팅을 점검하거나 예산 축소를 고려하세요.</li>
                )}
              </ul>
            </div>
          ) : (
             <p className="text-gray-400 text-sm">유의미한 유입 채널 데이터가 아직 부족합니다. 광고를 며칠 더 집행해 보세요.</p>
          )}
        </div>

        {/* 3. 콘텐츠/랜딩 페이지 제안 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-inner hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-rose-400" />
            <h4 className="text-lg font-bold text-white">콘텐츠 효자 페이지</h4>
          </div>
          {bestPage ? (
            <div className="space-y-4 text-sm text-gray-300">
              <p>
                방문자 대비 상담 신청이 가장 활발한 페이지는 <strong className="text-white break-all bg-rose-500/20 px-2 py-0.5 rounded">{bestPage.path}</strong> 입니다.
              </p>
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mt-4">
                <p className="text-rose-200 font-bold flex items-center gap-1 mb-1">
                  <Sparkles className="w-4 h-4" /> Action Item
                </p>
                <p className="text-gray-300 font-medium leading-relaxed">이 페이지를 메인 랜딩으로 삼는 <strong className="text-white">특화 광고 캠페인(검색광고 확장 등)</strong>을 신설해 보세요. 유입 대비 수임률이 크게 향상될 수 있습니다.</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">상담 신청을 발생시킨 특정 페이지 데이터가 아직 충분하지 않습니다.</p>
          )}
        </div>

      </div>
    </div>
  );
}
