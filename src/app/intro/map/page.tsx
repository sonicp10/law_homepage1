'use client';

import React, { useState } from 'react';

export default function MapPage() {
  const [selectedGuide, setSelectedGuide] = useState<'car' | 'transport' | null>(null);

  const handleCopy = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert('주소가 복사되었습니다.');
      } else {
        // Fallback for non-secure contexts or browsers without Clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
          alert('주소가 복사되었습니다.');
        } catch (err) {
          console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-6">오시는 길</h1>
        <div className="w-12 h-1 bg-[var(--secondary)] mx-auto mb-8 rounded-full"></div>
        <p className="text-lg md:text-xl text-[var(--primary)]/60 font-medium max-w-2xl mx-auto">
          여러분의 발걸음이 무겁지 않도록, 가장 따뜻하고 명확한 길을 안내합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Info Column */}
        <div className="space-y-8 animate-slide-up">
          <div className="bg-white p-10 rounded-[var(--radius-card)] border border-[var(--border)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--primary)] mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-[var(--secondary)] text-white rounded-full flex items-center justify-center shadow-lg">📍</span>
              찾아오시는 주소
            </h2>
            
            <div className="space-y-8">
              <div>
                <p className="text-[var(--primary)] text-2xl md:text-3xl font-black leading-tight mb-4">
                  서울 구로구 경인로 579, <br />
                  502호 <br />
                  <span className="text-[var(--secondary)]">(구로역 2번 출구, 안성빌딩 A동)</span>
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => handleCopy('서울 구로구 경인로 579, 502호(신도림동, 안성빌딩 A동)')}
                    className="px-6 py-3 bg-[var(--secondary)] text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>📋</span> 주소 복사하기
                  </button>
                  <a 
                    href="tel:02-6405-6363" 
                    className="px-6 py-3 bg-white border-2 border-[var(--secondary)] text-[var(--secondary)] rounded-full font-bold hover:bg-[var(--secondary)] hover:text-white transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>📞</span> 실시간 전화 상담
                  </a>
                </div>
              </div>

              <div className="p-6 bg-[var(--warning)] rounded-2xl border border-[var(--warning)]/50">
                <h3 className="text-lg font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
                  <span>✨</span> 방문 전 안심하세요!
                </h3>
                <ul className="space-y-3 font-medium text-[var(--primary)]/80">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✔</span> 철저한 익명 보장 & 비밀 상담
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✔</span> 방문자 전용 무료 주차 완비
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✔</span> 구로역 2번 출구 도보 5분 거리
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-[var(--primary)] p-10 rounded-[var(--radius-card)] text-white shadow-xl">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">⏰</span>
              업무 시간 안내
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white/80">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white/40">주중</p>
                <p className="text-2xl font-black text-white">09:00 - 18:00</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white/40">토요일</p>
                <p className="text-xl font-bold text-white">예약 상담 가능</p>
              </div>
              <div className="col-span-full pt-4 border-t border-white/10">
                <p className="text-sm font-medium">※ 퇴근 후 시간이나 공휴일 상담이 필요하시면 미리 전화주세요.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Column */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="aspect-[4/5] lg:aspect-square w-full bg-slate-100 rounded-[var(--radius-card)] border-4 border-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-100/30 flex items-center justify-center group overflow-hidden">
               {/* Map Filter Effect Overlay */}
               <div className="absolute inset-0 bg-[#2C3E50]/5 pointer-events-none backdrop-grayscale-[0.5] backdrop-contrast-[0.9]"></div>
               
               <div className="text-center z-10 p-8">
                 <div className="text-8xl mb-6 transform group-hover:rotate-12 transition-transform select-none">🏢</div>
                 <h4 className="text-2xl font-black text-[var(--primary)] mb-2">법무사 김형근 사무소</h4>
                 <p className="text-[var(--primary)]/60 font-medium">서울 구로구 경인로 579, 502호 (구로역 2번 출구)</p>
                 <div className="mt-8 flex justify-center gap-4">
                    <a 
                      href="https://map.naver.com/v5/search/서울 구로구 경인로 579" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#03C75A] rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg"
                      title="네이버 지도로 보기"
                    >
                      N
                    </a>
                    <a 
                      href="https://map.kakao.com/link/search/서울 구로구 경인로 579" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#FAE100] rounded-full flex items-center justify-center text-[#3C1E1E] font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg"
                      title="카카오 맵으로 보기"
                    >
                      K
                    </a>
                 </div>
               </div>
               
               {/* Background visual elements representing a map */}
               <div className="absolute top-1/4 left-0 w-full h-[1px] bg-white/20"></div>
               <div className="absolute top-2/4 left-0 w-full h-[1px] bg-white/20"></div>
               <div className="absolute top-0 left-1/3 w-[1px] h-full bg-white/20"></div>
               <div className="absolute top-0 left-2/3 w-[1px] h-full bg-white/20"></div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => setSelectedGuide(selectedGuide === 'car' ? null : 'car')}
              className={`flex-1 py-5 border rounded-2xl font-bold transition-all flex flex-col items-center gap-1 ${
                selectedGuide === 'car' 
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg scale-[1.02]' 
                : 'bg-white border-[var(--border)] text-[var(--primary)] hover:bg-[var(--surface)]'
              }`}
            >
              <span className={`text-xs ${selectedGuide === 'car' ? 'text-white/60' : 'text-[var(--primary)]/40'}`}>자차 이용 시</span>
              <span>무료 주차 안내</span>
            </button>
            <button 
              onClick={() => setSelectedGuide(selectedGuide === 'transport' ? null : 'transport')}
              className={`flex-1 py-5 border rounded-2xl font-bold transition-all flex flex-col items-center gap-1 ${
                selectedGuide === 'transport' 
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg scale-[1.02]' 
                : 'bg-white border-[var(--border)] text-[var(--primary)] hover:bg-[var(--surface)]'
              }`}
            >
              <span className={`text-xs ${selectedGuide === 'transport' ? 'text-white/60' : 'text-[var(--primary)]/40'}`}>대중교통 이용 시</span>
              <span>지하철/버스 안내</span>
            </button>
          </div>

          {/* Guide Content Display */}
          {selectedGuide && (
            <div className="bg-[var(--surface)] p-6 rounded-2xl border border-[var(--border)] animate-fade-in">
              {selectedGuide === 'car' ? (
                <div className="space-y-3">
                  <h5 className="font-bold text-[var(--primary)] flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs">P</span>
                    주차 안내
                  </h5>
                  <p className="text-sm text-[var(--primary)]/80 leading-relaxed">
                    주차장에 무료 주차가 가능합니다.<br/>
                    <span className="font-bold text-[var(--secondary)]">(상담 방문 고객 2시간 무료 주차권 제공)</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h5 className="font-bold text-[var(--primary)] flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">Sub</span>
                    지하철 안내
                  </h5>
                  <p className="text-sm text-[var(--primary)]/80 leading-relaxed">
                    <span className="font-bold text-[var(--primary)]">구로역 하차 2번 출구</span> 광장에서 신도림 방향 e편한세상 아파트쪽으로 도보 5분 거리입니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
