'use client';

import React, { useEffect, useState } from 'react';

type Admin = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  memo: string | null;
  isActive: boolean;
  canManagePosts: boolean;
  canManageConsultations: boolean;
  canManageAdmins: boolean;
  createdAt: string;
};

export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    memo: '',
    role: 'ADMIN',
    canManagePosts: false,
    canManageConsultations: false,
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/accounts');
      const data = await res.json();
      if (res.ok) setAdmins(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ email: '', password: '', name: '', memo: '', role: 'ADMIN', canManagePosts: false, canManageConsultations: false });
        fetchAdmins();
      } else {
        const err = await res.json();
        alert(err.error || '생성 실패');
      }
    } catch (error) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (!confirm(`해당 관리자를 ${currentStatus ? '비활성화' : '활성화'} 하시겠습니까?`)) return;
    try {
      await fetch(`/api/admin/accounts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      fetchAdmins();
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 계정을 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/admin/accounts/${id}`, { method: 'DELETE' });
      fetchAdmins();
    } catch (e) {
      alert('오류가 발생했습니다.');
    }
  };

  if (isLoading) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)] text-left">관리자 계정 관리</h1>
          <p className="text-[var(--primary)]/60 text-sm mt-1 text-left">통합 관리자 및 세부 권한을 관리합니다.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-[#A67C52] text-white rounded-xl font-bold hover:bg-[#8B6840] transition-colors"
        >
          + 새 계정 추가
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500">계정 (이메일)</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500">이름 / 메모</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500">역할</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500">부여된 권한</th>
              <th className="py-4 px-6 text-left text-sm font-bold text-gray-500">상태</th>
              <th className="py-4 px-6 text-center text-sm font-bold text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-left">
                  <div className="font-semibold text-gray-900">{admin.email}</div>
                  <div className="text-xs text-gray-500 mt-1">{new Date(admin.createdAt).toLocaleDateString()} 생성됨</div>
                </td>
                <td className="py-4 px-6 text-left">
                  <div className="font-medium text-gray-900">{admin.name || '-'}</div>
                  <div className="text-xs text-gray-500 mt-1">{admin.memo || '-'}</div>
                </td>
                <td className="py-4 px-6 text-left">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {admin.role}
                  </span>
                </td>
                <td className="py-4 px-6 text-left">
                  {admin.role === 'SUPERADMIN' ? (
                    <span className="text-xs text-gray-400">모든 권한 허용됨</span>
                  ) : (
                    <div className="flex gap-2">
                      {admin.canManagePosts && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">콘텐츠 발행</span>}
                      {admin.canManageConsultations && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">상담 관리</span>}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-left">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {admin.isActive ? '로그인 허용' : '로그인 차단됨'}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  <button 
                    onClick={() => handleToggleActive(admin.id, admin.isActive)}
                    className="text-xs px-3 py-1 border rounded mr-2 hover:bg-gray-100"
                  >
                    상태전환
                  </button>
                  <button 
                    onClick={() => handleDelete(admin.id)}
                    className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">새 관리자 계정 추가</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">이메일 (로그인 ID)</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">초기 비밀번호</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">담당자 이름</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold mb-1">메모 (직책 등)</label>
                  <input type="text" value={formData.memo} onChange={e => setFormData({...formData, memo: e.target.value})} className="w-full p-2 border rounded" />
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 border rounded-xl">
                <h3 className="font-bold text-sm mb-3">세부 권한 설정 (일반 관리자만 적용됨)</h3>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={formData.canManagePosts} onChange={e => setFormData({...formData, canManagePosts: e.target.checked})} />
                  <span className="text-sm">콘텐츠 (칼럼) 작성 및 수정</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.canManageConsultations} onChange={e => setFormData({...formData, canManageConsultations: e.target.checked})} />
                  <span className="text-sm">상담(리드, 전화, 게시판) 내역 열람 및 관리</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">취소</button>
                <button type="submit" className="px-5 py-2 bg-[#A67C52] text-white rounded-lg">계정 생성</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
