'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface BoardItem {
  id: string;
  author: string;
  title: string;
  status: string;
  createdAt: string;
}

export default function BoardQnaPage() {
  const [questions, setQuestions] = useState<BoardItem[]>([]);

  useEffect(() => {
    fetch('/api/board-qna')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em] mb-2 block">온라인 상담 게시판</span>
          <h2 className="text-4xl font-black text-[#2C3E50]">게시판 상담</h2>
        </div>
        
        <Link 
          href="/qna/board/write" 
          className="flex items-center gap-3 px-10 py-5 bg-[#B89E6E] text-white rounded-xl font-bold text-lg shadow-xl hover:bg-[#A67C52] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          상담 글쓰기
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-10 py-6 text-sm font-bold text-gray-500 w-20">번호</th>
              <th className="px-6 py-6 text-sm font-bold text-gray-500">상담 제목</th>
              <th className="px-6 py-6 text-sm font-bold text-gray-500 w-32">작성자</th>
              <th className="px-6 py-6 text-sm font-bold text-gray-500 w-32">상태</th>
              <th className="px-10 py-6 text-sm font-bold text-gray-500 w-40">날짜</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {questions.length > 0 ? (
              questions.map((q, idx) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                  <td className="px-10 py-6 text-sm text-gray-400 font-medium">{questions.length - idx}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 8.25v-3a3.75 3.75 0 1 1 7.5 0v3H8.25Z" clipRule="evenodd" />
                      </svg>
                      <span className="text-base font-bold text-[#2C3E50] group-hover:text-[#A67C52] transition-colors">{q.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-gray-600 font-semibold">{q.author[0]}*</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight ${
                      q.status === 'PENDING' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                    }`}>
                      {q.status === 'PENDING' ? '답변대기' : '답변완료'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-sm text-gray-400 font-medium">{new Date(q.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-10 py-32 text-center text-gray-300 font-medium">아직 등록된 상담글이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
