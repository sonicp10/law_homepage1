export default function CaseTicker() {
  const cases = [
    "서울 서초구 김○○님 개인회생 개시 결정",
    "경기도 수원시 이○○님 개인파산 면책 확정",
    "인천 미추홀구 박○○님 채무 85% 탕감 인가",
    "부산 해운대구 최○○님 개인회생 절차 진행 중",
    "대전 서구 정○○님 신용회복 상담 완료",
    "대구 달서구 강○○님 주식 투자 실패 채무 탕감",
    "광주 북구 윤○○님 워킹홀리데이 채무 해결",
  ];

  return (
    <div className="bg-[var(--primary)] text-white/90 py-3 overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-6">
        <span className="shrink-0 text-[10px] font-bold tracking-widest uppercase bg-[var(--secondary)] text-[var(--primary)] px-2 py-0.5 rounded">
          Live Status
        </span>
        <div className="relative overflow-hidden flex-grow h-6">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-sm font-medium">
            {/* 데이터 복제하여 끊김 없는 흐름 구현 */}
            {[...cases, ...cases].map((text, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="w-1 h-1 bg-[var(--accent)] rounded-full"></span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
