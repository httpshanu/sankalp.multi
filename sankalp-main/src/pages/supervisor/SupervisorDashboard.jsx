import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import AppLayout from '../../components/layout/AppLayout';
import StatsCard from '../../components/dashboard/StatsCard';
import StatusBadge from '../../components/patient/StatusBadge';
import { getPatientsBySupervisor, getFollowupsBySupervisor, getDashboardStats, getCallStatusColor, getSepsisStats } from '../../data/dataStore';
import { formatDate } from '../../lib/utils';
import {
  UserPlus, ClipboardCheck, Calendar, AlertTriangle,
  ClipboardList, Clock, CheckCircle2, Phone, X, Bell, Baby
} from 'lucide-react';

export default function SupervisorDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setPatients(getPatientsBySupervisor(user.id));
      setFollowups(getFollowupsBySupervisor(user.id));
    }
  }, [user]);

  // Pending follow-ups (due today or overdue)
  const today = new Date().toISOString().split('T')[0];
  const pendingFollowups = followups.filter(f => {
    if (f.completed_at) return false;
    return f.due_date <= today;
  });

  const overdueFollowups = followups.filter(f => {
    if (f.completed_at) return false;
    return f.due_date < today;
  });

  const dueToday = followups.filter(f => {
    if (f.completed_at) return false;
    return f.due_date === today;
  });

  const completedFollowups = followups.filter(f => f.completed_at);

  const drafts = patients.filter(p => p.status === 'draft');
  const submitted = patients.filter(p => p.status === 'submitted' || p.status === 'submitted_again');
  const returned = patients.filter(p => p.status === 'returned');

  // Get sepsis stats for supervisor's patients
  const sepsisStats = getSepsisStats();

  const stats = [
    { title: t('recordsPending'), value: String(drafts.length + submitted.length), subtitle: `${drafts.length} ${t('drafts')}, ${submitted.length} ${t('submitted')}`, icon: ClipboardList, iconBg: 'bg-blue-500' },
    { title: t('followupsDueToday'), value: String(dueToday.length + overdueFollowups.length), subtitle: `${overdueFollowups.length} ${t('overdueFollowups')}`, icon: Clock, iconBg: 'bg-amber-500' },
    { title: t('completedFollowups'), value: String(completedFollowups.length), subtitle: `${followups.length} total`, icon: CheckCircle2, iconBg: 'bg-emerald-500' },
    { title: t('returned'), value: String(returned.length), subtitle: t('needsRevision'), icon: AlertTriangle, iconBg: 'bg-rose-500' },
    { title: t('sevisitsDueToday'), value: String(sepsisStats.dueToday), subtitle: t('sevisitsDueTodaySub'), icon: Calendar, iconBg: 'bg-yellow-500' },
    { title: t('sevisitsOverdue'), value: String(sepsisStats.overdue), subtitle: t('sevisitsOverdueSub'), icon: AlertTriangle, iconBg: 'bg-red-500' },
    { title: t('highRiskBabies'), value: String(sepsisStats.highRisk), subtitle: t('highRiskBabiesSub'), icon: Baby, iconBg: 'bg-red-600' },
  ];

  // Beep for pending follow-ups (once per session)
  useEffect(() => {
    if (pendingFollowups.length > 0) {
      const beeped = sessionStorage.getItem('sankalp_beeped');
      if (!beeped) {
        try {
          const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          gainNode.gain.value = 0.1;
          oscillator.start();
          setTimeout(() => { oscillator.stop(); audioCtx.close(); }, 200);
          sessionStorage.setItem('sankalp_beeped', 'true');
        } catch {}
      }
    }
  }, [pendingFollowups.length]);

  return (
    <AppLayout title={t('dashboard')}>
      {/* Follow-up Notification Panel */}
      {pendingFollowups.length > 0 && (
        <div className="mb-5 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
          <Bell size={18} className="text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-800 text-sm font-semibold">
              {pendingFollowups.length} {t('followupsDueToday')} ({overdueFollowups.length} {t('overdueFollowups')})
            </p>
            <p className="text-amber-600 text-xs mt-0.5">{t('viewPendingVisits')}</p>
          </div>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors"
          >
            {showNotifications ? t('close') : t('viewCases')}
          </button>
        </div>
      )}

      {/* Notification Dropdown */}
      {showNotifications && pendingFollowups.length > 0 && (
        <div className="mb-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">{t('pendingFollowups')}</h3>
            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
            {pendingFollowups.slice(0, 10).map(fu => {
              const patient = patients.find(p => p.id === fu.patient_id);
              const color = getCallStatusColor(fu.due_date < today ? 'overdue' : 'pending');
              return (
                <div key={fu.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/supervisor/patients/${fu.patient_id}`)}>
                  <div className={`w-2 h-2 rounded-full ${color.dot}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{patient?.mother_name || 'Unknown'}</p>
                    <p className="text-xs text-slate-500">Day {fu.followup_day} · Due: {fu.due_date}</p>
                  </div>
                  {patient?.mother_mobile && (
                    <a href={`tel:${patient.mother_mobile}`} onClick={e => e.stopPropagation()} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                      <Phone size={12} />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-slate-800 text-xl font-bold">{t('goodMorning')}, {user?.name?.split(' ')[0]}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{t('patientOverview')}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
          <span className="ml-auto text-lg">&rarr;</span>
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
            <p className="text-teal-100 text-xs mt-0.5">{pendingFollowups.length} {t('pendingFollowups')}</p>
          </div>
          <span className="ml-auto text-lg">&rarr;</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map(s => <StatsCard key={s.title} {...s} />)}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        {/* Active Records */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-slate-800">{t('myActiveRecords')}</h2>
              <p className="text-slate-400 text-xs mt-0.5">{patients.length} {t('totalEntries')}</p>
            </div>
            <button onClick={() => navigate('/supervisor/patients')} className="text-blue-600 text-sm font-medium hover:underline">{t('viewAll')}</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[t('motherName'), t('facility'), t('status'), t('updated'), t('actions')].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-10 text-slate-400 text-sm">{t('noRecords')}</td></tr>
                ) : patients.slice(0, 5).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer" onClick={() => navigate(`/supervisor/patients/${p.id}`)}>
                    <td className="px-5 py-3 text-sm font-medium text-slate-800">{p.mother_name || '—'}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{p.facility_name || '—'}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-xs text-slate-400">{formatDate(p.updated_at)}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{p.baby_count || 1} {t('baby')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Follow-ups Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">{t('followupsDueToday')}</h2>
            <Calendar size={16} className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
            {pendingFollowups.length === 0 ? (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">
                <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-400" />
                <p>{t('completedFollowups')}!</p>
              </div>
            ) : pendingFollowups.slice(0, 8).map(fu => {
              const patient = patients.find(p => p.id === fu.patient_id);
              const isOverdue = fu.due_date < today;
              return (
                <div key={fu.id} className="px-5 py-3 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => navigate(`/supervisor/patients/${fu.patient_id}`)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 rounded-lg py-2 text-center flex-shrink-0 ${isOverdue ? 'bg-red-500' : 'bg-[#0F4C75]'}`}>
                      <p className="text-xs font-bold text-white">D{fu.followup_day}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{patient?.mother_name || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">Due: {fu.due_date}</p>
                    </div>
                    {patient?.mother_mobile && (
                      <a href={`tel:${patient.mother_mobile}`} onClick={e => e.stopPropagation()} className="p-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <Phone size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
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
