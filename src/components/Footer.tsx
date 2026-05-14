import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] overflow-hidden">
      {/* Upper Section: White Background, Black Text */}
      <div className="bg-white pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Top Row: Logo & SNS Icons */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-10">
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-[#A67C52]/10 rounded-xl flex items-center justify-center transition-all group-hover:bg-[#A67C52]/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-6 h-6 text-[#A67C52]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0018 3.75c-1.052 0-2.062.18-3 .512v14.25z" />
                </svg>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold tracking-tight leading-none mb-1 text-black">법무사 <span className="text-[#A67C52]">김형근</span> 사무소</span>
                <span className="text-[11px] text-black/50 font-bold tracking-[0.3em] uppercase">All About 회생파산</span>
              </div>
            </Link>

            {/* SNS Icons */}
            <div className="flex items-center gap-4">
              <a href="https://blog.naver.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#A67C52] transition-all shadow-md group/sns" title="Naver Blog">
                <span className="text-white font-black pointer-events-none text-xs">N</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#A67C52] transition-all shadow-md group/sns" title="YouTube">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186c-.28-.105-2.28-.105-2.28-.105-1.29-.105-2.58-.105-3.87-.105H6.652c-1.29 0-2.58 0-3.87.105 0 0-2 .105-2.28.105C.28 6.291 0 8.01 0 12s.28 5.709.502 5.814c.28.105 2.28.105 2.28.105 1.29.105 2.58.105 3.87.105H17.348c1.29 0 2.58 0 3.87-.105 0 0 2-.105 2.28-.105.222-.105.502-1.824.502-5.814s-.28-5.709-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#2C3E50] rounded-full flex items-center justify-center hover:bg-[#A67C52] transition-all shadow-md group/sns" title="Instagram">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.688.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Thin Horizontal Divider */}
          <div className="w-full h-[1px] bg-black/10 mb-10"></div>

          {/* Bottom Row: Detailed Info & Call Info */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Content (상세 사업자 정보) */}
            <div className="md:col-span-8 flex flex-col items-center md:items-start text-center md:text-left text-black/70 font-bold text-[14px] md:text-[15px]">
              <div className="flex flex-col gap-3 md:gap-4">
                {/* Biz Row 1 */}
                <div className="flex flex-col md:flex-row items-center gap-x-4 gap-y-1">
                  <span><b>상호명 :</b> 법무사 김형근 사무소</span>
                  <span className="hidden md:block w-[1px] h-3 bg-black/10"></span>
                  <span><b>대표 :</b> 법무사 김형근</span>
                  <span className="hidden md:block w-[1px] h-3 bg-black/10"></span>
                  <span><b>사업자등록번호 :</b> 000-00-00000</span>
                </div>
                {/* Biz Row 2 */}
                <div className="flex flex-col md:flex-row items-center gap-x-4 gap-y-1">
                  <span><b>주소 :</b> 서울 구로구 경인로 579, 502호(신도림동, 안성빌딩 A동)</span>
                </div>
                {/* Biz Row 3 */}
                <div className="flex flex-col md:flex-row items-center gap-x-4 gap-y-1">
                  <span><b>대표전화 :</b> 02-6405-6363</span>
                  <span className="hidden md:block w-[1px] h-3 bg-black/10"></span>
                  <span><b>팩스 :</b> 0505-070-9170</span>
                  <span className="hidden md:block w-[1px] h-3 bg-black/10"></span>
                  <span><b>이메일 :</b> sonicp@naver.com</span>
                </div>
              </div>
            </div>

            {/* Right Content (연락처 및 정책) */}
            <div className="md:col-span-4 flex flex-col items-center md:items-end gap-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-[16px] md:text-[18px] text-[#2C3E50]/40 font-bold hover:text-[#A67C52] transition-colors">
                개인정보처리방침
              </Link>
              <div className="text-[24px] md:text-[28px] font-black text-black leading-none">
                02-6405-6363
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lower Section: Copyright (Warm Beige Background) */}
      <div className="bg-[#D4CEC1] py-6 md:py-8 border-t border-[#C4BCB1]">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          <p className="text-[11px] md:text-[13px] text-[#2C3E50]/60 font-bold tracking-widest uppercase leading-relaxed">
            Ⓒ2012 법무사 김형근 사무소. 모든 권리 저작권 보호 및 무단 전재 및 재배포 금지.
          </p>
        </div>
      </div>
    </footer>
  );
}
