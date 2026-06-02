'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export default function GreetingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const highlightSum = (text: string, isLarge = false) => {
    return (
      <span className={`text-[#A67C52] font-black italic inline-block transform rotate-12 transition-transform hover:scale-110 cursor-default px-1 ${isLarge ? 'text-4xl md:text-6xl mx-2' : ''}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 animate-slide-up"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-6">인사말</h1>
          <div className="w-12 h-1 bg-[var(--secondary)] mx-auto mb-8 rounded-full"></div>
          <div className="text-xl md:text-3xl font-black text-[var(--primary)] leading-tight tracking-tight max-w-4xl mx-auto flex items-center justify-center flex-wrap gap-y-2">
            <span>다시,</span>
            <div className="flex items-center mx-1 h-12 md:h-16">
              <span className="text-[var(--primary)] font-black text-2xl md:text-3xl self-start translate-y-1">“</span>
              {highlightSum('숨', true)}
              <span className="text-[var(--primary)] font-black text-2xl md:text-3xl self-end -translate-y-1">”</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-x-2">
              <span>을 고르고 </span>
              <span>내일을 꿈꿀 수 있도록.</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left: Professional Photo Area */}
          <motion.div 
            className="lg:col-span-5 relative group"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-b-8 border-r-8 border-[#A67C52]/20">
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/40 to-transparent z-10"></div>
              {/* Replace the src with actual path - using placeholder for now */}
              <Image 
                src="/images/lawyer_profile.png" 
                alt="법무사 김형근" 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            </div>
            {/* Decoration */}
            <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full bg-[#A67C52]/5 rounded-2xl"></div>
          </motion.div>

          {/* Right: Greetings Content */}
          <motion.div 
            className="lg:col-span-7 space-y-12"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} className="relative">
              <span className="absolute -top-48 -left-12 text-[250px] text-[#A67C52]/15 font-serif leading-none select-none pointer-events-none">,</span>
              <p className="text-xl md:text-2xl font-bold text-[var(--primary)] leading-relaxed relative z-10">
                안녕하십니까,<br />
                법무사 김형근 사무소입니다.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="space-y-8 text-lg md:text-[1.15rem] text-[var(--primary)]/80 leading-loose font-medium text-justify">
              <p>
                감당하기 힘든 빚이라는 굴레는 단순히 경제적 어려움을 넘어, 일상의 평온과 <span className="text-[var(--primary)] font-bold">편히 {highlightSum('‘숨’')} 쉴 자유</span>마저 앗아가곤 합니다. 턱 끝까지 차오른 고통에 홀로 힘겨워하고 계신 여러분께, 저희 사무소는 다시 편안하게 {highlightSum('‘숨’')} 쉴 수 있는 쉼표가 되어드리고자 합니다.
              </p>
              <p>
                개인회생과 파산은 끝이 아닙니다. 막혔던 호흡을 가다듬고 인생의 다음 페이지를 준비하는 새로운 시작입니다. 저희는 단순한 법률 대리인을 넘어, 여러분이 무거운 짐을 내려놓고 다시 웃으며 일상을 마주할 수 있도록 <span className="text-[#A67C52] font-extrabold border-b-2 border-[#A67C52]/20 pb-0.5">따뜻한 햇살 같은 길잡이</span>가 되겠습니다.
              </p>
              <p>
                이제 혼자 고민하지 마십시오. 여러분의 인생 2막, 그 첫 호흡을 법무사 김형근 사무소가 진심을 다해 응원하고 함께하겠습니다.
              </p>
            </motion.div>

            {/* Signature Area */}
            <motion.div 
              variants={fadeInUp} 
              className="pt-12 border-t border-[#A67C52]/10 flex flex-col items-end"
            >
              <div className="text-right">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl text-[var(--primary)]/60 font-medium italic">진심을 다해,</span>
                  <div 
                    key="signature-v2" 
                    className="flex items-end gap-3 translate-y-2 text-[var(--primary)]" 
                    style={{ fontFamily: "'Nanum Brush Script', cursive" }}
                  >
                    <p className="text-[28px] md:text-[44px] leading-none mb-2 md:mb-3 opacity-90">법무사</p>
                    <p className="text-[60px] md:text-[100px] leading-none origin-bottom-right translate-y-2 md:translate-y-4 font-black" style={{ letterSpacing: '0.05em', textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)' }}>
                      김&nbsp;형&nbsp;근
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
  );
}
