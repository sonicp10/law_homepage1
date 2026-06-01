'use client';

import React, { useState } from 'react';
import { formatPhone } from '@/lib/utils';

export default function PhoneConsultPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    category: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'PHONE' }),
      });
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (err) {
      alert('서버 연결 오류가 발생했습니다.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-3xl p-10 md:p-16 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-[#2C3E50]">상담 신청 완료</h2>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto">
          성공적으로 상담 신청이 접수되었습니다.<br />
          신속하게 내용을 확인한 후 법무사가 직접 연락드리겠습니다.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#A67C52] transition-all inline-block mt-4"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white border border-gray-100 shadow-2xl rounded-3xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Form */}
        <div className="lg:w-1/2 p-12 md:p-16 lg:p-20 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
               <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                 <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 성함
               </label>
               <input 
                 required
                 type="text" 
                 placeholder="이름을 입력하세요"
                 className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
            </div>

            <div className="space-y-4">
               <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                 <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 연락처
               </label>
               <input 
                 required
                 type="tel" 
                 maxLength={13}
                 placeholder="연락처를 입력하세요"
                 className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors"
                 value={formData.phone}
                 onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
               />
            </div>

            <div className="space-y-4">
               <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                 <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 거주지역
               </label>
               <div className="relative">
                 <select 
                   required
                   className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors appearance-none"
                   value={formData.location}
                   onChange={(e) => setFormData({...formData, location: e.target.value})}
                 >
                   <option value="">거주지역 선택</option>
                   <option value="서울">서울</option>
                   <option value="경기">경기</option>
                   <option value="인천">인천</option>
                   <option value="부산">부산</option>
                   <option value="대구">대구</option>
                   <option value="대전">대전</option>
                   <option value="광주">광주</option>
                   <option value="울산">울산</option>
                   <option value="세종">세종</option>
                   <option value="강원">강원</option>
                   <option value="충북">충북</option>
                   <option value="충남">충남</option>
                   <option value="전북">전북</option>
                   <option value="전남">전남</option>
                   <option value="경북">경북</option>
                   <option value="경남">경남</option>
                   <option value="제주">제주</option>
                 </select>
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
               <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                 <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 업무분야
               </label>
               <div className="relative">
                 <select 
                   required
                   className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors appearance-none"
                   value={formData.category}
                   onChange={(e) => setFormData({...formData, category: e.target.value})}
                 >
                   <option value="">업무분야 선택</option>
                   <option value="개인회생">개인회생</option>
                   <option value="개인파산">개인파산</option>
                 </select>
                 <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" required className="w-5 h-5 accent-[#A67C52]" id="privacy" />
                <label htmlFor="privacy" className="text-sm font-medium text-gray-400">
                  개인정보 수집 및 이용동의 <span className="text-[#A67C52] ml-2 cursor-pointer hover:underline">전문보기</span>
                </label>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-6 bg-[#B89E6E] text-white rounded-xl font-bold text-xl shadow-xl hover:bg-[#A67C52] transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 12.426 10.074 22.5 22.5 22.5 1.242 0 2.25-1.008 2.25-2.25v-4.509c0-1.11-.901-2.009-2.008-2.009l-4.509.006c-1.11 0-2.012.91-2.012 2.009l-.014 2.254c-7.923-1.01-14.332-7.419-15.342-15.342l2.254-.014c1.098 0 2.009-.902 2.009-2.012l.006-4.509c0-1.11-.899-2.008-2.009-2.008H4.5c-1.242 0-2.25 1.008-2.25 2.25v4.5z" />
              </svg>
              상담 신청
            </button>
          </form>
        </div>

        {/* Right: Image */}
        <div className="lg:w-1/2 relative min-h-[500px] lg:min-h-full">
          <img 
            src="/images/phone-consultation.jpg" 
            alt="상담 이미지"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
