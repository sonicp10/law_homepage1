'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Wallet, 
  Gavel, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ClipboardCheck,
  Lightbulb
} from 'lucide-react';

const StepCard = ({ 
  title, 
  subTitle, 
  index, 
  children, 
  icon: Icon 
}: { 
  title: string; 
  subTitle: string;
  index: string; 
  children: React.ReactNode; 
  icon: any 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="relative mb-16 md:mb-24 group"
  >
    {/* Background accent */}
    <div className="absolute -left-4 -top-4 w-24 h-24 bg-[var(--secondary)]/10 rounded-full -z-10 group-hover:scale-110 transition-transform duration-500 blur-xl"></div>

    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Number and Line */}
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-xl shadow-[var(--primary)]/20 group-hover:rotate-6 transition-transform relative z-20">
          {index}
        </div>
        <div className="hidden md:block w-[2px] h-full min-h-[120px] bg-gradient-to-b from-[var(--primary)]/20 to-transparent mt-4"></div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white p-8 md:p-10 rounded-[var(--radius-card)] border border-[var(--border)] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-xl">
              <Icon size={24} />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--secondary)] uppercase tracking-wider">{subTitle}</span>
              <h3 className="text-xl md:text-2xl font-black text-[var(--primary)] tracking-tight">
                {title}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 text-[var(--primary)]/80 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

const HighlightBox = ({ children, title = "💡 전문가 가이드", type = "info" }: { children: React.ReactNode; title?: string; type?: "info" | "warning" }) => (
  <div className={`mt-6 p-6 rounded-2xl border-l-4 ${type === 'warning' ? 'bg-amber-50 border-amber-400' : 'bg-[var(--secondary)]/5 border-[var(--secondary)]'}`}>
    <h4 className={`text-[15px] font-black mb-2 flex items-center gap-2 ${type === 'warning' ? 'text-amber-800' : 'text-[var(--secondary)]'}`}>
      <span>{title}</span>
    </h4>
    <div className={`text-[15px] ${type === 'warning' ? 'text-amber-900/80' : 'text-[var(--primary)]/70'}`}>
      {children}
    </div>
  </div>
);

export default function BankruptcyStepPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 pb-20">
      {/* Header Section */}
      <div className="text-center mb-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-black text-[var(--primary)] mb-8 tracking-tight">
            개인파산 및 면책 절차 안내
          </h2>
          <div className="w-16 h-1.5 bg-[var(--secondary)] mx-auto mb-10 rounded-full"></div>
          <p className="text-lg md:text-xl text-[var(--primary)]/60 font-medium max-w-3xl mx-auto leading-relaxed">
            채무자가 지급불능 상태일 때 신청하며, 본격적인 조사를 통해 <br className="hidden md:block" />
            최종적인 빚 탕감과 경제적 복권을 목표로 합니다.
          </p>
        </motion.div>
      </div>

      {/* Flowchart Section */}
      <div className="relative mb-32">
        <StepCard 
          index="01" 
          title="파산·면책 신청서 접수" 
          subTitle="법원 제출"
          icon={FileText}
        >
          <p>채무자는 주소지 관할 회생법원에 신청서를 제출합니다. 실무적으로 파산 신청과 면책 신청을 한꺼번에 처리하는 '동시 신청'이 일반적입니다.</p>
          <HighlightBox>
            별도의 의사가 없으면 면책 신청을 한 것으로 간주하여 절차가 진행됩니다.
          </HighlightBox>
        </StepCard>

        <StepCard 
          index="02" 
          title="법원의 서면 심사 및 보정명령" 
          subTitle="서류 미비 시 보완"
          icon={Search}
        >
          <p>법원은 제출된 서류를 통해 파산 원인이 있는지 정밀하게 검토합니다. 서류가 미비하거나 추가 증명이 필요한 경우 보정명령을 통해 보완을 요구합니다.</p>
        </StepCard>

        <StepCard 
          index="03" 
          title="예납명령" 
          subTitle="절차 비용 납부"
          icon={Wallet}
        >
          <p>법원은 파산 절차에 필요한 비용(공고비, 관재인 보수 등)을 미리 내라는 예납명령을 내립니다. 이 비용을 기한 내에 납부해야 다음 단계로 진행됩니다.</p>
        </StepCard>

        <StepCard 
          index="04" 
          title="파산 선고 및 파산관재인 선임" 
          subTitle="본격적인 조사 시작"
          icon={Gavel}
        >
          <p>비용이 납부되면 법원은 파산 선고를 하고, 채무자의 재산을 공정하게 관리·조사할 파산관재인을 선임합니다. 이때부터 본격적인 조사가 시작됩니다.</p>
        </StepCard>

        <StepCard 
          index="05" 
          title="파산관재인의 재산 조사 및 면담" 
          subTitle="재산 및 면책 사유 조사"
          icon={Search}
        >
          <p>선임된 파산관재인은 채무자와 면담을 진행하여 재산 상태, 소득, 면책불허가 사유(재산 은닉, 낭비 등)가 있는지 정밀 조사합니다.</p>
          <HighlightBox type="warning" title="🚨 주의사항">
            채무자는 관재인의 자료 제출 요구에 성실히 응해야 합니다. 허위 소명 시 면책이 불허가될 수 있습니다.
          </HighlightBox>
        </StepCard>

        <StepCard 
          index="06" 
          title="채권자집회 및 채권조사" 
          subTitle="의견 청취"
          icon={Users}
        >
          <p>법원은 채권자들에게 조사 결과를 보고하고, 채무자의 면책에 대한 채권자들의 의견을 듣는 자리를 마련합니다. 특별한 이의가 없으면 신속하게 마무리됩니다.</p>
        </StepCard>

        <StepCard 
          index="07" 
          title="환가 및 배당 / 절차 폐지" 
          subTitle="재산 처분 해당 시"
          icon={RefreshCw}
        >
          <p>배당할 만한 재산이 있다면 현금화(환가)하여 채권자들에게 나누어 줍니다. 배당할 재산이 없는 대다수의 사건은 이 과정을 생략하고 바로 절차를 종료(폐지)합니다.</p>
        </StepCard>

        <StepCard 
          index="08" 
          title="면책 결정" 
          subTitle="최종 빚 탕감 및 복권"
          icon={CheckCircle2}
        >
          <p>조사가 끝나면 법원은 최종적으로 면책 허가 여부를 결정합니다. 면책이 확정되면 남은 빚을 갚을 책임에서 완전히 벗어나며, 각종 법적 제약도 회복(복권)됩니다.</p>
        </StepCard>
      </div>

      {/* Documents Section */}
      <div className="mb-32">
        <div className="bg-[var(--surface)] rounded-[var(--radius-card)] p-10 border border-[var(--border)]">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-[var(--primary)] text-white rounded-xl">
              <ClipboardCheck size={28} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-[var(--primary)]">신청 시 준비 서류 체크리스트</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-lg font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[var(--secondary)] rounded-full"></span>
                필수 기재 사항
              </h4>
              <ul className="space-y-4">
                {['성명', '주민등록번호', '주소', '신청 취지 및 원인'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[var(--primary)]/70 font-medium">
                    <span className="text-[var(--secondary)]">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[var(--primary)] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[var(--secondary)] rounded-full"></span>
                첨부 필요 서류
              </h4>
              <ul className="space-y-4">
                {[
                  { title: '채권자 목록', desc: '빚을 갚아야 할 곳들의 명단' },
                  { title: '재산 목록', desc: '현재 보유 중인 모든 재산 내역' },
                  { title: '수입 및 지출에 관한 목록', desc: '현재 소득 상황 증빙' },
                  { title: '진술서', desc: '파산에 이르게 된 경위 및 생활 실태' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-[var(--secondary)] mt-1">✓</span>
                    <div>
                      <p className="font-bold text-[var(--primary)]">{item.title}</p>
                      <p className="text-sm text-[var(--primary)]/50">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="p-8 bg-white border-2 border-[var(--secondary)]/20 rounded-[var(--radius-card)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-[var(--secondary)]">
            <Lightbulb size={24} />
            <h4 className="text-xl font-bold">면제재산 신청 Tip</h4>
          </div>
          <p className="text-[var(--primary)]/70 leading-relaxed">
            파산 선고 후에도 채무자의 주거 안정을 위한 <span className="text-[var(--primary)] font-bold">일정액의 임차보증금이나 6개월간의 생활비</span> 등은 재산 처분 대상에서 제외받을 수 있도록 신청할 수 있습니다. 적극적인 권리 행사가 필요합니다.
          </p>
        </div>
        <div className="p-8 bg-white border-2 border-amber-100 rounded-[var(--radius-card)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-amber-500">
            <AlertCircle size={24} />
            <h4 className="text-xl font-bold">성실한 소명의 중요성</h4>
          </div>
          <p className="text-[var(--primary)]/70 leading-relaxed">
            재산을 숨기거나 허위로 서류를 제출할 경우 면책이 불허가될 수 있으므로 주의해야 합니다. 모든 절차에서 법원과 관재인에게 <span className="text-[var(--primary)] font-bold">최대한 투명하고 성실하게 자료를 제출</span>하는 것이 가장 빠른 면책의 길입니다.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-12 bg-[var(--primary)] rounded-[var(--radius-card)] text-white text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-black mb-6">성공적인 경제적 재기, 지금 시작하세요.</h3>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto font-medium">
            개인파산은 단순한 빚 탕감이 아닌, 새로운 시작을 위한 법적 권리입니다.<br />
            수많은 성공 사례를 보유한 김형근 사무소가 당신의 평범한 일상을 되찾아 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-10 py-4 bg-[var(--secondary)] text-[var(--primary)] font-black rounded-full hover:scale-105 transition-all shadow-lg">
              무료 파산 진단 신청
            </button>
            <button className="px-10 py-4 bg-white/10 text-white font-black rounded-full border border-white/20 hover:bg-white/20 transition-all">
              전화 바로 상담하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
