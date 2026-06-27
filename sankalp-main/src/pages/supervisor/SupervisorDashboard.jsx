import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import AppLayout from '../../components/layout/AppLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import StatusBadge from '../../components/patient/StatusBadge';
import { MOCK_PATIENTS, MOCK_SUPERVISOR_DATA } from '../../data/mockData';
import { formatDate, getInitials } from '../../lib/utils';
import {
  UserPlus, ClipboardCheck, Download, Calendar, AlertTriangle,
  ClipboardList, Edit, MoreVertical, Clock, CheckCircle2, X
} from 'lucide-react';

const myCases = MOCK_PATIENTS.filter(p => p.supervisorId === 'sup1');

const upcomingFollowups = [
  { dateKey: 'dateToday', time: '10:30 AM', labelKey: 'babyOfAnanya', detailKey: 'followupDay14', locationKey: 'chcZone4', isToday: true },
  { dateKey: 'dateToday', time: '02:15 PM', labelKey: 'babyOfPriya', detailKey: 'followupDay7', locationKey: 'homeVisitGreenPark', isToday: true },
  { dateKey: 'dateTomorrow', time: '09:00 AM', labelKey: 'babyOfDeepa', detailKey: 'routineWeightCheck', locationKey: 'sncuOpd', isToday: false },
];

function SupervisorCard({ s }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#0F4C75] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          {getInitials(s.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{s.name}</p>
          <p className="text-xs text-slate-500">{s.facility}</p>
        </div>
      </div>
    </div>
  );
}

function AllSupervisorsModal({ open, onClose, supervisors, t }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{t('allSupervisors')}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supervisors.map(s => (
              <SupervisorCard key={s.name} s={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAllSupervisors, setShowAllSupervisors] = useState(false);

  const stats = [
    { title: t('recordsPending'), value: '08', subtitle: '+2 today', icon: ClipboardList, iconBg: 'bg-blue-500' },
    { title: t('completedVisits'), value: '42', subtitle: t('targetPercent'), icon: CheckCircle2, iconBg: 'bg-emerald-500' },
    { title: t('highRiskAlerts'), value: '03', subtitle: t('urgent'), icon: AlertTriangle, iconBg: 'bg-rose-500' },
    { title: t('reviewAvgTime'), value: '12m', subtitle: t('efficient'), icon: Clock, iconBg: 'bg-violet-500' },
  ];

  const returnedCases = myCases.filter(p => p.status === 'returned');

  const supervisorDirectory = MOCK_SUPERVISOR_DATA.filter(s => s.name !== user?.name);
  const otherSupervisors = supervisorDirectory.slice(0, 4);
  const hasMoreSupervisors = supervisorDirectory.length > 4;

  return (
    <AppLayout title={t('dashboard')}>
      <AllSupervisorsModal open={showAllSupervisors} onClose={() => setShowAllSupervisors(false)} supervisors={supervisorDirectory} t={t} />

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-slate-800 text-xl font-bold">{t('goodMorning')}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 text-sm mt-0.5">{t('patientOverview')}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => navigate('/supervisor/patients/new')}
          className="flex items-center gap-4 p-5 rounded-xl text-white font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md"
          style={{ background: 'linear-gradient(135deg, #0F4C75, #1B6CA8)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <UserPlus size={20} />
          </div>
          <div className="text-left">
            <p className="font-semibold">{t('registerNewPatient')}</p>
            <p className="text-blue-100 text-xs mt-0.5">{t('addNewNeonate')}</p>
          </div>
          <span className="ml-auto text-lg">→</span>
        </button>

        <button
          onClick={() => navigate('/supervisor/patients?filter=followup')}
          className="flex items-center gap-4 p-5 rounded-xl text-white font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-md"
          style={{ background: 'linear-gradient(135deg, #0D9488, #059669)' }}
        >
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <ClipboardCheck size={20} />
          </div>
          <div className="text-left">
            <p className="font-semibold">{t('dailyFollowup')}</p>
            <p className="text-teal-100 text-xs mt-0.5">{t('viewPendingVisits')}</p>
          </div>
          <span className="ml-auto text-lg">→</span>
        </button>

        <button
          onClick={() => navigate('/supervisor/reports')}
          className="flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200 text-slate-700 font-medium transition-all hover:bg-slate-50 hover:-translate-y-0.5 shadow-sm"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Download size={20} className="text-slate-500" />
          </div>
          <div className="text-left">
            <p className="font-semibold">{t('generateSummary')}</p>
            <p className="text-slate-400 text-xs mt-0.5">{t('exportMonthly')}</p>
          </div>
          <span className="ml-auto">↓</span>
        </button>
      </div>

      {/* Returned cases alert */}
      {returnedCases.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <AlertTriangle size={18} className="text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-800 text-sm font-semibold">
              {returnedCases.length} {t('casesReturned')}
            </p>
            <p className="text-amber-600 text-xs mt-0.5">{t('reviewRemarks')}</p>
          </div>
          <button
            onClick={() => navigate('/supervisor/patients?filter=returned')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors"
          >
            {t('viewCases')}
          </button>
        </div>
      )}

      {/* Main Content: Records + Upcoming */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Active Records */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-800">{t('myActiveRecords')}</h2>
              <p className="text-slate-400 text-xs mt-0.5">{myCases.length} {t('activeRecords')}</p>
            </div>
            <button
              onClick={() => navigate('/supervisor/patients')}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[t('patientName'), t('dobAge'), t('primaryRisk'), t('status'), t('actions')].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myCases.map((p) => {
                  const initials = getInitials('Baby ' + p.motherDetails.motherName.split(' ')[0]);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0F4C75] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{t('babyOfName').replace('{name}', t(p.motherDetails.motherName.split(' ')[0]))}</p>
                            <p className="text-xs text-slate-400">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm text-slate-700">{formatDate(p.createdAt)}</p>
                        <p className="text-xs text-slate-400">
                          {Math.floor((Date.now() - new Date(p.createdAt)) / (1000 * 60 * 60 * 24))} {t('daysOld')}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.riskTags?.map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/supervisor/patients/${p.id}`)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={p.status === 'draft' || p.status === 'returned' ? 'Edit' : 'View'}
                          >
                            <Edit size={14} />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">{t('upcomingFollowups')}</h2>
            <Calendar size={16} className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-50">
            {upcomingFollowups.map((f, i) => {
              const isNewDate = i === 0 || f.dateKey !== upcomingFollowups[i - 1].dateKey;
              return (
                <div key={i}>
                  {isNewDate && (
                    <p className="px-5 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">{t(f.dateKey)}</p>
                  )}
                  <div className="px-5 py-3 flex gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className={`w-12 rounded-lg py-2 text-center flex-shrink-0 ${f.isToday ? 'bg-[#0F4C75]' : 'bg-slate-100'}`}>
                      <p className={`text-xs font-bold ${f.isToday ? 'text-white' : 'text-slate-500'}`}>
                        {f.time.split(' ')[0]}
                      </p>
                      <p className={`text-xs ${f.isToday ? 'text-blue-200' : 'text-slate-400'}`}>
                        {f.time.split(' ')[1]}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{t(f.labelKey)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t(f.detailKey)}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                        <span>📍</span> {t(f.locationKey)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Other Supervisors Section */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-slate-800">{t('otherSupervisors')}</h2>
          {hasMoreSupervisors && (
            <button
              onClick={() => setShowAllSupervisors(true)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              {t('viewAllSupervisors')}
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {otherSupervisors.map(s => (
            <SupervisorCard key={s.name} s={s} />
          ))}
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatsCard key={s.title} {...s} />
        ))}
      </div>
    </AppLayout>
  );
}
