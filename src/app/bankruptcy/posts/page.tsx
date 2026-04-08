import React from 'react';
import PostList from '@/components/PostList';

const mockPosts = [
  {
    id: "b1",
    title: "개인파산 면책불허가 사유와 대응 전략",
    excerpt: "파산 신청보다 중요한 것이 면책입니다. 재산 은닉이나 과다한 낭비로 인한 면책 거절 사례를 분석하고, 어떻게 대응해야 하는지 알려드립니다.",
    thumbnail: "https://images.unsplash.com/photo-1543285198-3af15c4592ce?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.15",
    category: "면책전략",
    href: "/bankruptcy/posts/b1"
  },
  {
    id: "b2",
    title: "면책 후 신용점수 회복까지 걸리는 시간은?",
    excerpt: "성공적으로 면책을 받았다면 이제는 부활할 시간입니다. 신용 정보를 삭제하고 1금융권 거래가 가능해지기까지의 기간과 팁을 공개합니다.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.11",
    category: "경제재기",
    href: "/bankruptcy/posts/b2"
  },
  {
    id: "b3",
    title: "기초 자산 보호: 파산해도 지킬 수 있는 재산",
    excerpt: "파산하면 모든 것을 뺏긴다는 오해! 면제재산 신청을 통해 보증금이나 기초 생활비 등 최소한의 삶을 지키는 방법을 상세히 안내합니다.",
    thumbnail: "https://images.unsplash.com/photo-1560513828-997c73bc01ed?auto=format&fit=crop&q=80&w=800",
    date: "2024.03.05",
    category: "재산보호",
    href: "/bankruptcy/posts/b3"
  }
];

export default function BankruptcyPostsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--primary)] mb-6">법률 정보 및 칼럼</h2>
        <div className="w-12 h-1 bg-[#A67C52] mx-auto mb-8"></div>
        <p className="text-lg text-[var(--primary)]/60 font-medium">
          파산 면책 성공사례 분석과 실무적인 법률 지식을 전해드립니다.
        </p>
      </div>

      <PostList posts={mockPosts} />
      
      {/* Pagination Placeholder */}
      <div className="mt-16 flex justify-center gap-2">
        <button className="w-10 h-10 rounded-lg border border-[var(--primary)] bg-[var(--primary)] text-white font-bold">1</button>
        <button className="w-10 h-10 rounded-lg border border-[var(--border)] bg-white text-[var(--primary)]/40 hover:border-[var(--primary)]/60 transition-all font-bold">2</button>
      </div>
    </div>
  );
}
