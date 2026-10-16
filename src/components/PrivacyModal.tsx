'use client';

import React from 'react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#2C3E50]">개인정보 수집 및 이용 동의</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none p-1"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-gray-600 leading-relaxed">
          <div>
            <h4 className="font-bold text-gray-800 mb-1">1. 개인정보 수집 및 이용 목적</h4>
            <p>개인회생·파산 등 법률 상담 신청 접수, 본인 확인 및 상담 진행 안내</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1">2. 수집하는 개인정보 항목</h4>
            <p>성명, 연락처(휴대전화번호), 거주지역, 상담 신청 내용 등</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1">3. 보유 및 이용 기간</h4>
            <p>상담 접수일로부터 1년간 보관 후 지체 없이 파기 (의뢰인 요청 시 즉시 삭제)</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-800 mb-1">4. 동의 거부 권리</h4>
            <p>개인정보 수집 동의를 거부하실 수 있으나, 미동의 시 원활한 상담 진행이 제한될 수 있습니다.</p>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#2C3E50] text-white rounded-lg font-bold text-xs hover:bg-[#1A252F] transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
