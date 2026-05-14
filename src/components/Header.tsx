'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 페이지 이동 시 모바일 메뉴 닫기
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuData = [
    {
      title: '회사소개',
      href: '/intro',
      subMenus: [
        { name: '인사말', href: '/intro/greeting' },
        { name: '업무분야', href: '/intro/business' },
        { name: '오시는 길', href: '/intro/map' },
      ],
    },
    {
      title: '개인회생',
      href: '/rehab',
      subMenus: [
        { name: '개인회생절차', href: '/rehab/step' },
        { name: '자주묻는 질문', href: '/rehab/ask' },
        { name: 'About 개인회생', href: '/rehab/posts' },
      ],
    },
    {
      title: '개인파산',
      href: '/bankruptcy',
      subMenus: [
        { name: '개인파산절차', href: '/bankruptcy/step' },
        { name: '자주묻는 질문', href: '/bankruptcy/ask' },
        { name: 'About 개인파산', href: '/bankruptcy/posts' },
      ],
    },
    {
      title: '성공사례',
      href: '/s_story',
      subMenus: [
        { name: '개인회생', href: '/s_story/rehab' },
        { name: '개인파산', href: '/s_story/bankruptcy' },
        { name: '의뢰인 후기', href: '/s_story/review' },
      ],
    },
    {
      title: '상담문의',
      href: '/qna/phone',
      subMenus: [
        { name: '실시간 전화 상담', href: '/qna/phone' },
        { name: '방문 상담', href: '/qna/visit' },
        { name: '게시판 상담', href: '/qna/board' },
        { name: '1분 자가진단', href: '/qna/diagnosis' },
      ],
    },
  ];

  return (
    <>
      {/* Top Banner Bar - Static (Scrolls away) */}
      <div className="bg-[#D4CEC1] border-b border-[#C4BCB1] relative z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-10 md:h-12 flex items-center justify-between md:justify-start relative">
          {/* Left: Phone Number */}
          <div className="flex items-center gap-2 text-[#2C3E50] font-bold text-[12px] md:text-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 md:w-4 h-4 opacity-70">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <a href="tel:02-6405-6363" className="whitespace-nowrap hover:underline">상담문의 02-6405-6363</a>
          </div>

          {/* Center: Office Name & Service Center Info (Desktop Only) */}
          <div className="absolute left-1/2 -translate-x-1/2 text-[#2C3E50] font-bold text-[14px] md:text-[17px] whitespace-nowrap hidden lg:block">
            <span className="text-[#A67C52] border-b-2 border-[#A67C52]/30 pb-0.5">개인회생/개인파산</span> 상담센터 법무사 김형근 사무소
          </div>
          
          {/* Mobile Only Logo Text */}
          <div className="lg:hidden text-[11px] font-bold text-[#2C3E50]/60">
            All About 회생파산
          </div>
        </div>
      </div>

      {/* Main Header Section - Sticky (Follows scroll) */}
      <div 
        className="sticky top-0 left-0 right-0 z-50 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <header className="bg-white/95 backdrop-blur-md border-b border-[var(--border)] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 md:gap-4 group/logo">
                <div className="relative">
                  <div className="w-9 h-9 md:w-12 md:h-12 bg-[#A67C52]/10 rounded-lg md:rounded-xl flex items-center justify-center transition-all group-hover/logo:bg-[#A67C52]/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 md:w-7 h-7 text-[#A67C52]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0018 3.75c-1.052 0-2.062.18-3 .512v14.25z" />
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-2xl font-bold tracking-tight text-[var(--primary)] leading-none mb-0.5 md:mb-1">
                    법무사 <span className="text-[#A67C52] font-extrabold">김형근</span> <span className="hidden xs:inline">사무소</span>
                  </span>
                  <span className="text-[9px] md:text-[11px] text-[var(--primary)]/60 font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase">Private Rehabilitation</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Fixed Width Columns for Alignment */}
            <nav className="hidden lg:flex items-center justify-center flex-1 ml-12">
              <div className="flex items-center gap-12 xl:gap-20">
                {menuData.map((menu) => (
                  <div key={menu.title} className="w-[100px] xl:w-[120px] flex justify-center relative group/link">
                    <Link 
                      href={menu.href} 
                      className="text-[16px] xl:text-[17px] font-bold text-[var(--primary)]/70 hover:text-[#A67C52] transition-colors h-24 flex items-center whitespace-nowrap"
                    >
                      {menu.title}
                    </Link>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A67C52] transition-all group-hover/link:w-full"></span>
                  </div>
                ))}
              </div>
            </nav>

            {/* Balanced spacer to match Logo section width for centering */}
            <div className="hidden lg:block flex-shrink-0 w-[280px]" />

            {/* Mobile Menu Button - Restore */}
            <button 
              className="lg:hidden p-2 text-[var(--primary)]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="메뉴 열기"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </header>

        {/* Desktop Mega Menu Dropdown */}
        <div 
          className={`hidden lg:block absolute top-full left-0 right-0 bg-[#F1F2F4] border-b border-[var(--border)] shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
            isHovered ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-12 flex items-start">
            <div className="w-[280px] shrink-0 pr-10 ml-16">
              <div className="space-y-1 mb-4">
                <p className="text-[16px] font-bold text-[var(--primary)]">답답한 고민을 멈추고</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[32px] font-black text-[#A67C52]">숨</span>
                  <p className="text-[20px] font-extrabold text-[var(--primary)]">쉴 수 있는 공간</p>
                </div>
                <p className="text-[18px] font-black text-[var(--primary)]">법무사 <span className="text-[#A67C52]">김형근</span> 사무소</p>
              </div>
            </div>

            <div className="flex-1 flex justify-center pt-2">
              <div className="flex items-start gap-12 xl:gap-20">
                {menuData.map((menu) => (
                  <div key={menu.title} className="w-[100px] xl:w-[120px] flex flex-col gap-4 shrink-0">
                    {menu.subMenus.map((sub) => (
                      <Link 
                        key={sub.name}
                        href={sub.href}
                        className="text-[15px] font-medium text-[var(--primary)]/85 hover:text-[#A67C52] hover:translate-x-1 transition-all"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mirroring Spacer */}
            <div className="w-[280px] shrink-0 invisible" />
          </div>
        </div>

        {/* Mobile Menu Sidebar */}
        <div 
          className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ${
            isMobileMenuOpen ? 'visible' : 'invisible'
          }`}
        >
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div 
            className={`absolute top-0 right-0 bottom-0 w-[80%] max-w-[300px] bg-white transition-transform duration-300 ease-out shadow-2xl flex flex-col ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-[var(--primary)]">전체 메뉴</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {menuData.map((menu) => (
                <div key={menu.title} className="mb-8">
                  <h3 className="text-lg font-bold text-[#A67C52] mb-3">{menu.title}</h3>
                  <div className="grid grid-cols-1 gap-3 pl-2">
                    {menu.subMenus.map((sub) => (
                      <Link 
                        key={sub.name}
                        href={sub.href}
                        className="text-[15px] font-semibold text-[var(--primary)]/80 py-1"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <a 
                href="tel:02-6405-6363" 
                className="w-full py-4 bg-[var(--primary)] text-white rounded-xl font-bold flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                전화 상담 연결
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
