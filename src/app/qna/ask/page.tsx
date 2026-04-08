'use client';

import React, { useState } from 'react';
import SubPageBanner from '@/components/SubPageBanner';

export default function ConsultPage() {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'request'>('diagnosis');

  const diagnosisList = [
    { id: 15, title: '서**님의 자가진단 상담신청', name: '서**', status: '접수완료', time: '14:01' },
    { id: 14, title: '이**님의 자가진단 상담신청', name: '이**', status: '상담중', time: '13:45' },
    { id: 13, title: '박**님의 회생 자격 진단', name: '박**', status: '접수완료', time: '12:20' },
    { id: 12, title: '최**님의 파산 가능성 진단', name: '최**', status: '처리완료', time: '11:10' },
    { id: 11, title: '김**님의 상담 요청 건', name: '김**', status: '접수완료', time: '10:30' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sub Banner */}
      <SubPageBanner 
        title="상담하기" 
        subtitle="새로운 시작을 위하여 최선의 서비스를 제공해드리겠습니다."
        backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1600"
      />

      {/* Tab Navigation (Image Inspired) */}
      <div className="w-full border-b border-[var(--border)] sticky top-20 z-40 bg-white">
        <div className="max-w-7xl mx-auto flex h-20">
          <button 
            onClick={() => setActiveTab('diagnosis')}
            className={`flex-1 flex items-center justify-center font-bold text-lg transition-all border-r border-[var(--border)] ${
              activeTab === 'diagnosis' 
                ? 'bg-[var(--background)] text-[var(--secondary)] border-b-4 border-b-[var(--secondary)]' 
                : 'text-[var(--primary)]/40 hover:text-[var(--primary)]'
            }`}
          >
            자가진단
          </button>
          <button 
            onClick={() => setActiveTab('request')}
            className={`flex-1 flex items-center justify-center font-bold text-lg transition-all ${
              activeTab === 'request' 
                ? 'bg-[var(--background)] text-[var(--secondary)] border-b-4 border-b-[var(--secondary)]' 
                : 'text-[var(--primary)]/40 hover:text-[var(--primary)]'
            }`}
          >
            상담신청
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-6 py-20 w-full animate-slide-up">
        {activeTab === 'diagnosis' ? (
          <div>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--primary)] mb-4 font-outfit tracking-tighter">Self-Diagnosis .</h2>
              <div className="w-12 h-1 bg-[var(--secondary)] mx-auto rounded-full"></div>
            </div>

            {/* Diagnosis Status Table (Image Inspired) */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-t-2 border-[var(--primary)]">
                <thead className="bg-[var(--background)] border-b border-[var(--border)] text-[var(--primary)]/60">
                  <tr>
                    <th className="py-5 px-4 font-bold text-center w-24">번호</th>
                    <th className="py-5 px-4 font-bold text-left">제목</th>
                    <th className="py-5 px-4 font-bold text-center w-24">이름</th>
                    <th className="py-5 px-4 font-bold text-center w-24">상태</th>
                    <th className="py-5 px-4 font-bold text-center w-32">날짜</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--primary)]">
                  {diagnosisList.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--background)]/50 transition-colors">
                      <td className="py-5 px-4 text-center text-gray-400">{item.id}</td>
                      <td className="py-5 px-4 font-medium flex items-center gap-2">
                        {item.title}
                        <span className="inline-block px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded font-bold uppercase scale-90">New</span>
                      </td>
                      <td className="py-5 px-4 text-center">{item.name}</td>
                      <td className="py-5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === '접수완료' ? 'bg-[var(--secondary)]/20 text-[var(--secondary)]' :
                          item.status === '상담중' ? 'bg-[var(--accent)]/30 text-[var(--primary)]' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center text-gray-400 font-outfit">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-16 flex justify-center">
              <button className="px-12 py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-[var(--primary)]/20 hover:-translate-y-1 transition-all">
                자가진단 신청하기 ➔
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--primary)] mb-4 font-outfit tracking-tighter">Consultation Request .</h2>
              <div className="w-12 h-1 bg-[var(--accent)] mx-auto rounded-full"></div>
            </div>
            
            {/* 상담 신청 폼 재활용 및 고도화 */}
            <div className="pastel-card p-12 border-2 border-[var(--accent)]">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-[var(--primary)] ml-1">이름</label>
                    <input type="text" placeholder="성함 입력" className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:border-[var(--secondary)] outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-[var(--primary)] ml-1">연락처</label>
                    <input type="tel" placeholder="010-0000-0000" className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:border-[var(--secondary)] outline-none transition-all" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[var(--primary)] ml-1">상담 구분</label>
                  <div className="flex flex-wrap gap-4">
                    {['개인회생', '개인파산', '상속/증여', '부동산', '기타'].map((type) => (
                      <button key={type} type="button" className="px-6 py-3 border border-[var(--border)] rounded-xl text-sm font-bold hover:bg-[var(--secondary)] hover:text-white transition-all">
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-[var(--primary)] ml-1">상담 내용</label>
                  <textarea rows={6} placeholder="상담받고 싶은 내용을 상세히 적어주세요." className="w-full px-5 py-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl focus:border-[var(--secondary)] outline-none transition-all resize-none"></textarea>
                </div>
                <button className="w-full py-5 bg-[var(--secondary)] text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-[#97af90] transition-all">
                  상담 신청 보내기
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
