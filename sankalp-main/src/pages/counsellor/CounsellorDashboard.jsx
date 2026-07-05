import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import AppLayout from '../../components/layout/AppLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import { getPatientsByCounsellor, getDashboardStats, getSepsisStats } from '../../data/dataStore';
import { UserPlus, ClipboardList, CheckCircle2, Clock, AlertTriangle, Calendar, Baby } from 'lucide-react';

export default function CounsellorDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (user?.id) {
      setPatients(getPatientsByCounsellor(user.id));
    }
  }, [user]);

  const sepsisStats = getSepsisStats();

  const stats = [
    { title: t('totalEntries'), value: String(patients.length), subtitle: t('yourRegistrations'), icon: ClipboardList, iconBg: 'bg-blue-500' },
    { title: t('drafts'), value: String(patients.filter(p => p.status === 'draft').length), subtitle: t('pendingSubmission'), icon: Clock, iconBg: 'bg-amber-500' },
    { title: t('submitted'), value: String(patients.filter(p => p.status === 'submitted' || p.status === 'submitted_again').length), subtitle: t('submittedToSupervisor'), icon: CheckCircle2, iconBg: 'bg-emerald-500' },
    { title: t('returned'), value: String(patients.filter(p => p.status === 'returned').length), subtitle: t('needsRevision'), icon: ClipboardList, iconBg: 'bg-rose-500' },
    { title: t('sevisitsDueToday'), value: String(sepsisStats.dueToday), subtitle: t('requiresAttention'), icon: Calendar, iconBg: 'bg-yellow-500' },
    { title: t('highRiskBabies'), value: String(sepsisStats.highRisk), subtitle: t('sepsisRiskDetected'), icon: Baby, iconBg: 'bg-red-600' },
  ];

  return (
    <AppLayout title={t('dashboard')}>
      <div className="mb-6">
        <h1 className="text-slate-800 text-xl font-bold">{t('goodMorning')}, {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{t('counsellorDashboardDesc')}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => navigate('/counsellor/patients/new')}
          className="flex items-center gap-4 p-5 rounded-xl text-white font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md"
          style={{ background: 'linear-gradient(135deg, #0F4C75, #1B6CA8)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <UserPlus size={20} />
          </div>
          <div className="text-left">
            <p className="font-semibold">{t('registerNewPatient')}</p>
            <p className="text-blue-100 text-xs mt-0.5">{t('fillRegistrationDetails')}</p>
          </div>
          <span className="ml-auto text-lg">&rarr;</span>
        </button>

        <button
          onClick={() => navigate('/counsellor/patients')}
          className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium transition-all hover:bg-slate-50 hover:-translate-y-0.5 shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <ClipboardList size={20} className="text-slate-500" />
          </div>
          <div className="text-left">
            <p className="font-semibold">{t('myRegistrations')}</p>
            <p className="text-slate-400 text-xs mt-0.5">{patients.length} {t('totalEntries')}</p>
          </div>
          <span className="ml-auto">&rarr;</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-800">{t('recentRegistrations')}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{patients.length} {t('totalEntries')}</p>
          </div>
          <button onClick={() => navigate('/counsellor/patients')} className="text-blue-600 text-sm font-medium hover:underline">{t('viewAll')}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[t('motherName'), t('facility'), t('status'), t('created')].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-10 text-slate-400 text-sm">{t('noEntriesYet')}</td></tr>
              ) : patients.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => navigate(`/counsellor/patients/${p.id}`)}>
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{p.mother_name || '—'}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{p.facility_name || '—'}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                      p.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                      p.status === 'submitted' ? 'bg-blue-100 text-blue-700' :
                      p.status === 'returned' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400">{p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}