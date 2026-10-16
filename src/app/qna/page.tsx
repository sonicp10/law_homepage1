import React from 'react';
import Link from 'next/link';

export default function QnaHubPage() {
  const consultChannels = [
    {
      title: '실시간 전화 상담',
      subtitle: '가장 빠르고 정확한 1:1 유선 상담',
      desc: '신청 즉시 담당 법무사가 신속하게 연락드려 채무 현황과 해결책을 친절히 안내합니다.',
      tag: '가장 빠른 피드백',
      badgeColor: 'bg-amber-100 text-amber-800',
      href: '/qna/phone',
      buttonText: '전화 상담 신청하기',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 12.426 10.074 22.5 22.5 22.5 1.242 0 2.25-1.008 2.25-2.25v-4.509c0-1.11-.901-2.009-2.008-2.009l-4.509.006c-1.11 0-2.012.91-2.012 2.009l-.014 2.254c-7.923-1.01-14.332-7.419-15.342-15.342l2.254-.014c1.098 0 2.009-.902 2.009-2.012l.006-4.509c0-1.11-.899-2.008-2.009-2.008H4.5c-1.242 0-2.25 1.008-2.25 2.25v4.5z" />
        </svg>
      ),
    },
    {
      title: '방문 예약 상담',
      subtitle: '전용 상담실에서 심층 대면 상담',
      desc: '원하시는 일시를 예약하시면 관련 서류와 함께 1:1 맞춤 면책 전략을 정밀하게 브리핑해 드립니다.',
      tag: '프라이빗 전용 상담실',
      badgeColor: 'bg-blue-100 text-blue-800',
      href: '/qna/visit',
      buttonText: '방문 상담 예약하기',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: '게시판 1:1 상담',
      subtitle: '언제 어디서든 비밀글로 문의',
      desc: '통화가 어려운 상황이실 때 비밀번호를 설정하여 질문하시면 법무사가 비공개로 직접 답변을 드립니다.',
      tag: '100% 비밀글 보장',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      href: '/qna/board',
      buttonText: '게시판 상담 가기',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.023c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
        </svg>
      ),
    },
    {
      title: '1분 채무 자가진단',
      subtitle: '내 빚 탕감 가능 비율 즉시 계산',
      desc: '직업, 소득, 채무 규모만 간단히 입력하시면 개인회생·파산 적격성과 탕감 가능성을 즉시 진단합니다.',
      tag: '1분 간편 계산',
      badgeColor: 'bg-purple-100 text-purple-800',
      href: '/qna/diagnosis',
      buttonText: '자가진단 시작하기',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em] block">
          Custom Consultation Services
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50]">
          의뢰인께 가장 편안한 상담을 선택해 주세요
        </h2>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed break-keep">
          모든 상담은 비밀이 철저히 보장되며, 사건을 맡기지 않으셔도 초기 상담 비용은 발생하지 않습니다.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {consultChannels.map((ch, idx) => (
          <div 
            key={idx}
            className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center group-hover:bg-[#A67C52] group-hover:text-white transition-colors">
                  {ch.icon}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${ch.badgeColor}`}>
                  {ch.tag}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#2C3E50] group-hover:text-[#A67C52] transition-colors">
                  {ch.title}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#A67C52] mt-1">
                  {ch.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mt-3 break-keep">
                  {ch.desc}
                </p>
              </div>
            </div>

            <div className="pt-8">
              <Link
                href={ch.href}
                className="w-full py-4 bg-gray-50 text-[#2C3E50] group-hover:bg-[#A67C52] group-hover:text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>{ch.buttonText}</span>
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 3 Core Promises Banner */}
      <div className="bg-gradient-to-br from-[#2C3E50] to-[#1A252F] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-6">
          <span className="text-xs font-bold text-[#B89E6E] uppercase tracking-widest block">
            Client Protection Guarantee
          </span>
          <h3 className="text-2xl sm:text-3xl font-black leading-snug">
            법무사 김상호 사무소가 약속하는 3대 원칙
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="space-y-1.5 border-l-2 border-[#B89E6E] pl-4">
              <h4 className="font-bold text-base text-[#B89E6E]">100% 비밀 보장</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                가족, 직장, 지인 누구에게도 일체 알리지 않고 철저한 비공개로 진행합니다.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-[#B89E6E] pl-4">
              <h4 className="font-bold text-base text-[#B89E6E]">법무사 1:1 직접 총괄</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                무자격 사무장이 아닌 전문 법무사가 사건 접수부터 인가까지 직접 책임집니다.
              </p>
            </div>

            <div className="space-y-1.5 border-l-2 border-[#B89E6E] pl-4">
              <h4 className="font-bold text-base text-[#B89E6E]">기각 시 100% 환불</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                정밀 검토 후 자격이 성립된 사건에 대해 기각 시 수임료 전액 환불을 약정합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Contact Bar */}
      <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-bold text-[#2C3E50]">지금 바로 상담이 필요하신가요?</h4>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            혼자 고민하지 마시고 편안하게 연락해 주세요. 전문 법무사가 명쾌한 해답을 드립니다.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <a
            href="tel:02-588-8888"
            className="px-6 py-3.5 bg-[#A67C52] text-white rounded-xl font-bold text-sm shadow hover:bg-[#8e6842] transition-colors flex items-center gap-2"
          >
            <span>전화 02-588-8888</span>
          </a>
          <Link
            href="/qna/phone"
            className="px-6 py-3.5 bg-white border border-gray-200 text-[#2C3E50] rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors"
          >
            온라인 무료 접수
          </Link>
        </div>
      </div>
    </div>
  );
}
