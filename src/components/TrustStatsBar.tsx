'use client';

import React, { useEffect, useState } from 'react';
import AnimatedNumber from './AnimatedNumber';

// 결정론적 난수 생성기 (날짜 기반 시드 사용)
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function TrustStatsBar() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    // 1. 기준 데이터 및 날짜 설정
    const baseDate = new Date('2024-01-01').getTime();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 오늘 0시 기준
    const todayTime = today.getTime();
    
    const diffDays = Math.floor((todayTime - baseDate) / (1000 * 60 * 60 * 24));
    
    // 2. 누적 데이터 계산 (날짜 시드를 사용하여 오늘 하루는 고정값)
    let totalConsults = 10000; // 초기값
    let totalDebt = 1200; // 초기값 (억 단위)
    
    // 각 날짜별로 1~8 사이의 랜덤한 증가량을 합산
    for(let i = 0; i < diffDays; i++) {
      const daySeed = baseDate + (i * 1000 * 60 * 60 * 24);
      const dailyIncrease = Math.floor(seededRandom(daySeed) * 8) + 1; // 1~8 사이
      totalConsults += dailyIncrease;
      totalDebt += (dailyIncrease * 0.15); // 한 건당 평균 0.15억(1500만원) 탕감 가정
    }

    // 3. 인가율 계산 (오늘의 시드로 93% ~ 99.9% 사이 고정값)
    const verToday = 93 + (seededRandom(todayTime) * 6.9);

    setStats([
      { label: '누적 개인회생 인가율', value: verToday, decimal: 1, suffix: 'Ver.', unit: '%' },
      { label: '누적 채무 탕감액', value: totalDebt, decimal: 0, suffix: 'Sum', unit: '억+' },
      { label: '총 법률 상담 건수', value: totalConsults, decimal: 0, suffix: 'Total', unit: '건+' },
      { label: '의뢰인 비밀 보장', value: 100, decimal: 0, suffix: 'Security', unit: '% 안심' },
    ]);
  }, []);

  if (stats.length === 0) return <div className="h-32 bg-[var(--primary)]"></div>;

  return (
    <section className="bg-[var(--primary)] py-8 border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 items-center">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col items-center lg:items-start lg:pl-12 text-center lg:text-left ${
                idx !== stats.length - 1 ? 'lg:border-r lg:border-white/10' : ''
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--secondary)]">
                  {stat.suffix}
                </span>
                <div className="w-1 h-1 bg-[var(--accent)] rounded-full"></div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                <AnimatedNumber 
                  value={stat.value} 
                  decimalPlaces={stat.decimal} 
                  suffix={stat.unit}
                />
              </div>
              <div className="text-[12px] text-white/50 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
