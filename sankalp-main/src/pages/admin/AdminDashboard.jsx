import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { getAllPatients, getAllBabies, getDashboardStats, classifyBaby, isKmcEligible, getSepsisStats } from '../../data/dataStore';
import { formatDate, formatDateTime } from '../../lib/utils';
import {
  Users, ClipboardList, CheckCircle2, AlertTriangle, Baby, Heart, Phone, Clock
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [babies, setBabies] = useState([]);

  useEffect(() => {
    setPatients(getAllPatients());
    setBabies(getAllBabies());
  }, []);

  const stats = getDashboardStats();
  const sepsisStats = getSepsisStats();

  // Derived stats
  const pretermBabies = babies.filter(b => Number(b.gestational_age) < 37);
  const lbwBabies = babies.filter(b => Number(b.birth_weight) < 2500);
  const kmcEligible = babies.filter(b => isKmcEligible(b.outcome_of_delivery, b.birth_weight, b.gestational_age, b.baby_condition));

  // Status distribution for pie chart
  const statusData = [
    { name: t('draft'), value: stats.drafts, color: '#94a3b8' },
    { name: t('submitted'), value: stats.pending_review, color: '#3b82f6' },
    { name: t('returned'), value: stats.returned, color: '#f59e0b' },
    { name: t('approved'), value: stats.approved, color: '#10b981' },
    { name: t('closed'), value: stats.closed, color: '#64748b' },
  ].filter(d => d.value > 0);

  // Facility distribution
  const facilityMap = {};
  patients.forEach(p => {
    const f = p.facility_name || 'Unknown';
    facilityMap[f] = (facilityMap[f] || 0) + 1;
  });
  const facilityData = Object.entries(facilityMap).map(([name, count]) => ({ name, count }));

  // Counsellor distribution
  const counsellorMap = {};
  patients.forEach(p => {
    const c = p.counsellor_name || 'Unknown';
    counsellorMap[c] = (counsellorMap[c] || 0) + 1;
  });
  const counsellorData = Object.entries(counsellorMap).map(([name, count]) => ({ name, count }));

  // Monthly data (last 6 months)
  const monthlyMap = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('en', { month: 'short' });
    monthlyMap[key] = 0;
  }
  patients.forEach(p => {
    if (p.created_at) {
      const d = new Date(p.created_at);
      const key = d.toLocaleString('en', { month: 'short' });
      if (key in monthlyMap) monthlyMap[key]++;
    }
  });
  const monthlyData = Object.entries(monthlyMap).map(([month, entries]) => ({ month, entries }));

  const statsCards = [
    { title: t('totalRegistrations'), value: String(stats.total), subtitle: `${stats.today} ${t('today')}`, icon: Users, iconBg: 'bg-blue-500' },
    { title: t('pendingReviewsCard'), value: String(stats.pending_review), subtitle: t('urgentAttention'), icon: ClipboardList, iconBg: 'bg-amber-500' },
    { title: t('approvedRecords'), value: String(stats.approved), subtitle: '', icon: CheckCircle2, iconBg: 'bg-emerald-500' },
    { title: t('returned'), value: String(stats.returned), subtitle: t('needsRevision'), icon: AlertTriangle, iconBg: 'bg-rose-500' },
    { title: t('pretermBabies'), value: String(pretermBabies.length), subtitle: '', icon: Baby, iconBg: 'bg-violet-500' },
    { title: t('lowBirthWeightBabies'), value: String(lbwBabies.length), subtitle: '', icon: Heart, iconBg: 'bg-pink-500' },
    { title: t('kmcEligibleBabies'), value: String(kmcEligible.length), subtitle: '', icon: Baby, iconBg: 'bg-teal-500' },
    { title: t('sepsisDueToday'), value: String(sepsisStats.dueToday), subtitle: t('requiresAttention'), icon: AlertTriangle, iconBg: 'bg-red-500' },
    { title: t('overdueSepsisVisits'), value: String(sepsisStats.overdue), subtitle: t('needsFollowUp'), icon: Clock, iconBg: 'bg-orange-500' },
    { title: t('highRiskBabies'), value: String(sepsisStats.highRisk), subtitle: t('sepsisRiskDetected'), icon: Heart, iconBg: 'bg-red-600' },
    { title: t('closedCases'), value: String(stats.closed), subtitle: '', icon: CheckCircle2, iconBg: 'bg-slate-500' },
  ];

  return (
    <AppLayout title={t('dashboard')}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">{t('hospitalManagement')}</h1>
        <p className="text-slate-500 text-sm">{t('dashboardOverview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {statsCards.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Monthly Entries */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-1">{t('monthlyFacilityEntries')}</h3>
          <p className="text-slate-400 text-xs mb-4">{t('entriesVsApproved')}</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="entries" name={t('totalEntries')} fill="#0F4C75" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">{t('status')}</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">No data</div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {statusData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }}></span>
                {d.name}: {d.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Facility & Counsellor Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Facility Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={facilityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} width={100} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#0D9488" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Counsellor Distribution</h3>
          {counsellorData.length > 0 ? (
            <div className="space-y-3">
              {counsellorData.map(c => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-700">{c.name}</span>
                    <span className="text-slate-500 font-medium">{c.count} {t('cases')}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full">
                    <div className="h-2 bg-[#0F4C75] rounded-full" style={{ width: `${Math.min(100, (c.count / Math.max(...counsellorData.map(x => x.count))) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">No counsellor data</div>
          )}
        </div>
      </div>

      {/* Sepsis Monitoring */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-800">{t('sepsisMonitoring')}</h3>
            <p className="text-slate-400 text-xs">{t('sepsisTrackingOverview')}</p>
          </div>
          <button onClick={() => navigate('/admin/sepsis-reports')} className="text-blue-600 text-sm font-medium hover:underline">{t('viewSepsisReports')}</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-800">{t('totalSepsisVisits')}</span>
              <span className="text-2xl font-bold text-blue-600">{sepsisStats.totalVisits}</span>
            </div>
            <p className="text-slate-500 text-xs">{t('totalSepsisVisitsDesc')}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-800">{t('sepsisCases')}</span>
              <span className="text-2xl font-bold text-red-600">{sepsisStats.highRisk}</span>
            </div>
            <p className="text-slate-500 text-xs">{t('sepsisCasesDesc')}</p>
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
                {[t('mothersName'), t('facility'), t('supervisor'), t('status'), t('date')].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {patients.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">{t('noRecords')}</td></tr>
              ) : patients.slice(0, 8).map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/admin/patients/${p.id}`)}>
                  <td className="px-5 py-3">
                    <p className="text-sm font-medium text-slate-800">{p.mother_name || '—'}</p>
                    <p className="text-xs text-slate-400">{p.patient_id}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{p.facility_name || '—'}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{p.supervisor_name || '—'}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDate(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
