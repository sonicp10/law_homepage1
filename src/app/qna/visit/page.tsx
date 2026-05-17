'use client';

import React, { useState } from 'react';
import { formatPhone } from '@/lib/utils';

export default function VisitConsultPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    visitTime: '',
    location: '',
    content: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData({ ...formData, visitDate: formattedDate });
  };

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
                <button type="button" onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h4 className="text-xl font-black text-[#2C3E50]">{year}년 {month + 1}월</h4>
                <button type="button" onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
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
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = formData.visitDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isPast = year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth()) || (year === today.getFullYear() && month === today.getMonth() && day < today.getDate());
                  
                  return (
                    <button 
                      key={day}
                      type="button"
                      disabled={isPast}
                      onClick={() => handleDateClick(day)}
                      className={`h-12 w-full flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                        isSelected ? 'bg-[#A67C52] text-white shadow-md' : 
                        isPast ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 
                        'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
                    maxLength={13}
                    placeholder="연락처를 입력하세요"
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                    <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 예약시간
                  </label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] appearance-none pr-12 cursor-pointer"
                      value={formData.visitTime}
                      onChange={(e) => setFormData({...formData, visitTime: e.target.value})}
                    >
                      <option value="">예약시간 선택</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="16:00">16:00</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[#2C3E50]">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                       </svg>
                    </div>
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                    <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 거주지역
                  </label>
                  <div className="relative">
                    <select 
                      required
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] appearance-none pr-12 cursor-pointer"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    >
                      <option value="">거주지역 선택</option>
                      <option value="서울">서울</option>
                      <option value="경기">경기</option>
                      <option value="인천">인천</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[#2C3E50]">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                       </svg>
                    </div>
                  </div>
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
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center break-keep">
                <input type="checkbox" required className="w-5 h-5 accent-[#A67C52] flex-shrink-0" id="privacy-visit" />
                <label htmlFor="privacy-visit" className="text-sm font-medium text-gray-400">
                  개인정보 수집 및 이용동의 <span className="text-[#A67C52] ml-2 cursor-pointer hover:underline">전문보기</span>
                </label>
            </div>

            <button 
              type="submit"
              className="w-full sm:w-auto px-10 sm:px-24 py-5 bg-[#B89E6E] text-white rounded-xl font-bold text-xl shadow-xl hover:bg-[#A67C52] transition-all flex items-center justify-center gap-3 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              예약하기
            </button>
        </div>
      </form>
    </div>
  );
}
