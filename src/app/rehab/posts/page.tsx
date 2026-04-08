import React from 'react';
import PostList from '@/components/PostList';

const mockPosts = [
  {
    id: "1",
    title: "개인회생 신청 자격, 3가지 핵심 요건 총정리",
    excerpt: "개인회생을 신청하기 위해서는 소득, 채무 규모, 그리고 재산 가치라는 세 가지 벽을 넘어야 합니다. 전문가가 알려주는 자격 진단 포인트를 확인하세요.",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.20",
    category: "회생자격",
    href: "/rehab/posts/1"
  },
  {
    id: "2",
    title: "최근 채무가 많은데 개인회생이 가능할까요?",
    excerpt: "대출받은 지 얼마 되지 않은 '최근 채무'는 법원에서 엄격하게 심사합니다. 하지만 전략적인 대응이 있다면 불필요한 기각을 막을 수 있습니다.",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.18",
    category: "실무팁",
    href: "/rehab/posts/2"
  },
  {
    id: "3",
    title: "변제금 낮추는 법: 추가 생계비 인정받기",
    excerpt: "매월 내야 하는 변제금이 부담스러우신가요? 주거비, 의료비, 교육비 등 추가 생계비를 정당하게 인정받아 변제 부담을 줄이는 노하우를 공개합니다.",
    thumbnail: "https://images.unsplash.com/photo-1573163276722-da09214736f1?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.15",
    category: "비용절감",
    href: "/rehab/posts/3"
  }
];

export default function RehabPostsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">법률 정보 및 칼럼</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium">
          개인회생 성공을 위한 필수 지식과 실무 노하우를 전해드립니다.
        </p>
      </div>

      <PostList posts={mockPosts} />
      
      {/* Pagination Placeholder */}
      <div className="mt-16 flex justify-center gap-2">
        <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center font-bold text-[var(--primary)] bg-white hover:bg-[var(--primary)] hover:text-white transition-all">1</button>
        <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center font-bold text-[var(--primary)]/40 bg-white hover:border-[var(--primary)]/60 transition-all">2</button>
        <button className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center font-bold text-[var(--primary)]/40 bg-white hover:border-[var(--primary)]/60 transition-all">3</button>
      </div>
    </div>
  );
}
