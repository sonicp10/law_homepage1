'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPhone, formatPrice } from '@/lib/utils';

const sectionFormSchema = z.object({
  name: z.string().min(2, { message: '성함을 입력해주세요.' }),
  phone: z.string().regex(/^010-\d{3,4}-\d{4}$/, { message: '010으로 시작하는 정확한 연락처를 입력해주세요.' }),
  location: z.string().optional(),
  debtAmount: z.string().optional(),
  content: z.string().optional(),
});

type SectionFormData = z.infer<typeof sectionFormSchema>;

export default function RequestSection() {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit: handleSectionSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      debtAmount: '',
      content: ''
    }
  });

  const phoneValue = watch('phone');
  const debtValue = watch('debtAmount');

  // 전화번호 자동 포맷팅
  useEffect(() => {
    if (!phoneValue) return;
    const formatted = formatPhone(phoneValue);
    if (formatted !== phoneValue) {
      setValue('phone', formatted, { shouldValidate: true });
    }
  }, [phoneValue, setValue]);

  // 전화번호 자동 포맷팅
  useEffect(() => {
    if (!phoneValue) return;
    const formatted = formatPhone(phoneValue);
    if (formatted !== phoneValue) {
      setValue('phone', formatted, { shouldValidate: true });
    }
  }, [phoneValue, setValue]);

  const onFormSubmit = async (data: SectionFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'LANDING_SECTION_FORM',
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert('전송 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 연결 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tickers = [
    { name: '원*연', region: '서울', status: '개인회생 상담신청' },
    { name: '허*영', region: '경기', status: '개인파산 상담신청' },
    { name: '최*희', region: '부산', status: '개인회생 상담신청' },
    { name: '신*호', region: '인천', status: '개인회생 상담신청' },
    { name: '이*우', region: '대구', status: '기업파산 상담신청' },
    { name: '박*준', region: '광주', status: '개인회생 상담신청' },
    { name: '김*현', region: '대전', status: '개인회생 상담신청' },
    { name: '조*아', region: '울산', status: '개인파산 상담신청' },
  ];

  // 무한 루프를 위해 데이터를 3배로 복제하여 끊김 없는 흐름 보장
  const repeatedTickers = [...tickers, ...tickers, ...tickers];

  return (
    <section id="Request" className="pt-24 pb-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* 1. Left: Real-time Ticker List (Optimized for Seamless Loop) */}
          <div className="lg:w-1/2 flex flex-col w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--primary)]">실시간 상담신청</h2>
            </div>
            
            <div className="relative h-[400px] md:h-[560px] bg-[var(--background)] rounded-[var(--radius-card)] p-6 overflow-hidden border border-[var(--border)]">
              <div className="space-y-4 animate-scroll-vertical">
                {repeatedTickers.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--border)] flex justify-between items-center transition-all hover:scale-[1.02]">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[var(--secondary)]/20 rounded-full flex items-center justify-center text-[var(--primary)] font-bold text-xs">
                        {item.name[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[var(--primary)]">{item.name} <span className="text-xs font-normal text-gray-400">({item.region})</span></div>
                        <div className="text-[10px] text-[var(--secondary)] font-bold uppercase tracking-wider">검증된 결과</div>
                      </div>
                    </div>
                    <div className="text-[var(--primary)] font-bold text-sm bg-[var(--accent)]/30 px-3 py-1 rounded-full">
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
              {/* Vertical Fade Overlay for Smooth Appearance */}
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent z-10 pointer-events-none"></div>
            </div>
          </div>

          {/* 2. Right: Quick Request Form (Aligned Height/Position) */}
          <div className="lg:w-1/2 w-full pt-12 lg:pt-16"> {/* 상단 패딩 추가로 높이 균형 조정 */}
            <div className="bg-white border-2 border-[var(--accent)] rounded-[var(--radius-card)] p-8 md:p-10 shadow-2xl shadow-[var(--accent)]/15">
              <div className="text-center mb-10">
                <h3 className="text-2xl font-bold text-[var(--primary)] mb-2">빠른 상담 신청</h3>
                <p className="text-[var(--primary)]/60 text-sm">지금 신청하시면 10분 내로 전문 상담원이 연락드립니다.</p>
              </div>
              
              <form onSubmit={handleSectionSubmit(onFormSubmit)} className="space-y-5">
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="py-12 text-center"
                    >
                      <div className="w-20 h-20 bg-[var(--accent)]/30 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-10 h-10">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-[var(--primary)] mb-2">상담 신청 완료!</h4>
                      <p className="text-[var(--primary)]/60">전문가팀이 확인 후 10분 내로 연락드리겠습니다.</p>
                      <button 
                        type="button" 
                        onClick={() => setIsSuccess(false)}
                        className="mt-8 text-sm font-bold text-[var(--secondary)] hover:underline"
                      >
                        새로 신청하기
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="form" className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">이름</label>
                          <input 
                            {...register('name')}
                            type="text" 
                            placeholder="성함 입력"
                            className={`w-full px-4 py-3.5 bg-[var(--background)] border ${errors.name ? 'border-red-400' : 'border-[var(--border)]'} rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm`}
                          />
                          {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">연락처</label>
                          <input 
                            {...register('phone')}
                            type="tel" 
                            maxLength={13}
                            placeholder="010-0000-0000"
                            className={`w-full px-4 py-3.5 bg-[var(--background)] border ${errors.phone ? 'border-red-400' : 'border-[var(--border)]'} rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm`}
                          />
                          {errors.phone && <p className="text-[10px] text-red-500 mt-1 ml-1">{errors.phone.message}</p>}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">지역</label>
                          <input 
                            {...register('location')}
                            type="text" 
                            placeholder="예: 서울 서초구"
                            onChange={(e) => {
                              const value = e.target.value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣\s]/g, '');
                              setValue('location', value);
                            }}
                            className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">총 채무액 (선택)</label>
                          <input 
                            {...register('debtAmount')}
                            type="text" 
                            placeholder="예: 50,000,000원"
                            onChange={(e) => {
                              const value = e.target.value;
                              const prevValue = debtValue || "";
                              let newValue = value;
                              
                              // 백스페이스 감지: 글자수가 줄어들었을 때만 작동
                              if (value.length < prevValue.length && prevValue.endsWith('원') && !value.endsWith('원')) {
                                newValue = value.slice(0, -1);
                              }
                              
                              const formatted = formatPrice(newValue);
                              setValue('debtAmount', formatted, { shouldValidate: true });
                            }}
                            className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[var(--primary)]/70 mb-2 ml-1">고민 내용 (선택)</label>
                        <textarea 
                          {...register('content')}
                          rows={3}
                          placeholder="상담받고 싶은 내용을 간단히 적어주세요."
                          className="w-full px-4 py-3.5 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--secondary)] transition-colors text-sm resize-none"
                        ></textarea>
                      </div>

                      <div className="flex items-start gap-3 py-2">
                        <input type="checkbox" className="mt-1 accent-[var(--secondary)]" id="agree" required />
                        <label htmlFor="agree" className="text-[12px] text-[var(--primary)]/70 leading-tight cursor-pointer">
                          개인정보 수집 및 이용에 동의합니다. 입력하신 정보는 법률 상담 목적으로만 사용되며 SSL 암호화로 안전하게 보호됩니다.
                        </label>
                      </div>

                      <button 
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-[var(--primary)]/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? '전송 중...' : '상담 신청하기'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes scrollVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-33.33%); } /* 3배 복제했으므로 1/3 지점에서 리프레시 */
        }
        .animate-scroll-vertical {
          animation: scrollVertical 35s linear infinite;
        }
        .animate-scroll-vertical:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
