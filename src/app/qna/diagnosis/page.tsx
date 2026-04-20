'use client';

import React, { useState, useEffect } from 'react';
import { formatPhone, formatPrice } from '@/lib/utils';

type Step = 1 | 2 | 3 | 4;

export default function DiagnosisPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    // Step 1: 기초 자격
    name: '',
    phone: '',
    birth: '',
    occupation: '',
    monthlyIncome: '',
    
    // Step 2: 재산 및 채무
    totalDebt: '',
    creditorCount: '',
    housingType: '',
    hasMajorAssets: '', // 부동산/차량 등 주요자산 여부
    
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

  const handlePriceChange = (field: string, value: string) => {
    const prevValue = (formData as any)[field] || "";
    let newValue = value;
    
    // 백스페이스 감지: 글자수가 줄어들었고, 이전 값은 '원'으로 끝났는데 현재 값은 그렇지 않다면 마지막 숫자도 삭제
    if (value.length < prevValue.length && prevValue.endsWith('원') && !value.endsWith('원')) {
      newValue = value.slice(0, -1);
    }
    
    const formatted = formatPrice(newValue);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const nextStep = () => {
    // Validation for Step 1
    if (step === 1 && (!formData.name || !formData.phone || !formData.occupation)) {
      alert('필수 정보를 모두 입력해 주세요.');
      return;
    }
    setStep((prev) => (prev + 1) as Step);
  };
  
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          debtAmount: formData.totalDebt,
          content: `사유: ${formData.debtReason}`,
          source: 'DIAGNOSIS_V2',
          extraInfo: formData,
        }),
      });

      if (!response.ok) throw new Error('Submission failed');
      setStep(4);
    } catch (error) {
      console.error('Error:', error);
      alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      {step < 4 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-[var(--primary)]/40 uppercase tracking-widest">Diagnosis Progress</span>
            <span className="text-sm font-bold text-[var(--secondary)]">{step} / 3</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--secondary)] transition-all duration-500 ease-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-3">기본 자격 확인</h2>
            <p className="text-[var(--primary)]/60">3분이면 충분합니다. 핵심 정보만 입력해 주세요.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-2">성함 *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="박철수"
                  className="w-full px-5 py-4 bg-white border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--secondary)]/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-2">연락처 *</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  maxLength={13}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-5 py-4 bg-white border border-[var(--border)] rounded-2xl focus:ring-2 focus:ring-[var(--secondary)]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-3">현재 직업 *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['직장인', '자영업자', '프리랜서', '일용직', '무직'].map((o) => (
                  <button
                    key={o}
                    onClick={() => updateField('occupation', o)}
                    className={`py-4 rounded-xl border-2 font-bold transition-all text-sm ${
                      formData.occupation === o 
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/5 text-[var(--primary)]' 
                        : 'border-[var(--border)] text-[var(--primary)]/40 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-2">생년월일 (예: 850101)</label>
                <input 
                  type="text" 
                  value={formData.birth}
                  maxLength={6}
                  onChange={(e) => updateField('birth', e.target.value.replace(/[^\d]/g, ''))}
                  placeholder="6자리 입력"
                  className="w-full px-5 py-4 bg-white border border-[var(--border)] rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-2">월 평균 소득 (약 얼마)</label>
                <input 
                  type="text" 
                  value={formData.monthlyIncome}
                  onChange={(e) => handlePriceChange('monthlyIncome', e.target.value)}
                  placeholder="예: 2,500,000원"
                  className="w-full px-5 py-4 bg-white border border-[var(--border)] rounded-2xl outline-none"
                />
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="w-full py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg shadow-lg hover:-translate-y-1 transition-all mt-6"
            >
              다음 단계 (2/3)
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-3">재산 및 채무 상황</h2>
            <p className="text-[var(--primary)]/60">대략적인 규모만 파악해도 진단이 가능합니다.</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-2">총 채무 원금 (대략)</label>
                <input 
                  type="text" 
                  value={formData.totalDebt}
                  onChange={(e) => handlePriceChange('totalDebt', e.target.value)}
                  placeholder="예: 50,000,000원"
                  className="w-full px-5 py-4 bg-white border border-[var(--border)] rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-2">채권자 수 (대략)</label>
                <input 
                  type="text" 
                  value={formData.creditorCount}
                  onChange={(e) => updateField('creditorCount', e.target.value)}
                  placeholder="예: 5곳"
                  className="w-full px-5 py-4 bg-white border border-[var(--border)] rounded-2xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-3">거주 형태 *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['자가', '전세', '월세', '기타'].map((o) => (
                  <button
                    key={o}
                    onClick={() => updateField('housingType', o)}
                    className={`py-4 rounded-xl border-2 font-bold transition-all text-sm ${
                      formData.housingType === o 
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/5 text-[var(--primary)]' 
                        : 'border-[var(--border)] text-[var(--primary)]/40 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-3">본인 명의 주요 자산 보유 (부동산/차량 등) *</label>
              <div className="grid grid-cols-2 gap-4">
                {['있음', '없음'].map((o) => (
                  <button
                    key={o}
                    onClick={() => updateField('hasMajorAssets', o)}
                    className={`py-4 rounded-xl border-2 font-bold transition-all ${
                      formData.hasMajorAssets === o 
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/5 text-[var(--primary)]' 
                        : 'border-[var(--border)] text-[var(--primary)]/40 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={prevStep} className="flex-1 py-5 bg-gray-100 text-[var(--primary)]/60 rounded-2xl font-bold">이전</button>
              <button onClick={nextStep} className="flex-[2] py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg shadow-lg hover:-translate-y-1 transition-all">다음 단계 (3/3)</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--primary)] mb-3">마지막 단계</h2>
            <p className="text-[var(--primary)]/60">거의 다 왔습니다. 현재 상황을 선택해 주세요.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[var(--primary)] mb-3">주된 채무 발생 사유 *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['생활비', '사업실패', '주식/코인', '보증/사기'].map((o) => (
                  <button
                    key={o}
                    onClick={() => updateField('debtReason', o)}
                    className={`py-4 rounded-xl border-2 font-bold transition-all text-xs ${
                      formData.debtReason === o 
                        ? 'border-[var(--secondary)] bg-[var(--secondary)]/5 text-[var(--primary)]' 
                        : 'border-[var(--border)] text-[var(--primary)]/40 hover:border-gray-300'
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-3">최근 면책 이력 (회생/파산 등) *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['있음', '없음'].map((o) => (
                    <button
                      key={o}
                      onClick={() => updateField('reliefHistory', o)}
                      className={`py-4 rounded-xl border-2 font-bold transition-all text-sm ${
                        formData.reliefHistory === o 
                          ? 'border-[var(--secondary)] bg-[var(--secondary)]/5 text-[var(--primary)]' 
                          : 'border-[var(--border)] text-[var(--primary)]/40 hover:border-gray-300'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--primary)] mb-3">현재 압류 또는 독촉 여부 *</label>
                <div className="grid grid-cols-2 gap-3">
                  {['진행 중', '해당 없음'].map((o) => (
                    <button
                      key={o}
                      onClick={() => updateField('seizureHistory', o)}
                      className={`py-4 rounded-xl border-2 font-bold transition-all text-sm ${
                        formData.seizureHistory === o 
                          ? 'border-[var(--secondary)] bg-[var(--secondary)]/5 text-[var(--primary)]' 
                          : 'border-[var(--border)] text-[var(--primary)]/40 hover:border-gray-300'
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={prevStep} className="flex-1 py-5 bg-gray-100 text-[var(--primary)]/60 rounded-2xl font-bold">이전</button>
              <button 
                onClick={handleSubmit} 
                className="flex-[2] py-5 bg-[var(--secondary)] text-[var(--primary)] rounded-2xl font-bold text-lg shadow-lg shadow-[var(--secondary)]/20 hover:-translate-y-1 transition-all"
              >
                무료 진단 결과 받기
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center py-20 animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">제출이 완료되었습니다!</h2>
          <p className="text-[var(--primary)]/60 mb-10">
            입력하신 정보를 바탕으로 정밀 분석 후<br />
            빠른 시일 내에 전문가가 연락드리겠습니다.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-8 py-3.5 bg-[var(--primary)] text-white rounded-full font-bold shadow-lg"
          >
            홈으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
