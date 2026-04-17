'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BoardWritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    author: '',
    password: '',
    phone: '',
    email: '',
    location: '',
    title: '',
    content: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/board-qna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert('상담 글이 등록되었습니다.');
        router.push('/qna/board');
      } else {
        alert('등록 중 오류가 발생했습니다.');
      }
    } catch (err) {
      alert('서버 연결 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <span className="text-xs font-bold text-[#A67C52] uppercase tracking-[0.2em] mb-2 block">게시판 상담</span>
        <h2 className="text-4xl font-black text-[#2C3E50]">온라인 상담 신청</h2>
      </div>

      <div className="bg-white border-t-2 border-t-[#2C3E50] border-x border-b border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Row 1: Author & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-100">
             <div className="flex flex-col md:flex-row divide-x divide-gray-100">
                <label className="md:w-40 bg-gray-50 px-8 py-6 flex items-center justify-center text-sm font-black text-[#2C3E50]">작성자</label>
                <div className="flex-1 p-4">
                  <input 
                    required
                    type="text" 
                    placeholder="이름을 입력하세요"
                    className="w-full px-6 py-3 border border-gray-100 rounded-lg focus:outline-none focus:border-[#A67C52]"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                  />
                </div>
             </div>
             <div className="flex flex-col md:flex-row divide-x divide-gray-100 border-l border-gray-100">
                <label className="md:w-40 bg-gray-50 px-8 py-6 flex items-center justify-center text-sm font-black text-[#2C3E50]">비밀번호</label>
                <div className="flex-1 p-4">
                  <input 
                    required
                    type="password" 
                    placeholder="비밀번호를 입력하세요"
                    className="w-full px-6 py-3 border border-gray-100 rounded-lg focus:outline-none focus:border-[#A67C52]"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
             </div>
          </div>

          {/* Row 2: Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-100">
             <div className="flex flex-col md:flex-row divide-x divide-gray-100">
                <label className="md:w-40 bg-gray-50 px-8 py-6 flex items-center justify-center text-sm font-black text-[#2C3E50]">연락처</label>
                <div className="flex-1 p-4">
                  <input 
                    required
                    type="tel" 
                    placeholder="연락처를 입력하세요"
                    className="w-full px-6 py-3 border border-gray-100 rounded-lg focus:outline-none focus:border-[#A67C52]"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
             </div>
             <div className="flex flex-col md:flex-row divide-x divide-gray-100 border-l border-gray-100">
                <label className="md:w-40 bg-gray-50 px-8 py-6 flex items-center justify-center text-sm font-black text-[#2C3E50]">이메일</label>
                <div className="flex-1 p-4">
                  <input 
                    type="email" 
                    placeholder="이메일을 입력하세요"
                    className="w-full px-6 py-3 border border-gray-100 rounded-lg focus:outline-none focus:border-[#A67C52]"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
             </div>
          </div>

          {/* Row 3: Location (Single) */}
          <div className="flex flex-col md:flex-row border-b border-gray-100 divide-x divide-gray-100">
             <label className="md:w-40 bg-gray-50 px-8 py-6 flex items-center justify-center text-sm font-black text-[#2C3E50]">거주지역</label>
             <div className="flex-1 p-4">
               <select 
                 className="w-72 px-6 py-3 border border-gray-100 rounded-lg focus:outline-none focus:border-[#A67C52] appearance-none"
                 value={formData.location}
                 onChange={(e) => setFormData({...formData, location: e.target.value})}
               >
                 <option value="">선택하세요.</option>
                 <option value="서울">서울</option>
                 <option value="경기">경기</option>
                 <option value="기타">기타</option>
               </select>
             </div>
          </div>

          {/* Row 4: Subject */}
          <div className="flex flex-col md:flex-row border-b border-gray-100 divide-x divide-gray-100">
             <label className="md:w-40 bg-gray-50 px-8 py-6 flex items-center justify-center text-sm font-black text-[#2C3E50]">제목</label>
             <div className="flex-1 p-4">
               <input 
                 required
                 type="text" 
                 placeholder="제목 입력하세요"
                 className="w-full px-6 py-3 border border-gray-100 rounded-lg focus:outline-none focus:border-[#A67C52]"
                 value={formData.title}
                 onChange={(e) => setFormData({...formData, title: e.target.value})}
               />
             </div>
          </div>

          {/* Row 5: Content */}
          <div className="flex flex-col md:flex-row divide-x divide-gray-100">
             <label className="md:w-40 bg-gray-50 px-8 py-10 flex items-center justify-center text-sm font-black text-[#2C3E50]">내용</label>
             <div className="flex-1 p-4">
               <textarea 
                 required
                 placeholder="내용을 입력하세요"
                 rows={15}
                 className="w-full px-6 py-6 border border-gray-100 rounded-lg focus:outline-none focus:border-[#A67C52] resize-none"
                 value={formData.content}
                 onChange={(e) => setFormData({...formData, content: e.target.value})}
               ></textarea>
             </div>
          </div>

          <div className="py-12 bg-gray-50 flex flex-col items-center space-y-8">
             <div className="flex items-center gap-3">
                <input type="checkbox" required className="w-5 h-5 accent-[#A67C52]" id="privacy-board" />
                <label htmlFor="privacy-board" className="text-sm font-medium text-gray-400">
                  개인정보 수집 및 이용동의 <span className="text-[#A67C52] ml-2 cursor-pointer hover:underline">전문보기</span>
                </label>
             </div>
             
             <button 
               type="submit"
               className="px-24 py-5 bg-[#B89E6E] text-white rounded-xl font-bold text-xl shadow-xl hover:bg-[#A67C52] transition-all flex items-center gap-3"
             >
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.023c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
               </svg>
               문의하기
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
