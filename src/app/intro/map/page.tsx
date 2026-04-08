import React from 'react';

export default function MapPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">오시는 길</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium max-w-2xl mx-auto">
          편하게 방문하실 수 있도록 최선을 다하겠습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[var(--radius-card)] border border-[var(--border)] shadow-sm">
            <h3 className="text-xl font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center text-sm">📍</span>
              주소 안내
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[var(--primary)]/40 font-bold mb-1">도로명 주소</p>
                <p className="text-[var(--primary)] text-lg font-medium">경기도 부천시 원미구 상일로 126</p>
                <p className="text-[var(--primary)]/60 text-sm">(세정6블럭 401호)</p>
              </div>
              <div className="pt-6 border-t border-[var(--border)]">
                <p className="text-sm text-[var(--primary)]/40 font-bold mb-1">연락처</p>
                <p className="text-[var(--primary)] text-2xl font-extrabold text-[#A67C52]">010-3844-3151</p>
                <p className="text-[var(--primary)]/60 text-sm mt-1">상담문의는 언제나 환영합니다.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#2C3E50] p-8 rounded-[var(--radius-card)] text-white shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm">⏰</span>
              업무 시간
            </h3>
            <ul className="space-y-4 text-white/70 font-medium">
              <li className="flex justify-between">
                <span>평일</span>
                <span className="text-white">09:00 - 18:00</span>
              </li>
              <li className="flex justify-between">
                <span>토요일</span>
                <span className="text-white">예약 상담 가능</span>
              </li>
              <li className="flex justify-between">
                <span>일요일/공휴일</span>
                <span className="text-white">휴무</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Map Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video w-full bg-slate-200 rounded-[var(--radius-card)] border border-[var(--border)] relative overflow-hidden flex items-center justify-center">
            {/* Map Placeholder */}
            <div className="text-center group cursor-pointer">
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🗺️</div>
              <p className="text-[var(--primary)] font-bold">네이버/카카오 지도 API 연동 예정 영역</p>
              <p className="text-[var(--primary)]/40 text-sm mt-2">지번 주소: 경기도 부천시 상동 448-2</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-white border border-[#03C75A] text-[#03C75A] rounded-xl font-bold hover:bg-[#03C75A] hover:text-white transition-all text-sm">
              네이버 지도에서 보기
            </button>
            <button className="flex-1 py-4 bg-white border border-[#FAE100] text-[#3C1E1E] rounded-xl font-bold hover:bg-[#FAE100] transition-all text-sm">
              카카오 맵에서 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
