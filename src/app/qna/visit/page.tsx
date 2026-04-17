'use client';

import React, { useState } from 'react';

export default function VisitConsultPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDate: '2026-04-20',
    visitTime: '',
    location: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'VISIT' }),
      });
      if (res.ok) alert('방문 상담 예약이 신청되었습니다.');
      else alert('전송 중 오류가 발생했습니다.');
    } catch (err) {
      alert('서버 연결 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-[#F9F9F9] border border-gray-100 p-12 md:p-16 rounded-3xl shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Calendar (Visual mockup based on Image 2) */}
          <div className="lg:col-span-5">
            <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50] mb-8">
              <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 예약날짜선택
            </label>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 opacity-40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h4 className="text-xl font-black text-[#2C3E50]">2026-04</h4>
                <button type="button" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 opacity-40">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-4 text-center mb-4">
                {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                  <span key={d} className={`text-xs font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>{d}</span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(day => (
                  <button 
                    key={day}
                    type="button"
                    className={`h-12 w-full flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      day === 20 ? 'bg-[#A67C52] text-white' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="flex gap-6 mt-10 justify-center">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-[#A67C52]"></div>
                   <span className="text-xs font-bold text-gray-500">예약 선택</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                   <span className="text-xs font-bold text-gray-500">예약 불가</span>
                 </div>
              </div>
            </div>
          </div>

          {/* Right: Form Info */}
          <div className="lg:col-span-7 space-y-10 pt-4">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                    <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 성함
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder="이름을 입력하세요"
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52]"
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
                    placeholder="연락처를 입력하세요"
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                    <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 예약시간
                  </label>
                  <select 
                    required
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] appearance-none"
                    value={formData.visitTime}
                    onChange={(e) => setFormData({...formData, visitTime: e.target.value})}
                  >
                    <option value="">예약시간 선택</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                  </select>
               </div>
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                    <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 거주지역
                  </label>
                  <select 
                    required
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] appearance-none"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="">거주지역 선택</option>
                    <option value="서울">서울</option>
                    <option value="경기">경기</option>
                    <option value="인천">인천</option>
                  </select>
               </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 상담내용
              </label>
              <textarea 
                required
                placeholder="상담내용을 입력하세요"
                rows={5}
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] resize-none"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center space-y-8">
            <div className="flex items-center gap-3">
                <input type="checkbox" required className="w-5 h-5 accent-[#A67C52]" id="privacy-visit" />
                <label htmlFor="privacy-visit" className="text-sm font-medium text-gray-400">
                  개인정보 수집 및 이용동의 <span className="text-[#A67C52] ml-2 cursor-pointer hover:underline">전문보기</span>
                </label>
            </div>

            <button 
              type="submit"
              className="px-24 py-5 bg-[#B89E6E] text-white rounded-xl font-bold text-xl shadow-xl hover:bg-[#A67C52] transition-all flex items-center gap-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              예약하기
            </button>
        </div>
      </form>
    </div>
  );
}
