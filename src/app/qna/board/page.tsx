'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface BoardItem {
  id: string;
  author: string;
  title: string;
  status: string;
  createdAt: string;
  isSecret?: boolean;
}

interface VerifiedItem {
  id: string;
  title: string;
  author: string;
  location?: string | null;
  content: string;
  replyContent?: string | null;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

export default function BoardQnaPage() {
  const [questions, setQuestions] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'REPLIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 비밀번호 확인 모달 상태
  const [selectedQuestion, setSelectedQuestion] = useState<BoardItem | null>(null);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // 검증 완료된 상세 모달 상태
  const [viewItem, setViewItem] = useState<VerifiedItem | null>(null);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '10');
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const res = await fetch(`/api/board-qna?${params.toString()}`);
      if (!res.ok) throw new Error('조회 실패');
      const data = await res.json();

      if (data && Array.isArray(data.items)) {
        setQuestions(data.items);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount || 0);
      } else if (Array.isArray(data)) {
        setQuestions(data);
        setTotalCount(data.length);
        setTotalPages(1);
      } else {
        setQuestions([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch {
      setQuestions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
        setViewItem(data.item);
        setSelectedQuestion(null);
        setInputPassword('');
      } else {
        setPasswordError(data.error || '비밀번호가 일치하지 않습니다.');
      }
    } catch {
      setPasswordError('인증 중 서버 오류가 발생했습니다.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header & Write Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#A67C52]" />
            <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em]">1:1 비공개 상담</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#2C3E50] break-keep">게시판 상담</h2>
          <p className="text-sm text-gray-500 mt-2">
            모든 상담은 비밀글로 철저히 보호되며, 작성 시 설정한 비밀번호로 본인의 질문과 법무사 답변을 열람하실 수 있습니다.
          </p>
        </div>
        
        <Link 
          href="/qna/board/write" 
          className="flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-4 bg-[#B89E6E] text-white rounded-xl font-bold text-base shadow-lg hover:bg-[#A67C52] transition-all whitespace-nowrap flex-shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          상담 글쓰기
        </Link>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl overflow-x-auto">
          {[
            { key: 'ALL', label: '전체보기' },
            { key: 'PENDING', label: '답변대기' },
            { key: 'REPLIED', label: '답변완료' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key as any);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.key
                  ? 'bg-white text-[#2C3E50] shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="제목 또는 내용 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setCurrentPage(1);
                  fetchQuestions();
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#A67C52] transition-colors"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <button
            onClick={() => {
              setCurrentPage(1);
              fetchQuestions();
            }}
            className="px-4 py-2.5 bg-[#2C3E50] text-white rounded-xl text-sm font-bold hover:bg-[#1A252F] transition-colors whitespace-nowrap"
          >
            검색
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 whitespace-nowrap">
                <th className="px-5 py-4 text-xs font-bold text-gray-500 w-16 text-center">번호</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500">상담 제목</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 w-28 text-center">작성자</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 w-28 text-center">답변여부</th>
                <th className="px-5 py-4 text-xs font-bold text-gray-500 w-32 text-center">작성일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="inline-flex items-center gap-3 text-gray-400 font-medium">
                      <div className="w-5 h-5 border-2 border-[#A67C52] border-t-transparent rounded-full animate-spin" />
                      상담 목록을 불러오는 중입니다...
                    </div>
                  </td>
                </tr>
              ) : questions.length > 0 ? (
                questions.map((q, idx) => {
                  const displayNum = totalCount - ((currentPage - 1) * 10 + idx);
                  return (
                    <tr 
                      key={q.id} 
                      onClick={() => handleRowClick(q)}
                      className="hover:bg-amber-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-5 py-4 text-xs text-gray-400 font-medium text-center whitespace-nowrap">
                        {displayNum}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="p-1.5 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-[#A67C52]/10 group-hover:text-[#A67C52] transition-colors flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                              <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 8.25v-3a3.75 3.75 0 1 1 7.5 0v3H8.25Z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-sm font-bold text-[#2C3E50] group-hover:text-[#A67C52] transition-colors line-clamp-1 break-keep">
                            {q.title}
                          </span>
                          <span className="text-[11px] text-gray-400 font-normal hidden sm:inline-block">
                            (비밀글)
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600 font-medium text-center whitespace-nowrap">
                        {q.author}
                      </td>
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          q.status === 'PENDING' 
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/50' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                        }`}>
                          {q.status === 'PENDING' ? '답변대기' : '답변완료'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 font-medium text-center whitespace-nowrap">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center text-gray-400 font-medium">
                    등록된 상담글이 없거나 검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <span className="text-sm font-bold text-gray-700 px-4">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* 안내 카드 */}
      <div className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-6 text-sm text-gray-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#A67C52]/10 text-[#A67C52] flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-[#2C3E50]">철저한 의뢰인 정보 보호</h4>
            <p className="text-xs text-gray-500 mt-0.5">상담 내용 및 개인정보는 외부 노출 없이 법무사가 직접 검토 후 신속히 답변을 등록합니다.</p>
          </div>
        </div>
        <Link
          href="/qna/phone"
          className="text-xs font-bold text-[#A67C52] hover:underline whitespace-nowrap self-end sm:self-center"
        >
          급하신 경우 실시간 전화상담 바로가기 &rarr;
        </Link>
      </div>

      {/* 모달 1: 비밀번호 입력 모달 */}
      {selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#2C3E50] font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#A67C52]">
                  <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 8.25v-3a3.75 3.75 0 1 1 7.5 0v3H8.25Z" clipRule="evenodd" />
                </svg>
                <span>비밀글 열람 인증</span>
              </div>
              <button 
                onClick={() => setSelectedQuestion(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1 font-medium">선택된 문의글:</p>
              <p className="text-sm font-bold text-[#2C3E50] bg-gray-50 p-3 rounded-xl border border-gray-100">
                {selectedQuestion.title}
              </p>
            </div>

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  작성 시 입력한 비밀번호
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="비밀번호를 입력하세요"
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#A67C52]"
                />
                {passwordError && (
                  <p className="text-xs text-red-500 font-medium mt-1.5">{passwordError}</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuestion(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={verifying}
                  className="flex-1 py-3 bg-[#A67C52] text-white rounded-xl text-sm font-bold hover:bg-[#8e6842] transition-colors flex items-center justify-center gap-2"
                >
                  {verifying ? '확인 중...' : '확인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 모달 2: 상담 상세 및 답변 열람 모달 */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/70">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  viewItem.status === 'PENDING' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {viewItem.status === 'PENDING' ? '답변대기' : '답변완료'}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#2C3E50] line-clamp-1">
                  {viewItem.title}
                </h3>
              </div>
              <button
                onClick={() => setViewItem(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin">
              {/* Question Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pb-3 border-b border-gray-100">
                <span><strong>작성자:</strong> {viewItem.author}</span>
                {viewItem.location && <span><strong>지역:</strong> {viewItem.location}</span>}
                <span><strong>작성일:</strong> {new Date(viewItem.createdAt).toLocaleString()}</span>
              </div>

              {/* Question Content */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">상담 문의 내용</h4>
                <div className="bg-gray-50 p-5 rounded-2xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans border border-gray-100">
                  {viewItem.content}
                </div>
              </div>

              {/* Legal Reply Section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#A67C52]" />
                  <h4 className="text-xs font-bold text-[#A67C52] uppercase tracking-wider">담당 법무사 상담 답변</h4>
                </div>

                {viewItem.replyContent ? (
                  <div className="bg-amber-50/40 border border-amber-200/60 p-6 rounded-2xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#A67C52]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                      법무사 김상호 사무소 답변
                    </div>
                    <div>{viewItem.replyContent}</div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center space-y-2">
                    <p className="text-sm font-bold text-gray-600">현재 담당 법무사가 문의 내용을 면밀히 검토하고 있습니다.</p>
                    <p className="text-xs text-gray-400">빠른 시일 내에 성심성의껏 답변을 등록해 드리겠습니다.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <span className="text-xs text-gray-400">문의번호: {viewItem.id}</span>
              <button
                onClick={() => setViewItem(null)}
                className="px-6 py-2 bg-[#2C3E50] text-white rounded-xl text-sm font-bold hover:bg-[#1A252F] transition-colors"
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
