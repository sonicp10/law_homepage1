'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  label: string;
  href: string;
}

interface TabNavigationProps {
  tabs: Tab[];
}

export default function TabNavigation({ tabs }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white border-b border-[var(--border)] sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-start md:justify-center overflow-x-auto hide-scrollbar -mb-px" style={{ overflowX: 'auto', whiteSpace: 'nowrap', flexWrap: 'nowrap' }}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative group transition-all ${
                  isActive 
                    ? 'text-[var(--primary)]' 
                    : 'text-[var(--primary)]/40 hover:text-[var(--primary)]/70'
                }`}
                style={{ flexShrink: 0, padding: '1.25rem 1.5rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
              >
                <span style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', minWidth: 'max-content' }} className="text-[15px] md:text-base font-bold">
                  {tab.label}
                </span>
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--primary)] animate-in fade-in slide-in-from-bottom-1 duration-300"></div>
                )}
                {/* Hover Indicator Bar */}
                {!isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-[var(--primary)]/20 transition-all group-hover:w-full"></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
