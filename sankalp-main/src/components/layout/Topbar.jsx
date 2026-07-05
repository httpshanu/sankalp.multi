import { useState } from 'react';
import { Bell, Search, X } from 'lucide-react';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { timeAgo } from '../../lib/utils';
import OrganizationLogos from './OrganizationLogos';

export default function Topbar({ title }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  const notifTypeIcon = (type) => {
    const map = {
      returned: '↩️',
      followup_due: '📅',
      new_submission: '📋',
      pending_review: '⏳',
      high_risk: '🚨',
    };
    return map[type] || '🔔';
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-slate-100 flex-shrink-0 relative z-20">
      {/* Left: Logo Group & Title */}
      <div className="flex items-center gap-4">
        <OrganizationLogos variant="header" className="hidden md:flex" />
        <OrganizationLogos variant="mobile" className="flex md:hidden" />
        <span className="h-5 w-px bg-slate-200 hidden sm:block"></span>
        <h2 className="text-slate-800 font-semibold text-base sm:text-lg">{title}</h2>
      </div>

      {/* Right: Language + Search + Notif + Help */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'en' ? 'bg-[#0F4C75] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'hi' ? 'bg-[#0F4C75] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={15} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800 text-sm">{t('notifications')}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">{t('markAllRead')}</span>
                  <button onClick={() => setShowNotifs(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${
                      !n.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base mt-0.5">{notifTypeIcon(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                        <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <span className="text-xs text-blue-600 cursor-pointer hover:underline">{t('viewAllNotifications')}</span>
              </div>
            </div>
          )}
        </div>


      </div>
    </header>
  );
}
