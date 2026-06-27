import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { getInitials } from '../../lib/utils';
import { Lock, Bell, User } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { t } = useLanguage();
  return (
    <AppLayout title={t('settings')}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">{t('settings')}</h1>
        <p className="text-slate-500 text-sm">{t('managePreferences')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <User size={16} className="text-[#0F4C75]" />
            <h3 className="font-semibold text-slate-800">{t('profile')}</h3>
          </div>
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#0F4C75] text-white text-xl font-bold flex items-center justify-center mb-3">
              {getInitials(user?.name)}
            </div>
            <h4 className="font-semibold text-slate-800">{user?.name}</h4>
            <p className="text-slate-500 text-sm">{user?.designation}</p>
            <span className="mt-2 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold capitalize">{user?.role}</span>
          </div>
          <div className="space-y-3">
            {[{ label: t('fullName'), value: user?.name }, { label: t('facility'), value: user?.facility }].map(f => (
              <div key={f.label}>
                <label className="text-xs text-slate-400 font-medium">{f.label}</label>
                <input readOnly value={f.value || ''} className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <Lock size={16} className="text-[#0F4C75]" />
            <h3 className="font-semibold text-slate-800">{t('security')}</h3>
          </div>
          <div className="space-y-3">
            {[t('currentPassword'), t('newPassword'), t('confirmPassword')].map(label => (
              <div key={label}>
                <label className="text-xs text-slate-400 font-medium">{label}</label>
                <input type="password" placeholder="••••••••" className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
            ))}
            <button className="w-full mt-2 py-2 rounded-lg bg-[#0F4C75] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
              {t('updatePassword')}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <Bell size={16} className="text-[#0F4C75]" />
            <h3 className="font-semibold text-slate-800">{t('notificationsSettings')}</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: t('caseReturnedAlerts'), on: true },
              { label: t('followupReminders'), on: true },
              { label: t('adminRemarks'), on: true },
              { label: t('systemUpdates'), on: false },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-700">{n.label}</span>
                <div className={`w-10 h-5 rounded-full flex items-center cursor-pointer ${n.on ? 'bg-[#0D9488] justify-end' : 'bg-slate-200 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow mx-0.5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
