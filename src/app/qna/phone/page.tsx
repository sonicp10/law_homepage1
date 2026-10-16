'use client';

import React, { useState } from 'react';
import { formatPhone } from '@/lib/utils';
import PrivacyModal from '@/components/PrivacyModal';

export default function PhoneConsultPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    category: '',
    preferredTime: '언제나 가능',
    content: '',
  });
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!privacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const fullContent = [
        formData.preferredTime ? `[희망시간: ${formData.preferredTime}]` : '',
        formData.content ? formData.content : '',
      ].filter(Boolean).join('\n');

      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PHONE',
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          category: formData.category,
          content: fullContent || null,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert('상담 신청 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
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
        <h2 className="text-3xl font-bold text-[#2C3E50]">전화 상담 신청 완료</h2>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto text-sm">
          성공적으로 실시간 전화 상담 신청이 접수되었습니다.<br />
          신속하게 내용을 확인한 후 담당 법무사가 직접 안심 연락을 드리겠습니다.
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
    <div className="max-w-7xl mx-auto bg-white border border-gray-100 shadow-xl rounded-3xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Form */}
        <div className="lg:w-7/12 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#A67C52]" />
              <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em]">1:1 비공개 유선상담</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50]">실시간 전화 상담 신청</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              신청을 남겨주시면 담당 법무사가 신속하고 편안하게 상담 전화를 드립니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                  <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full" /> 성함 *
                </label>
                <input 
                  required
                  type="text" 
                  placeholder="홍길동"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                  <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full" /> 연락처 *
                </label>
                <input 
                  required
                  type="tel" 
                  maxLength={13}
                  placeholder="010-1234-5678"
                  className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors text-sm"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                  <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full" /> 거주지역 *
                </label>
                <div className="relative">
                  <select 
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors appearance-none text-sm"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="">거주지역 선택</option>
                    {['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                  <span className="w-1.5 h-1.5 bg-[#A67C52] rounded-full" /> 상담분야 *
                </label>
                <div className="relative">
                  <select 
                    required
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors appearance-none text-sm"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">업무분야 선택</option>
                    <option value="개인회생">개인회생</option>
                    <option value="개인파산">개인파산</option>
                    <option value="기타채무">기타 채무 조정/상담</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                통화 희망 시간대 <span className="text-xs text-gray-400 font-normal">(선택)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  '언제나 가능',
                  '오전 (09~12시)',
                  '오후 (13~15시)',
                  '오후 (15~18시)',
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, preferredTime: t })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      formData.preferredTime === t
                        ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                상담 문의 내용 <span className="text-xs text-gray-400 font-normal">(선택: 채무액, 독촉 현황 등)</span>
              </label>
              <textarea 
                rows={3}
                placeholder="간단한 현재 상황이나 문의사항을 남겨주시면 통화 시 더욱 맞춤형으로 안내해 드립니다."
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors text-sm resize-none"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input 
                type="checkbox" 
                required 
                id="privacy-phone" 
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="w-4 h-4 accent-[#A67C52] rounded cursor-pointer" 
              />
              <label htmlFor="privacy-phone" className="text-xs sm:text-sm text-gray-600 font-medium cursor-pointer">
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
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-lg shadow-xl hover:bg-[#A67C52] transition-all"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  신청 접수 중...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 12.426 10.074 22.5 22.5 22.5 1.242 0 2.25-1.008 2.25-2.25v-4.509c0-1.11-.901-2.009-2.008-2.009l-4.509.006c-1.11 0-2.012.91-2.012 2.009l-.014 2.254c-7.923-1.01-14.332-7.419-15.342-15.342l2.254-.014c1.098 0 2.009-.902 2.009-2.012l.006-4.509c0-1.11-.899-2.008-2.009-2.008H4.5c-1.242 0-2.25 1.008-2.25 2.25v4.5z" />
                  </svg>
                  전화 상담 신청하기
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Info & Trust Panel */}
        <div className="lg:w-5/12 bg-gradient-to-br from-[#2C3E50] to-[#1A252F] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-8 relative z-10">
            <div>
              <span className="text-xs font-bold text-[#B89E6E] uppercase tracking-widest block mb-2">Law Office Promise</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                의뢰인의 빚 고민,<br />
                가장 정직하고 안전하게<br />
                해결해 드립니다.
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#B89E6E]/20 text-[#B89E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">100% 비밀 보장 원칙</h4>
                  <p className="text-xs text-gray-300 mt-0.5">가족, 직장, 지인 누구에게도 상담 및 신청 사실이 일체 노출되지 않습니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#B89E6E]/20 text-[#B89E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">사무장 없는 법무사 직접 상담</h4>
                  <p className="text-xs text-gray-300 mt-0.5">경험 많은 전문 법무사가 사건 검토부터 신청까지 1:1로 직접 책임집니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#B89E6E]/20 text-[#B89E6E] flex items-center justify-center flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">수임료 자체 무이자 분납 지원</h4>
                  <p className="text-xs text-gray-300 mt-0.5">의뢰인의 초기 비용 부담을 덜어드리기 위해 맞춤형 분납을 지원합니다.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8 relative z-10">
            <p className="text-xs text-gray-400">직통 빠른 전화 상담</p>
            <p className="text-2xl font-black text-[#B89E6E] mt-1 tracking-wider">02-588-8888</p>
            <p className="text-[11px] text-gray-400 mt-1">평일 09:00 ~ 18:00 (주말 및 야간은 온라인 접수 가능)</p>
          </div>
        </div>
      </div>

      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
