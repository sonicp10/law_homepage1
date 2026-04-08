import React from 'react';
import PostList from '@/components/PostList';

const mockStories = [
  {
    id: "s1",
    title: "[개인회생] 최근 채무 80% 있음에도 원금 65% 탕감 성공",
    excerpt: "대출받은 지 6개월 미만인 최근 채무가 많아 기각 위기였으나, 성실한 소명과 변제 계획 수정을 통해 도합 1억 원의 채무를 탕감받은 사례입니다.",
    thumbnail: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.10",
    category: "성공사례",
    href: "/s_story/s1"
  },
  {
    id: "s2",
    title: "[개인파산] 60대 고령자의 2억 원 전액 면책 허가",
    excerpt: "오랜 투병 생활로 인한 과도한 병원비와 생활고로 파산에 이른 사례입니다. 부양가족 유무와 건강 상태를 적극 강조하여 선고 4개월 만에 전액 면책되었습니다.",
    thumbnail: "https://images.unsplash.com/photo-1556740734-7f9a2b77d996?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.02",
    category: "성공사례",
    href: "/s_story/s2"
  }
];

export default function StoryPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Statistics Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
        {[
          { label: "총 누적 면책액", value: "850억+" },
          { label: "성공 사례", value: "1,200건+" },
          { label: "월 평균 접수", value: "30건+" },
          { label: "무료 상담 건수", value: "5,000건+" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-[var(--border)] text-center shadow-sm">
            <p className="text-[10px] md:text-[12px] text-[var(--primary)]/40 font-black uppercase tracking-widest mb-2">{stat.label}</p>
            <p className="text-xl md:text-3xl font-black text-[#A67C52]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">성공사례 목록</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium">
          법무사 김형근 사무소가 만들어낸 수많은 희망의 기록들입니다.
        </p>
      </div>

      <PostList posts={mockStories} />
      
      {/* Contact Section */}
      <div className="mt-24 p-12 bg-[#2C3E50] text-center rounded-[var(--radius-card)] text-white shadow-2xl">
        <h3 className="text-2xl md:text-3xl font-bold mb-6">다음 성공 사례의 주인공은 여러분입니다.</h3>
        <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium">
          고민은 해결을 늦출 뿐입니다. 지금 바로 전문가의 무료 진단을 받아보세요.
        </p>
        <button className="px-12 py-5 bg-[var(--accent)] text-[var(--primary)] rounded-full font-black text-xl hover:scale-105 transition-transform shadow-xl">
          지금 바로 상담하기
        </button>
      </div>
    </div>
  );
}
