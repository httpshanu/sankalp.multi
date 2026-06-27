import { useState } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_USERS } from '../../data/mockData';
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { getInitials } from '../../lib/utils';

export default function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState(MOCK_USERS);

  const toggleStatus = (id) => {
    setUsers(u => u.map(usr => usr.id === id ? { ...usr, status: usr.status === 'active' ? 'inactive' : 'active' } : usr));
  };

  return (
    <AppLayout title={t('userManagement')}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('userManagementTitle')}</h1>
          <p className="text-slate-500 text-sm">{users.filter(u => u.status === 'active').length} {t('activeSupervisors')}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#0F4C75,#1B6CA8)' }}>
          <Plus size={16} /> {t('addSupervisor')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: t('totalUsers'), value: users.length, color: 'text-blue-600 bg-blue-50' },
          { label: t('active'), value: users.filter(u => u.status === 'active').length, color: 'text-emerald-600 bg-emerald-50' },
          { label: t('inactive'), value: users.filter(u => u.status === 'inactive').length, color: 'text-slate-500 bg-slate-50' },
          { label: t('totalCases'), value: users.reduce((a, u) => a + u.casesCount, 0), color: 'text-violet-600 bg-violet-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${s.color}`}>{s.value}</div>
            <p className="text-sm text-slate-600 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[t('supervisor'), t('designation'), t('facility'), t('totalCases'), t('status'), t('joined'), t('actions')].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0F4C75] text-white text-xs font-bold flex items-center justify-center">
                        {getInitials(u.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{u.designation}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{u.facility}</span>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold text-slate-800">{u.casesCount}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.status === 'active' ? t('active') : t('inactive')}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-500">{u.joinedDate}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Edit size={13} /></button>
                      <button onClick={() => toggleStatus(u.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        {u.status === 'active' ? <UserX size={13} /> : <UserCheck size={13} />}
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
