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

interface DetailItem {
  id: string;
  title: string;
  author: string;
  content: string;
  replyContent?: string | null;
  status: string;
  createdAt: string;
}

export default function BoardQnaPage() {
  const [questions, setQuestions] = useState<BoardItem[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<BoardItem | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);

  useEffect(() => {
    fetch('/api/board-qna')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.items)) {
          setQuestions(data.items);
        } else if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          setQuestions([]);
        }
      })
      .catch(() => setQuestions([]));
  }, []);

  const handleRowClick = (q: BoardItem) => {
    setSelectedQuestion(q);
    setInputPassword('');
    setPasswordError('');
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !inputPassword) return;

    setVerifying(true);
    setPasswordError('');

    try {
      const res = await fetch('/api/board-qna/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedQuestion.id,
          password: inputPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDetailItem(data.item);
        setSelectedQuestion(null);
        setInputPassword('');
      } else {
        setPasswordError(data.error || '비밀번호가 일치하지 않습니다.');
      }
    } catch {
      setPasswordError('서버 연결 중 오류가 발생했습니다.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em] mb-2 block">온라인 상담 게시판</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50] break-keep">게시판 상담</h2>
        </div>
        
        <Link 
          href="/qna/board/write" 
          className="flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-[#B89E6E] text-white rounded-xl font-bold text-lg shadow-xl hover:bg-[#A67C52] transition-all whitespace-nowrap flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          상담 글쓰기
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 whitespace-nowrap">
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-sm font-bold text-gray-500 w-16 sm:w-20">번호</th>
                <th className="px-3 sm:px-6 py-4 sm:py-6 text-sm font-bold text-gray-500">상담 제목</th>
                <th className="px-3 sm:px-6 py-4 sm:py-6 text-sm font-bold text-gray-500 w-24 sm:w-32">작성자</th>
                <th className="px-3 sm:px-6 py-4 sm:py-6 text-sm font-bold text-gray-500 w-24 sm:w-32">상태</th>
                <th className="px-4 sm:px-10 py-4 sm:py-6 text-sm font-bold text-gray-500 w-24 sm:w-40">날짜</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {questions.length > 0 ? (
                questions.map((q, idx) => (
                  <tr 
                    key={q.id} 
                    onClick={() => handleRowClick(q)}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 sm:px-10 py-4 sm:py-6 text-sm text-gray-400 font-medium whitespace-nowrap">{questions.length - idx}</td>
                    <td className="px-3 sm:px-6 py-4 sm:py-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-300 flex-shrink-0">
                          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 8.25v-3a3.75 3.75 0 1 1 7.5 0v3H8.25Z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm sm:text-base font-bold text-[#2C3E50] group-hover:text-[#A67C52] transition-colors line-clamp-2 break-keep">{q.title}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 sm:py-6 text-xs sm:text-sm text-gray-600 font-semibold whitespace-nowrap">{q.author[0]}*</td>
                    <td className="px-3 sm:px-6 py-4 sm:py-6 whitespace-nowrap">
                      <span className={`px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-tight ${
                        q.status === 'PENDING' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                      }`}>
                        {q.status === 'PENDING' ? '답변대기' : '답변완료'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-10 py-4 sm:py-6 text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">{new Date(q.createdAt).toLocaleDateString()}</td>
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

      {/* 비밀번호 확인 모달 */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-bold text-[#2C3E50]">비밀글 확인</h3>
              <button 
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="text-gray-400 hover:text-gray-600 p-1 leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-500">
              작성 시 설정한 비밀번호를 입력해 주세요.
            </p>

            <form onSubmit={handleVerifyPassword} className="space-y-3">
              <div>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="비밀번호"
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
                {passwordError && (
                  <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex-1 py-2.5 bg-[#A67C52] text-white rounded-xl text-xs font-bold hover:bg-[#8e6842] transition-colors"
                >
                  {verifying ? '확인 중...' : '확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 상담 상세 및 답변 열람 모달 */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  detailItem.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                }`}>
                  {detailItem.status === 'PENDING' ? '답변대기' : '답변완료'}
                </span>
                <h3 className="font-bold text-[#2C3E50] text-sm sm:text-base line-clamp-1">{detailItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1 leading-none"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400">상담 문의 내용</span>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap border border-gray-100 text-xs sm:text-sm">
                  {detailItem.content}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-[#A67C52]">법무사 답변</span>
                {detailItem.replyContent ? (
                  <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl text-gray-800 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
                    {detailItem.replyContent}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl text-gray-400 text-xs text-center border border-dashed border-gray-200">
                    현재 담당 법무사가 문의 내용을 확인 중입니다. 빠른 시일 내에 답변이 등록됩니다.
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-5 py-2 bg-[#2C3E50] text-white rounded-lg text-xs font-bold hover:bg-[#1A252F] transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
