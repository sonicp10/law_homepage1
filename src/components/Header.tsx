'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);

  const menuData = [
    {
      title: '회사소개',
      href: '/intro',
      subMenus: [
        { name: '인사말', href: '/intro/greeting' },
        { name: '사업분야', href: '/intro/business' },
        { name: '오시는 길', href: '/intro/map' },
      ],
    },
    {
      title: '개인회생',
      href: '/rehab',
      subMenus: [
        { name: '개인회생절차', href: '/rehab/step' },
        { name: '자주묻는 질문', href: '/rehab/ask' },
        { name: '개인회생 FAQ', href: '/rehab/strong' },
        { name: '법률 정보', href: '/rehab/posts' },
      ],
    },
    {
      title: '개인파산',
      href: '/bankruptcy',
      subMenus: [
        { name: '개인파산절차', href: '/bankruptcy/step' },
        { name: '자주묻는 질문', href: '/bankruptcy/ask' },
        { name: '개인파산 FAQ', href: '/bankruptcy/strong' },
        { name: '법률정보', href: '/bankruptcy/posts' },
      ],
    },
    {
      title: '성공사례',
      href: '/s_story',
      subMenus: [
        { name: '전체보기', href: '/s_story' },
        { name: '개인회생 사례', href: '/s_story' },
        { name: '개인파산 사례', href: '/s_story' },
      ],
    },
    {
      title: '상담문의',
      href: '/qna',
      subMenus: [
        { name: '1:1 상담신청', href: '/qna/ask' },
        { name: '3분 자가진단', href: '/qna/diagnosis' },
      ],
    },
  ];

  return (
    <>
      {/* Top Banner Bar - Static (Scrolls away) */}
      <div className="bg-[#D4CEC1] border-b border-[#C4BCB1] relative z-40">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center relative">
          {/* Left: Phone Number */}
          <div className="flex items-center gap-2 text-[#2C3E50] font-bold text-[13px] md:text-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 opacity-70">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="whitespace-nowrap">상담문의 02-6405-6363</span>
          </div>

          {/* Center: Office Name & Service Center Info */}
          <div className="absolute left-1/2 -translate-x-1/2 text-[#2C3E50] font-bold text-[14px] md:text-[17px] whitespace-nowrap hidden sm:block">
            <span className="text-[#A67C52] border-b-2 border-[#A67C52]/30 pb-0.5">개인회생/개인파산</span> 상담센터 법무사 김형근 사무소
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
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center">
            {/* Logo Section - Fixed Width for Alignment */}
            <div className="w-[320px] shrink-0">
              <Link href="/" className="flex items-center gap-4 group/logo">
                <div className="relative">
                  <div className="w-12 h-12 bg-[#A67C52]/10 rounded-xl flex items-center justify-center transition-all group-hover/logo:bg-[#A67C52]/20 rotate-3 group-hover/logo:rotate-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-7 h-7 text-[#A67C52]">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0112 6.042m0 12.084a8.967 8.967 0 006-3.75c1.052 0 2.062.18 3 .512v-14.25A8.987 8.987 0 0018 3.75c-1.052 0-2.062.18-3 .512v14.25z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-[var(--secondary)]/10 rounded-2xl blur-md opacity-0 group-hover/logo:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold tracking-tight text-[var(--primary)] leading-none mb-1">법무사 <span className="text-[#A67C52] font-extrabold">김형근</span> 사무소</span>
                  <div className="flex items-center gap-2">
                    <span className="h-[1px] w-4 bg-[#A67C52]"></span>
                    <span className="text-[11px] text-[var(--primary)]/60 font-bold tracking-[0.3em] uppercase">All About 회생파산</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation - Wide Gap for Visual Clarity */}
            <nav className="flex-1 flex justify-center gap-24">
              {menuData.map((menu) => (
                <div key={menu.title} className="w-[100px] flex justify-center">
                  <Link 
                    href={menu.href} 
                    className="text-[17px] font-bold text-[var(--primary)]/70 hover:text-[#A67C52] transition-colors h-24 flex items-center relative group/link whitespace-nowrap"
                  >
                    {menu.title}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#A67C52] transition-all group-hover/link:w-full"></span>
                  </Link>
                </div>
              ))}
            </nav>

            {/* Removed CTA Button as per request */}
            <div className="w-[320px] shrink-0" /> {/* Balanced spacer to match Logo section width for centering */}
          </div>
        </header>

        {/* Mega Menu Dropdown */}
        <div 
          className={`absolute top-full left-0 right-0 bg-[#F1F2F4] border-b border-[var(--border)] shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${
            isHovered ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-10 flex items-start">
            {/* Mirroring Logo Spacer */}
            <div className="w-[320px] shrink-0 invisible" />

            {/* Submenu Columns - Perfectly Sync-Aligned */}
            <div className="flex-1 flex justify-center gap-24">
              {menuData.map((menu, index) => (
                <div key={menu.title} className="w-[100px] flex shrink-0 relative">
                  {/* Vertical Divider (Before each except first) */}
                  {index !== 0 && <div className="w-[1px] h-32 bg-gray-300/40 mt-1 absolute -translate-x-[48px]"></div>}
                  
                  <div className="flex flex-col gap-4 w-full">
                    {menu.subMenus.map((sub) => (
                      <Link 
                        key={sub.name}
                        href={sub.href}
                        className="text-[15px] font-medium text-[var(--primary)]/60 hover:text-[#A67C52] hover:translate-x-1 transition-all whitespace-nowrap"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mirroring CTA Spacer (Adjusted for symmetry) */}
            <div className="w-[320px] shrink-0 invisible" />
          </div>
        </div>
      </div>
    </>
  );
}
