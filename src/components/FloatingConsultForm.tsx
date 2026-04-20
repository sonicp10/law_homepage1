'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPhone } from '@/lib/utils';

const formSchema = z.object({
  type: z.enum(['개인회생', '개인파산']),
  name: z.string().min(2, { message: '성함을 2자 이상 입력해주세요.' }),
  phone: z.string().regex(/^010-\d{3,4}-\d{4}$/, { message: '010으로 시작하는 정확한 연락처를 입력해주세요.' }),
  content: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function FloatingConsultForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Type/Content, 2: Name/Phone, 3: Success
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '개인회생',
      name: '',
      phone: '',
      content: ''
    }
  });

  const selectedType = watch('type');
  const phoneValue = watch('phone');

  // 전화번호 자동 포맷팅
  useEffect(() => {
    if (!phoneValue) return;
    const formatted = formatPhone(phoneValue);
    if (formatted !== phoneValue) {
      setValue('phone', formatted, { shouldValidate: true });
    }
  }, [phoneValue, setValue]);

  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(true);
    
    // 로컬 스토리지에서 위치 기억 (새로고침 시 유지)
    const savedPos = localStorage.getItem('widgetPos');
    if (savedPos) {
      try {
        setPosition(JSON.parse(savedPos));
      } catch (e) {
        console.error('Failed to load position');
      }
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    // 입력창이나 버튼 클릭 시에는 드래그 방지
    const target = e.target as HTMLElement;
    if (target.closest('input') || target.closest('button') || target.closest('textarea')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem('widgetPos', JSON.stringify(position));
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  const onFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'DRAGGABLE_PREMIUM_WIDGET_STEP',
          preferredType: data.type
        }),
      });

      if (response.ok) {
        setCurrentStep(3); // Show success message
        
        // 3초 후 자동으로 닫기 (사용자 요청 사항)
        setTimeout(() => {
          setIsOpen(false);
          // 상태 초기화
          setCurrentStep(1);
          reset();
        }, 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.details || errorData.error || '알 수 없는 서버 오류';
        alert(`전송 중 오류가 발생했습니다: ${errorMsg}\n다시 시도해 주세요.`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-6 bottom-40 z-50 w-16 h-16 bg-[#2C3E50] text-[#90CAF9] rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all border-2 border-[#34495E]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      </button>
    );
  }

  return (
    <div 
      ref={widgetRef}
      onMouseDown={handleMouseDown}
      style={{ left: position.x, top: position.y }}
      className={`fixed z-[100] transition-transform duration-300 ${isDragging ? 'cursor-grabbing scale-[1.02]' : 'cursor-grab'}`}
    >
      {/* Ultra-Wide & Shorter Premium Frame */}
      <div className="relative w-[260px] sm:w-[280px] lg:w-[300px] bg-gradient-to-br from-[#F3EAD3] via-[#E8DCC4] to-[#D4CEC1] border border-[#C4B494] rounded-[3rem] p-3 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.3),inset_0_2px_5px_rgba(255,255,255,0.8)]">
        
        {/* Metallic Luster Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 pointer-events-none rounded-[3rem]"></div>

        {/* Header Sensors */}
        <div className="h-7 flex items-center justify-center gap-3 select-none">
          <div className="w-10 h-1.5 bg-[#BFAF8F]/30 rounded-full shadow-inner"></div>
          <div className="w-2.5 h-2.5 bg-[#BFAF8F]/30 rounded-full shadow-inner"></div>
        </div>

        {/* Inner Content Area (Deep Navy Screen) */}
        <div className="bg-[#1A252F] rounded-[2rem] p-5 sm:p-6 pt-5 flex flex-col h-full border border-black/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
          
          <div className="text-center mb-5">
            <h4 className="text-white text-xl font-bold mb-1 leading-tight tracking-tight">실시간 상담신청</h4>
            <div className="mt-1">
              <p className="text-[#E8DCC4] text-[13px] font-bold tracking-tight leading-tight">
                100% 비밀보장! 빠른상담!<br />
                <span className="text-[#90CAF9] text-[11px] opacity-90">법무사가 직접 답변해 드립니다.</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* System Type Selection */}
                  <div className="flex gap-2 p-1.5 bg-white/5 rounded-xl border border-white/10">
                    {['개인회생', '개인파산'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue('type', t as '개인회생' | '개인파산')}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                          selectedType === t 
                            ? 'bg-[#E8DCC4] text-[#2C3E50] shadow-md' 
                            : 'text-white/30 hover:text-white/60'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-[11px] text-[#E8DCC4] font-bold ml-1 opacity-70">어떤 고민이 있으신가요?</p>
                    <textarea 
                      {...register('content')}
                      rows={3}
                      placeholder="예: 카드값 연체가 걱정됩니다."
                      className="w-full bg-white border border-transparent rounded-xl px-4 py-2.5 text-[15px] text-[#2C3E50] font-bold focus:outline-none focus:ring-2 focus:ring-[#E8DCC4]/70 transition-all resize-none placeholder:text-[#2C3E50]/30 shadow-sm leading-relaxed"
                    />
                  </div>

                  <button 
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-3.5 bg-gradient-to-r from-[#E8DCC4] to-[#BFAF8F] text-[#2C3E50] rounded-xl font-black text-[15px] shadow-xl hover:scale-[1.02] transition-all"
                  >
                    다음 단계로
                  </button>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <div>
                      <input 
                        {...register('name')}
                        type="text" 
                        placeholder="성함 입력"
                        className={`w-full bg-white border ${errors.name ? 'border-red-400' : 'border-transparent'} rounded-xl px-4 py-2.5 text-[15px] text-[#2C3E50] font-bold focus:outline-none focus:ring-2 focus:ring-[#E8DCC4]/70 transition-all placeholder:text-[#2C3E50]/30 shadow-sm`}
                      />
                      {errors.name && <p className="text-[10px] text-red-300 mt-1 ml-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <input 
                        {...register('phone')}
                        type="tel" 
                        maxLength={13}
                        placeholder="연락처 (010-0000-0000)"
                        className={`w-full bg-white border ${errors.phone ? 'border-red-400' : 'border-transparent'} rounded-xl px-4 py-2.5 text-[15px] text-[#2C3E50] font-bold focus:outline-none focus:ring-2 focus:ring-[#E8DCC4]/70 transition-all placeholder:text-[#2C3E50]/30 shadow-sm`}
                      />
                      {errors.phone && <p className="text-[10px] text-red-300 mt-1 ml-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group/agree px-1">
                    <div className="relative flex items-center justify-center shrink-0">
                      <input type="checkbox" className="peer sr-only" defaultChecked required />
                      <div className="w-5 h-5 bg-white/10 border border-white/20 rounded-md peer-checked:bg-[#E8DCC4] peer-checked:border-[#E8DCC4] transition-all"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="#2C3E50" className="absolute w-3 h-3 opacity-0 peer-checked:opacity-100 transition-opacity">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span className="text-[11px] text-white/40 group-hover/agree:text-white/70 transition-colors font-medium">개인정보 수집 및 동의 [확인]</span>
                  </label>

                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 py-3.5 bg-white/5 text-white/60 rounded-xl font-bold text-[14px] border border-white/10 hover:bg-white/10 transition-all"
                    >
                      이전
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] py-3.5 bg-gradient-to-r from-[#E8DCC4] to-[#BFAF8F] text-[#2C3E50] rounded-xl font-black text-[15px] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? '전송 중...' : '상담 신청하기'}
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6 text-center"
                >
                  <div className="w-16 h-16 bg-[#E8DCC4] rounded-full flex items-center justify-center mb-4 shadow-lg shadow-[#E8DCC4]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="#2C3E50" className="w-8 h-8">
                      <motion.path 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M4.5 12.75l6 6 9-13.5" 
                      />
                    </svg>
                  </div>
                  <h4 className="text-white text-lg font-bold mb-2">신청이 완료되었습니다!</h4>
                  <p className="text-white/50 text-xs leading-relaxed">
                    실시간으로 담당 법무사에게<br />
                    데이터가 안전하게 전달되었습니다.<br />
                    잠시 후 연락드리겠습니다.
                  </p>
                  <div className="mt-6 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 3 }}
                      className="h-full bg-[#E8DCC4]"
                    />
                  </div>
                  <p className="text-[10px] text-white/30 mt-2">3초 후 자동으로 창이 닫힙니다.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Bottom Gesture Bar */}
        <div className="h-8 flex flex-col items-center justify-center gap-1.5 opacity-90 mt-1">
          <div className="w-16 h-1.5 bg-[#BFAF8F]/60 rounded-full shadow-inner"></div>
          <p className="text-[10px] text-[#7E6A4B] font-black uppercase tracking-[0.2em] select-none">드래그하여 이동</p>
        </div>

        {/* Close Button Inside Frame */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute -top-3 -right-3 w-9 h-9 bg-gradient-to-br from-[#F3EAD3] to-[#D4CEC1] text-[#2C3E50] rounded-full flex items-center justify-center border border-[#C4B494] shadow-xl hover:brightness-110 transition-all z-[110]"
          title="닫기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
