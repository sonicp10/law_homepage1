'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  Users, Eye, MousePointer2, MapPin, ArrowUpRight, Calendar, ChevronDown, 
  RefreshCcw, Search, Globe, Link2, ExternalLink
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
