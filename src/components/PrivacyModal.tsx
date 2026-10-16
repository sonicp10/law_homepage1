'use client';

import React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A67C52]" />
            <h3 className="text-lg font-bold text-[#2C3E50]">개인정보 수집 및 이용 동의</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-gray-600 leading-relaxed font-sans scrollbar-thin">
          <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
            법무사 김상호 사무소는 의뢰인의 개인정보를 소중히 다루며, 「개인정보 보호법」 등 관련 법령을 엄격히 준수합니다.
          </div>

          <div>
            <h4 className="font-bold text-[#2C3E50] mb-1.5">1. 개인정보 수집 및 이용 목적</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 pl-1">
              <li>개인회생·개인파산 법률 상담 및 자격 적격성 검토</li>
              <li>상담 접수 확인, 일정 안내 및 유선/방문 상담 진행</li>
              <li>문의사항 응대 및 민원 처리</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#2C3E50] mb-1.5">2. 수집하는 개인정보의 항목</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 pl-1">
              <li><strong className="text-gray-800">필수항목:</strong> 성함, 연락처(휴대전화번호), 거주지역, 상담 신청 내용</li>
              <li><strong className="text-gray-800">선택항목:</strong> 채무 대략 금액, 소득/재산 상황, 이메일, 통화 희망 시간</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#2C3E50] mb-1.5">3. 개인정보의 보유 및 이용 기간</h4>
            <p className="text-xs text-gray-600">
              수집된 개인정보는 상담 완료 및 사건 수임 여부 확정 후 <strong>1년간</strong> 보관되며, 이후 지체 없이 안전하게 파기됩니다. 단, 의뢰인이 별도로 삭제를 요청할 경우 즉시 파기합니다.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#2C3E50] mb-1.5">4. 동의 거부 권리 및 불이익</h4>
            <p className="text-xs text-gray-600">
              귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 단, 필수항목 동의 거부 시 정확한 법률 상담 및 연락 서비스 제공이 제한될 수 있습니다.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#A67C52] text-white rounded-xl font-bold text-sm shadow hover:bg-[#8e6842] transition-colors"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
