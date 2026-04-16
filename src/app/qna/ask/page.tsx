'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SubPageBanner from '@/components/SubPageBanner';
import { formatPhone } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const consultFormSchema = z.object({
  name: z.string().min(2, { message: '성함을 입력해주세요.' }),
  phone: z.string().min(10, { message: '정확한 연락처를 입력해주세요.' }),
  type: z.string().min(1, { message: '상담 구분을 선택해주세요.' }),
  content: z.string().min(5, { message: '상담 내용을 입력해주세요.' }),
});

type ConsultFormData = z.infer<typeof consultFormSchema>;

export default function ConsultPage() {
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'request'>('diagnosis');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit: handleConsultSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ConsultFormData>({
    resolver: zodResolver(consultFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      type: '개인회생',
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

  const onConsultSubmit = async (data: ConsultFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'QNA_PAGE_FORM',
          preferredType: data.type
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

  const diagnosisList = [
    { id: 15, title: '서**님의 자가진단 상담신청', name: '서**', status: '접수완료', time: '14:01' },
    { id: 14, title: '이**님의 자가진단 상담신청', name: '이**', status: '상담중', time: '13:45' },
    { id: 13, title: '박**님의 회생 자격 진단', name: '박**', status: '접수완료', time: '12:20' },
    { id: 12, title: '최**님의 파산 가능성 진단', name: '최**', status: '처리완료', time: '11:10' },
    { id: 11, title: '김**님의 상담 요청 건', name: '김**', status: '접수완료', time: '10:30' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sub Banner */}
      <SubPageBanner 
        title="상담하기" 
        subtitle="새로운 시작을 위하여 최선의 서비스를 제공해드리겠습니다."
        backgroundImage="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1600"
      />

      {/* Tab Navigation (Image Inspired) */}
      <div className="w-full border-b border-[var(--border)] sticky top-20 z-40 bg-white">
        <div className="max-w-7xl mx-auto flex h-20">
          <button 
            onClick={() => setActiveTab('diagnosis')}
            className={`flex-1 flex items-center justify-center font-bold text-lg transition-all border-r border-[var(--border)] ${
              activeTab === 'diagnosis' 
                ? 'bg-[var(--background)] text-[var(--secondary)] border-b-4 border-b-[var(--secondary)]' 
                : 'text-[var(--primary)]/40 hover:text-[var(--primary)]'
            }`}
          >
            자가진단
          </button>
          <button 
            onClick={() => setActiveTab('request')}
            className={`flex-1 flex items-center justify-center font-bold text-lg transition-all ${
              activeTab === 'request' 
                ? 'bg-[var(--background)] text-[var(--secondary)] border-b-4 border-b-[var(--secondary)]' 
                : 'text-[var(--primary)]/40 hover:text-[var(--primary)]'
            }`}
          >
            상담신청
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-6 py-20 w-full animate-slide-up">
        {activeTab === 'diagnosis' ? (
          <div>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--primary)] mb-4 font-outfit tracking-tighter">Self-Diagnosis .</h2>
              <div className="w-12 h-1 bg-[var(--secondary)] mx-auto rounded-full"></div>
            </div>

            {/* Diagnosis Status Table (Image Inspired) */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-t-2 border-[var(--primary)]">
                <thead className="bg-[var(--background)] border-b border-[var(--border)] text-[var(--primary)]/60">
                  <tr>
                    <th className="py-5 px-4 font-bold text-center w-24">번호</th>
                    <th className="py-5 px-4 font-bold text-left">제목</th>
                    <th className="py-5 px-4 font-bold text-center w-24">이름</th>
                    <th className="py-5 px-4 font-bold text-center w-24">상태</th>
                    <th className="py-5 px-4 font-bold text-center w-32">날짜</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-[var(--primary)]">
                  {diagnosisList.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--background)]/50 transition-colors">
                      <td className="py-5 px-4 text-center text-gray-400">{item.id}</td>
                      <td className="py-5 px-4 font-medium flex items-center gap-2">
                        {item.title}
                        <span className="inline-block px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded font-bold uppercase scale-90">New</span>
                      </td>
                      <td className="py-5 px-4 text-center">{item.name}</td>
                      <td className="py-5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.status === '접수완료' ? 'bg-[var(--secondary)]/20 text-[var(--secondary)]' :
                          item.status === '상담중' ? 'bg-[var(--accent)]/30 text-[var(--primary)]' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center text-gray-400 font-outfit">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-16 flex justify-center">
              <button className="px-12 py-5 bg-[var(--primary)] text-white rounded-2xl font-bold text-xl shadow-xl hover:shadow-[var(--primary)]/20 hover:-translate-y-1 transition-all">
                자가진단 신청하기 ➔
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[var(--primary)] mb-4 font-outfit tracking-tighter">Consultation Request .</h2>
              <div className="w-12 h-1 bg-[var(--accent)] mx-auto rounded-full"></div>
            </div>
            
            {/* 상담 신청 폼 재활용 및 고도화 */}
            <div className="pastel-card p-12 border-2 border-[var(--accent)]">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-16 text-center"
                  >
                    <div className="w-24 h-24 bg-[var(--accent)]/30 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-8">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <h4 className="text-3xl font-bold text-[var(--primary)] mb-3">상담 신청이 완료되었습니다!</h4>
                    <p className="text-[var(--primary)]/60 text-lg">담당자가 확인 후 즉시 연락드리겠습니다.</p>
                    <button 
                      type="button" 
                      onClick={() => setIsSuccess(false)}
                      className="mt-10 px-8 py-3 bg-[var(--background)] text-[var(--primary)] font-bold rounded-xl hover:bg-[var(--accent)]/20 transition-all border border-[var(--border)]"
                    >
                      추가 상담 신청하기
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleConsultSubmit(onConsultSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-[var(--primary)] ml-1">이름</label>
                        <input 
                          {...register('name')}
                          type="text" 
                          placeholder="성함 입력" 
                          className={`w-full px-5 py-4 bg-[var(--background)] border ${errors.name ? 'border-red-400' : 'border-[var(--border)]'} rounded-2xl focus:border-[var(--secondary)] outline-none transition-all`} 
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-[var(--primary)] ml-1">연락처</label>
                        <input 
                          {...register('phone')}
                          type="tel" 
                          maxLength={13}
                          placeholder="010-0000-0000" 
                          className={`w-full px-5 py-4 bg-[var(--background)] border ${errors.phone ? 'border-red-400' : 'border-[var(--border)]'} rounded-2xl focus:border-[var(--secondary)] outline-none transition-all`} 
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-[var(--primary)] ml-1">상담 구분</label>
                      <div className="flex flex-wrap gap-4">
                        {['개인회생', '개인파산', '상속/증여', '부동산', '기타'].map((type) => (
                          <button 
                            key={type} 
                            type="button" 
                            onClick={() => setValue('type', type, { shouldValidate: true })}
                            className={`px-6 py-3 border rounded-xl text-sm font-bold transition-all ${
                              selectedType === type 
                                ? 'bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-md' 
                                : 'border-[var(--border)] hover:bg-[var(--background)] text-[var(--primary)]/60'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                      <input type="hidden" {...register('type')} />
                      {errors.type && <p className="text-xs text-red-500 mt-1 ml-1">{errors.type.message}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-[var(--primary)] ml-1">상담 내용</label>
                      <textarea 
                        {...register('content')}
                        rows={6} 
                        placeholder="상담받고 싶은 내용을 상세히 적어주세요." 
                        className={`w-full px-5 py-4 bg-[var(--background)] border ${errors.content ? 'border-red-400' : 'border-[var(--border)]'} rounded-2xl focus:border-[var(--secondary)] outline-none transition-all resize-none`}
                      ></textarea>
                      {errors.content && <p className="text-xs text-red-500 mt-1 ml-1">{errors.content.message}</p>}
                    </div>
                    
                    <div className="bg-[var(--background)]/50 p-6 rounded-2xl border border-[var(--border)]">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="qna-agree" required className="mt-1 accent-[var(--secondary)]" />
                        <label htmlFor="qna-agree" className="text-xs text-[var(--primary)]/60 leading-relaxed">
                          개인정보 수집 및 이용에 동의합니다. 입력하신 정보는 원활한 상담 서비스 제공을 위해 최소한의 목적으로만 활용되며 안전하게 보호됩니다.
                        </label>
                      </div>
                    </div>

                    <button 
                      disabled={isSubmitting}
                      className="w-full py-5 bg-[var(--secondary)] text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-[#97af90] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? '전송 중...' : '상담 신청 보내기'}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
