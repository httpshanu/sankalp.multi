import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_PATIENTS, MOCK_MONTHLY_FACILITY_DATA, MOCK_SUPERVISOR_DATA } from '../../data/mockData';
import { formatDateTime } from '../../lib/utils';
import {
  Users, ClipboardList, CheckCircle2, AlertTriangle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const stats = [
    { title: t('totalRegistrations'), value: '1,284', subtitle: '+12% ' + t('fromLastMonth'), icon: Users, iconBg: 'bg-blue-500', trend: 12, trendLabel: t('fromLastMonth') },
    { title: t('pendingReviewsCard'), value: '42', subtitle: t('urgentAttention'), icon: ClipboardList, iconBg: 'bg-amber-500' },
    { title: t('approvedRecords'), value: '1,192', subtitle: t('accuracyRateCard'), icon: CheckCircle2, iconBg: 'bg-emerald-500' },
    { title: t('followupDefaulters'), value: '15', subtitle: t('highRiskCases'), icon: AlertTriangle, iconBg: 'bg-rose-500' },
  ];

  return (
    <AppLayout title={t('dashboard')}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">{t('hospitalManagement')}</h1>
        <p className="text-slate-500 text-sm">{t('dashboardOverview')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Monthly Facility Entries */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-1">{t('monthlyFacilityEntries')}</h3>
          <p className="text-slate-400 text-xs mb-4">{t('entriesVsApproved')}</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={MOCK_MONTHLY_FACILITY_DATA} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="LR" name="LR" fill="#1B6CA8" radius={[3,3,0,0]} />
              <Bar dataKey="SNCU" name="SNCU" fill="#0D9488" radius={[3,3,0,0]} />
              <Bar dataKey="OBS" name="OBS" fill="#38BDF8" radius={[3,3,0,0]} />
              <Bar dataKey="OPD" name="OPD" fill="#14B8A6" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Supervisor stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">{t('supervisorPerformance')}</h3>
          <div className="space-y-3">
            {MOCK_SUPERVISOR_DATA.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0F4C75] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {s.name.split(' ').slice(-1)[0][0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-slate-700 truncate">{s.name}</p>
                    <p className="text-xs text-slate-500 ml-2">{s.approved}/{s.cases}</p>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className="h-1.5 bg-[#0D9488] rounded-full" style={{ width: `${(s.approved / s.cases) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Monitoring */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">{t('liveMonitoring')}</h3>
            <p className="text-slate-400 text-xs">{t('realTimeStatus')}</p>
          </div>
          <button onClick={() => navigate('/admin/patients')} className="text-blue-600 text-sm font-medium hover:underline">{t('viewAllRegistry')}</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[t('mothersName'), t('uhid'), t('status'), t('supervisor'), t('date')].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_PATIENTS.slice(0, 5).map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/patients/${p.id}`)}>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-800">{p.motherDetails.motherName}</p>
                    <p className="text-xs text-slate-400">{p.riskTags?.[0]}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{p.babyDetails.uhid}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-sm text-slate-600">{p.supervisorName?.split(' ').slice(0,2).join(' ')}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDateTime(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
