'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatPhone } from '@/lib/utils';
import PrivacyModal from '@/components/PrivacyModal';

export default function BoardWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    author: '',
    password: '',
    phone: '',
    email: '',
    location: '',
    title: '',
    content: '',
    isSecret: true,
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

    if (formData.password.length < 4) {
      alert('비밀번호는 최소 4자리 이상 입력해 주세요. (답변 열람 시 필요)');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/board-qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        alert(data.error || '상담 글 등록 중 오류가 발생했습니다.');
      }
    } catch {
      alert('서버 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
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
        <h2 className="text-3xl font-bold text-[#2C3E50]">상담 문의 접수 완료</h2>
        <p className="text-gray-500 leading-relaxed max-w-sm mx-auto text-sm">
          성공적으로 상담 문의가 등록되었습니다.<br />
          설정하신 <strong>비밀번호</strong>를 통해 게시판에서 담당 법무사의 답변을 안전하게 확인하실 수 있습니다.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            onClick={() => router.push('/qna/board')}
            className="px-6 py-3.5 bg-[#2C3E50] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#1A252F] transition-all"
          >
            게시판 목록으로 이동
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3.5 bg-[#B89E6E] text-white rounded-xl font-bold text-sm shadow-md hover:bg-[#A67C52] transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#A67C52]" />
          <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em]">1:1 비공개 상담</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50]">온라인 상담 신청</h2>
        <p className="text-sm text-gray-500 mt-2">
          채무 고민, 개인회생·파산 자격 등 궁금하신 내용을 작성해 주시면 전문 법무사가 신속하게 비밀 답변을 드립니다.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 bg-gray-50/70 border-b border-gray-200">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200/60">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-600 flex-shrink-0">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.076-.656-.682-1.11-1.34-1.07-1.042.064-1.742.607-1.846 1.488-.088.752.484 1.332 1.258 1.54 1.182.318 1.597.747 1.503 1.554-.108.92-.852 1.536-2.073 1.46-1.127-.07-1.795-.69-1.865-1.579a.75.75 0 1 0-1.493.118c.117 1.47 1.233 2.593 2.894 2.697 1.764.11 3.018-.795 3.19-2.261.157-1.341-.607-2.176-1.92-2.528-.97-.26-1.353-.614-1.284-1.202.062-.53.513-.934 1.246-.98 1.026-.063 1.472.487 1.506 1.054a.75.75 0 0 0 1.43-.371Z" clipRule="evenodd" />
            </svg>
            <span>상담글과 답변은 작성 시 입력한 <strong>비밀번호</strong>를 통해서만 열람 가능하므로 안전합니다.</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
          {/* Row 1: Author & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" /> 성함 *
              </label>
              <input 
                required
                type="text" 
                placeholder="홍길동"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
                value={formData.author}
                onChange={(e) => setFormData({...formData, author: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" /> 열람 비밀번호 *
              </label>
              <input 
                required
                type="password" 
                minLength={4}
                placeholder="비밀번호 4자리 이상 (답변 열람용)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Row 2: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" /> 연락처 *
              </label>
              <input 
                required
                type="tel" 
                maxLength={13}
                placeholder="010-1234-5678"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: formatPhone(e.target.value)})}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
                이메일 <span className="text-xs text-gray-400 font-normal">(선택)</span>
              </label>
              <input 
                type="email" 
                placeholder="답변 알림을 받으실 이메일"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Row 3: Location */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" /> 거주지역 *
            </label>
            <select 
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            >
              <option value="">거주지역을 선택해 주세요</option>
              {['서울', '경기', '인천', '부산', '대구', '대전', '광주', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Row 4: Subject */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" /> 상담 제목 *
            </label>
            <input 
              required
              type="text" 
              placeholder="예: 개인회생 신청 시 필요한 기본 자격 및 절차가 궁금합니다."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Row 5: Content */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-sm font-bold text-[#2C3E50]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A67C52]" /> 상세 상담 내용 *
            </label>
            <textarea 
              required
              rows={8}
              placeholder="채무 금액(대략), 채무 발생 경위, 현재 소득 유무, 부양가족 수 등을 구체적으로 적어주시면 더욱 정밀한 법률 검토가 가능합니다."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] text-sm resize-none"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          {/* Privacy Agreement & Secret Check */}
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="isSecret"
                checked={formData.isSecret}
                onChange={(e) => setFormData({...formData, isSecret: e.target.checked})}
                className="w-4 h-4 accent-[#A67C52] rounded cursor-pointer" 
              />
              <label htmlFor="isSecret" className="text-xs sm:text-sm text-gray-700 font-medium cursor-pointer">
                비밀글로 등록 (본인과 담당 법무사만 열람 가능하도록 보호)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                required
                id="privacy-board" 
                checked={privacyAgreed}
                onChange={(e) => setPrivacyAgreed(e.target.checked)}
                className="w-4 h-4 accent-[#A67C52] rounded cursor-pointer" 
              />
              <label htmlFor="privacy-board" className="text-xs sm:text-sm text-gray-700 font-medium cursor-pointer">
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
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => router.push('/qna/board')}
              className="w-full sm:w-1/3 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              취소하고 목록으로
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-2/3 py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#A67C52] transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  접수 처리 중...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.023c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                  상담 신청하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 개인정보 모달 */}
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
