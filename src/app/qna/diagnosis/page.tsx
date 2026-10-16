'use client';

import React, { useState, useEffect } from 'react';
import { formatPhone, formatPrice } from '@/lib/utils';
import { kakaoPixelEvent } from '@/components/analytics/KakaoPixel';
import PrivacyModal from '@/components/PrivacyModal';

type Step = 1 | 2 | 3 | 4;

export default function DiagnosisPage() {
  const [step, setStep] = useState<Step>(1);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: 기초 자격
    name: '',
    phone: '',
    birth: '',
    occupation: '',
    monthlyIncome: '',
    location: '',
    
    // Step 2: 재산 및 채무
    totalDebt: '',
    creditorCount: '',
    housingType: '',
    hasMajorAssets: '',
    
    // Step 3: 심층 상황
    debtReason: '',
    reliefHistory: '',
    seizureHistory: '',
  });

  // 전화번호 실시간 포맷팅
  useEffect(() => {
    if (formData.phone) {
      const formatted = formatPhone(formData.phone);
      if (formatted !== formData.phone) {
        setFormData(prev => ({ ...prev, phone: formatted }));
      }
    }
  }, [formData.phone]);

  // 카카오 픽셀: 자가진단 페이지 진입 시 잠재고객 이벤트 전송 (1회)
  useEffect(() => {
    kakaoPixelEvent.participation('Consulting');
  }, []);

  const handlePriceChange = (field: string, value: string) => {
    const prevValue = (formData as any)[field] || "";
    let newValue = value;
    
    if (value.length < prevValue.length && prevValue.endsWith('원') && !value.endsWith('원')) {
      newValue = value.slice(0, -1);
    }
    
    const formatted = formatPrice(newValue);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const nextStep = () => {
    // Validation for Step 1
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.occupation || !formData.location) {
        alert('성함, 연락처, 거주지역, 직업을 모두 선택/입력해 주세요.');
        return;
      }
      if (!privacyAgreed) {
        alert('개인정보 수집 및 이용에 동의해 주세요.');
        return;
      }
    }

    // Validation for Step 2
    if (step === 2) {
      if (!formData.totalDebt || !formData.housingType || !formData.hasMajorAssets) {
        alert('총 채무 금액, 거주 형태, 주요 자산 보유 여부를 입력/선택해 주세요.');
        return;
      }
    }

    setStep((prev) => (prev + 1) as Step);
  };
  
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.debtReason || !formData.reliefHistory || !formData.seizureHistory) {
      alert('채무 발생 사유, 면책 이력, 압류/독촉 여부를 모두 선택해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          debtAmount: formData.totalDebt,
          content: `[자가진단] 직업: ${formData.occupation}, 소득: ${formData.monthlyIncome || '미입력'}, 사유: ${formData.debtReason}, 압류: ${formData.seizureHistory}`,
          source: 'DIAGNOSIS_V2',
          extraInfo: formData,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');
      // 카카오 픽셀: 자가진단 제출 완료
      kakaoPixelEvent.signUp('SignUp');
      setStep(4);
    } catch (error) {
      console.error('Error:', error);
      alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 1차 진단 알고리즘 분석 (Step 4 출력용)
  const isBankruptCandidate = formData.occupation === '무직' || formData.monthlyIncome.includes('100만') || formData.monthlyIncome.includes('0원');
  const recommendedProcedure = isBankruptCandidate ? '개인파산 및 면책' : '개인회생 (채무 최대 90% 감면)';
  const estimatedReliefRate = isBankruptCandidate ? '100% 전액 탕감 가능' : '최대 60% ~ 90% 감면';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      {step < 4 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-[#A67C52] uppercase tracking-widest">
              1분 채무 자가진단
            </span>
            <span className="text-sm font-bold text-[#A67C52]">{step} / 3 단계</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#A67C52] transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full text-xs font-bold text-[#A67C52] mb-3">
              <span>⚡</span> 1분이면 신청 자격을 바로 확인하실 수 있습니다
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50]">기초 자격 확인</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">상담을 위한 기본 연락처와 직업 정보를 입력해 주세요.</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1.5">성함 *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1.5">연락처 *</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  maxLength={13}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-1.5">거주지역 *</label>
              <div className="relative">
                <select 
                  required
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52] appearance-none"
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

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-2">현재 직업 형태 *</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['직장인', '자영업자', '프리랜서', '일용직', '무직'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => updateField('occupation', o)}
                    className={`py-3 rounded-xl border font-bold transition-all text-xs ${
                      formData.occupation === o 
                        ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1.5">생년월일 (선택, 예: 850101)</label>
                <input 
                  type="text" 
                  value={formData.birth}
                  maxLength={6}
                  onChange={(e) => updateField('birth', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="6자리 입력"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1.5">월 평균 소득 (약 얼마)</label>
                <input 
                  type="text" 
                  value={formData.monthlyIncome}
                  onChange={(e) => handlePriceChange('monthlyIncome', e.target.value)}
                  placeholder="예: 2,500,000원"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            {/* Privacy Agreement */}
            <div className="pt-2">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="privacy-diag"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="w-4 h-4 accent-[#A67C52] rounded cursor-pointer"
                />
                <label htmlFor="privacy-diag" className="text-xs text-gray-600 font-medium cursor-pointer">
                  개인정보 수집 및 이용에 동의합니다.
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-[#A67C52] ml-1.5 font-bold underline"
                  >
                    [전문보기]
                  </button>
                </label>
              </div>
            </div>

            <button 
              type="button"
              onClick={nextStep}
              className="w-full py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#A67C52] transition-all mt-4"
            >
              다음 단계 (2/3) &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50]">재산 및 채무 상황</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">대략적인 규모만 파악해도 충분히 진단이 가능합니다.</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1.5">총 채무 원금 (대략) *</label>
                <input 
                  type="text" 
                  value={formData.totalDebt}
                  onChange={(e) => handlePriceChange('totalDebt', e.target.value)}
                  placeholder="예: 50,000,000원"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2C3E50] mb-1.5">채권자 수 (대략)</label>
                <input 
                  type="text" 
                  value={formData.creditorCount}
                  onChange={(e) => updateField('creditorCount', e.target.value)}
                  placeholder="예: 4곳"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-2">거주 형태 *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['자가', '전세', '월세', '무상거주/기타'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => updateField('housingType', o)}
                    className={`py-3 rounded-xl border font-bold transition-all text-xs ${
                      formData.housingType === o 
                        ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-2">본인 명의 주요 자산 보유 (부동산/차량 등) *</label>
              <div className="grid grid-cols-2 gap-3">
                {['있음 (부동산/차량 등)', '없음'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => updateField('hasMajorAssets', o)}
                    className={`py-3.5 rounded-xl border font-bold transition-all text-xs sm:text-sm ${
                      formData.hasMajorAssets === o 
                        ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={prevStep} 
                className="w-1/3 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                &larr; 이전
              </button>
              <button 
                type="button" 
                onClick={nextStep} 
                className="w-2/3 py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#A67C52] transition-all"
              >
                다음 단계 (3/3) &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-xl animate-in fade-in duration-300">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50]">마지막 단계</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">현재 처하신 상황을 선택해 주시면 맞춤 분석이 완료됩니다.</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-2">주된 채무 발생 사유 *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['생활비 부족', '사업 부진', '주식/코인 투자', '사기/보증 피해'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => updateField('debtReason', o)}
                    className={`py-3 rounded-xl border font-bold transition-all text-xs ${
                      formData.debtReason === o 
                        ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-2">최근 5년 이내 면책 이력 (회생/파산 등) *</label>
              <div className="grid grid-cols-2 gap-3">
                {['과거 면책 이력 있음', '처음 신청 (이력 없음)'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => updateField('reliefHistory', o)}
                    className={`py-3.5 rounded-xl border font-bold transition-all text-xs sm:text-sm ${
                      formData.reliefHistory === o 
                        ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2C3E50] mb-2">현재 급여/통장 압류 또는 독촉 여부 *</label>
              <div className="grid grid-cols-2 gap-3">
                {['독촉/압류 진행 중 (시급)', '아직 압류 없음'].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => updateField('seizureHistory', o)}
                    className={`py-3.5 rounded-xl border font-bold transition-all text-xs sm:text-sm ${
                      formData.seizureHistory === o 
                        ? 'border-[#A67C52] bg-[#A67C52]/10 text-[#A67C52]' 
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button" 
                onClick={prevStep} 
                className="w-1/3 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
              >
                &larr; 이전
              </button>
              <button 
                type="button"
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-2/3 py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#A67C52] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    진단 분석 중...
                  </>
                ) : (
                  '무료 진단 결과 확인하기'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: 즉각적인 1차 진단 결과 리포트 (WOW UX) */}
      {step === 4 && (
        <div className="space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#A67C52] uppercase tracking-widest">Preliminary Legal Report</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#2C3E50] mt-1">1차 자가진단 분석 결과</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              <strong>{formData.name}</strong> 님의 입력 데이터를 바탕으로 도출된 1차 법률 검토 결과입니다.
            </p>
          </div>

          {/* Diagnosis Report Card */}
          <div className="bg-gradient-to-br from-[#2C3E50] to-[#1A252F] text-white rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="text-xs text-gray-300">최적 추천 제도</span>
              <span className="px-3 py-1 bg-[#B89E6E] text-white rounded-full text-xs font-bold">
                {recommendedProcedure}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-gray-300 block mb-1">예상 채무 탕감률</span>
                <span className="text-lg sm:text-xl font-black text-[#B89E6E]">{estimatedReliefRate}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <span className="text-xs text-gray-300 block mb-1">독촉·압류 중단 효과</span>
                <span className="text-lg sm:text-xl font-black text-emerald-400">금지명령 100% 가능</span>
              </div>
            </div>

            <div className="text-xs text-gray-300 space-y-1.5 pt-2">
              <p>✓ 입력하신 총 채무(약 {formData.totalDebt || '입력값'})에 대해 법정 최저생계비 보장을 받으실 수 있습니다.</p>
              <p>✓ 법원 접수 즉시 모든 독촉 전화, 자택 방문, 급여 압류가 법적으로 금지됩니다.</p>
            </div>
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 text-xs sm:text-sm text-amber-900 leading-relaxed text-center">
            담당 전문 법무사에게 상세 분석 데이터가 안전하게 전달되었습니다.<br />
            <strong>30분 이내</strong>에 입력하신 연락처({formData.phone})로 1:1 맞춤 정밀 변제 계획을 브리핑해 드립니다.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex-1 py-3.5 bg-[#2C3E50] text-white rounded-xl font-bold text-sm shadow hover:bg-[#1A252F] transition-all"
            >
              홈으로 이동
            </button>
            <button 
              onClick={() => window.location.href = '/qna/phone'}
              className="flex-1 py-3.5 bg-[#B89E6E] text-white rounded-xl font-bold text-sm shadow hover:bg-[#A67C52] transition-all"
            >
              지금 바로 직통 상담하기 &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 개인정보 모달 */}
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
