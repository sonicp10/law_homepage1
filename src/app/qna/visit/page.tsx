'use client';

import React, { useState, useEffect } from 'react';
import { formatPhone } from '@/lib/utils';

export default function VisitConsultPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    visitTime: '',
    location: '',
    content: '',
  });

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.custom-dropdown-container')) {
        setIsTimeDropdownOpen(false);
        setIsLocationDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

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
    if (!formData.visitTime) {
      alert('예약시간을 선택해주세요.');
      return;
    }
    if (!formData.location) {
      alert('거주지역을 선택해주세요.');
      return;
    }
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
                  <div className="relative custom-dropdown-container">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTimeDropdownOpen(!isTimeDropdownOpen);
                        setIsLocationDropdownOpen(false);
                      }}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-left flex items-center justify-between cursor-pointer"
                    >
                      <span className={formData.visitTime ? "text-gray-900 font-bold" : "text-gray-400"}>
                        {formData.visitTime || "예약시간 선택"}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform text-[#2C3E50]/50 ${isTimeDropdownOpen ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    
                    {isTimeDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                        {['10:00', '11:00', '14:00', '16:00'].map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, visitTime: time });
                              setIsTimeDropdownOpen(false);
                            }}
                            className={`w-full px-6 py-3.5 text-left text-sm font-bold transition-colors ${
                              formData.visitTime === time 
                                ? 'bg-[#A67C52] text-white' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
               </div>
               <div className="space-y-4">
                  <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                    <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 거주지역
                  </label>
                  <div className="relative custom-dropdown-container">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLocationDropdownOpen(!isLocationDropdownOpen);
                        setIsTimeDropdownOpen(false);
                      }}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-left flex items-center justify-between cursor-pointer"
                    >
                      <span className={formData.location ? "text-gray-900 font-bold" : "text-gray-400"}>
                        {formData.location || "거주지역 선택"}
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 transition-transform text-[#2C3E50]/50 ${isLocationDropdownOpen ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                    
                    {isLocationDropdownOpen && (
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                        {['서울', '경기', '인천'].map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, location: loc });
                              setIsLocationDropdownOpen(false);
                            }}
                            className={`w-full px-6 py-3.5 text-left text-sm font-bold transition-colors ${
                              formData.location === loc 
                                ? 'bg-[#A67C52] text-white' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
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
