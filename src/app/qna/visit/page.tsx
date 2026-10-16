'use client';

import React, { useState, useEffect } from 'react';
import { formatPhone } from '@/lib/utils';
import PrivacyModal from '@/components/PrivacyModal';

export default function VisitConsultPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    visitDate: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
    visitTime: '',
    location: '',
    category: '개인회생',
    content: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    if (!privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    if (!formData.visitTime) {
      alert('방문 예약 시간을 선택해 주세요.');
      return;
    }
    if (!formData.location) {
      alert('거주지역을 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'VISIT',
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          category: formData.category,
          visitDate: formData.visitDate,
          visitTime: formData.visitTime,
          content: formData.content,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert('예약 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch {
      alert('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
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
        <h2 className="text-3xl font-bold text-[#2C3E50]">방문 예약 신청 완료</h2>
        <div className="bg-gray-50 p-6 rounded-2xl max-w-sm mx-auto text-left space-y-2 text-sm border border-gray-100">
          <p><strong>예약 일자:</strong> {formData.visitDate}</p>
          <p><strong>예약 시간:</strong> {formData.visitTime}</p>
          <p><strong>신청자:</strong> {formData.name} 님</p>
          <p><strong>상담 분야:</strong> {formData.category}</p>
        </div>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto text-xs sm:text-sm">
          방문 일정을 확인한 후 담당 법무사가 신속하게 확인 전화를 드리겠습니다.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3.5 bg-[#B89E6E] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#A67C52] transition-all inline-block mt-4"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#A67C52]" />
          <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em]">1:1 대면 법률상담</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50]">방문 상담 예약</h2>
        <p className="text-sm text-gray-500 mt-2">
          원하시는 날짜와 시간을 선택해 주시면 편안하고 조용한 전용 상담실에서 법무사가 직접 1:1 심층 상담을 진행합니다.
        </p>
      </div>

      <div className="bg-[#F9F9F9] border border-gray-100 p-8 sm:p-12 md:p-16 rounded-3xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            
            {/* Left: Calendar */}
            <div className="lg:col-span-5">
              <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50] mb-6">
                <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 1. 예약 날짜 선택
              </label>
              
              <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
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

                <div className="grid grid-cols-7 gap-2 text-center mb-3">
                  {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                    <span key={d} className={`text-xs font-bold ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'}`}>{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateObj = new Date(year, month, day);
                    const dayOfWeek = dateObj.getDay();
                    const isSunday = dayOfWeek === 0;
                    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isSelected = formData.visitDate === formattedDate;
                    const isPast = year < today.getFullYear() || (year === today.getFullYear() && month < today.getMonth()) || (year === today.getFullYear() && month === today.getMonth() && day < today.getDate());
                    
                    return (
                      <button 
                        key={day}
                        type="button"
                        disabled={isPast || isSunday}
                        onClick={() => handleDateClick(day)}
                        className={`h-10 sm:h-12 w-full flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all ${
                          isSelected ? 'bg-[#A67C52] text-white shadow-md scale-105' : 
                          isPast || isSunday ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 
                          'hover:bg-amber-50 text-gray-700'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-4 mt-6 justify-center text-xs text-gray-500 font-medium">
                   <div className="flex items-center gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#A67C52]" />
                     <span>선택일 ({formData.visitDate})</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                     <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                     <span>예약 불가(일요일/과거)</span>
                   </div>
                </div>

                <p className="text-[11px] text-gray-400 text-center mt-3">
                  * 토요일 예약의 경우 사전 확인 전화를 통해 일정이 조율됩니다.
                </p>
              </div>
            </div>

            {/* Right: Form Info */}
            <div className="lg:col-span-7 space-y-8 pt-2">
              <label className="flex items-center gap-2 text-lg font-bold text-[#2C3E50]">
                <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full"></span> 2. 예약자 정보 및 상담 내용
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-[#2C3E50]">성함 *</label>
                    <input 
                      required
                      type="text" 
                      placeholder="홍길동"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-[#2C3E50]">연락처 *</label>
                    <input 
                      required
                      type="tel" 
                      maxLength={13}
                      placeholder="010-1234-5678"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                 {/* Visit Time */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-[#2C3E50]">예약 시간 *</label>
                    <div className="relative custom-dropdown-container">
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeDropdownOpen(!isTimeDropdownOpen);
                          setIsLocationDropdownOpen(false);
                        }}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-left flex items-center justify-between text-sm"
                      >
                        <span className={formData.visitTime ? "text-gray-900 font-bold" : "text-gray-400"}>
                          {formData.visitTime || "시간 선택"}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform text-[#2C3E50]/50 ${isTimeDropdownOpen ? 'rotate-180' : ''}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      
                      {isTimeDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-y-auto max-h-56 scrollbar-thin">
                          {['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, visitTime: time });
                                setIsTimeDropdownOpen(false);
                              }}
                              className={`w-full px-5 py-3 text-left text-xs sm:text-sm font-bold transition-colors ${
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

                 {/* Location */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-[#2C3E50]">거주지역 *</label>
                    <div className="relative custom-dropdown-container">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLocationDropdownOpen(!isLocationDropdownOpen);
                          setIsTimeDropdownOpen(false);
                        }}
                        className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-left flex items-center justify-between text-sm"
                      >
                        <span className={formData.location ? "text-gray-900 font-bold" : "text-gray-400"}>
                          {formData.location || "지역 선택"}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 transition-transform text-[#2C3E50]/50 ${isLocationDropdownOpen ? 'rotate-180' : ''}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </button>
                      
                      {isLocationDropdownOpen && (
                        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-y-auto max-h-56 scrollbar-thin">
                          {['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map((loc) => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, location: loc });
                                setIsLocationDropdownOpen(false);
                              }}
                              className={`w-full px-5 py-3 text-left text-xs sm:text-sm font-bold transition-colors ${
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

                 {/* Category */}
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-[#2C3E50]">상담분야 *</label>
                    <select
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm appearance-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="개인회생">개인회생</option>
                      <option value="개인파산">개인파산</option>
                      <option value="기타채무">기타 채무상담</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2C3E50]">상담 내용 <span className="text-xs text-gray-400 font-normal">(선택)</span></label>
                <textarea 
                  rows={4}
                  placeholder="대략적인 채무 액수나 방문 시 중점적으로 상담받고 싶으신 내용을 작성해 주시면 맞춤 상담 서류를 미리 준비해 드립니다."
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                />
              </div>

              {/* Office Location Briefing */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#A67C52] flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[#2C3E50]">법무사 김상호 사무소 방문 안내</p>
                    <p className="text-gray-500 mt-0.5">서울 서초구 서초중앙로 (교대역 도보 3분) | 건물 내 무료 주차 지원</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#A67C52] bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                  개인 전용 상담실 구비
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col items-center space-y-6">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  required 
                  id="privacy-visit" 
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 accent-[#A67C52] rounded cursor-pointer" 
                />
                <label htmlFor="privacy-visit" className="text-xs sm:text-sm text-gray-600 font-medium cursor-pointer">
                  개인정보 수집 및 이용에 동의합니다.
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-[#A67C52] ml-2 font-bold underline cursor-pointer hover:text-[#8e6842]"
                  >
                    [전문보기]
                  </button>
                </label>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-16 py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-lg shadow-xl hover:bg-[#A67C52] transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    예약 접수 중...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    방문 상담 예약하기
                  </>
                )}
              </button>
          </div>
        </form>
      </div>

      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
