import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import { getInitials } from '../../lib/utils';
import {
  LayoutDashboard, Users, FileText, Settings, LogOut,
  ChevronLeft, ChevronRight, Building2, ClipboardList
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const SUPERVISOR_NAV = [
    { to: '/supervisor', label: t('dashboard'), icon: LayoutDashboard, end: true },
    { to: '/supervisor/patients', label: t('patientRegistry'), icon: ClipboardList },
    { to: '/supervisor/reports', label: t('reports'), icon: FileText },
    { to: '/supervisor/settings', label: t('settings'), icon: Settings },
  ];

  const ADMIN_NAV = [
    { to: '/admin', label: t('dashboard'), icon: LayoutDashboard, end: true },
    { to: '/admin/patients', label: t('allPatients'), icon: ClipboardList },
    { to: '/admin/reports', label: t('reports'), icon: FileText },
    { to: '/admin/users', label: t('userManagement'), icon: Users },
    { to: '/admin/facilities', label: t('facilities'), icon: Building2 },
    { to: '/admin/settings', label: t('settings'), icon: Settings },
  ];

  const nav = user?.role === 'admin' ? ADMIN_NAV : SUPERVISOR_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`relative flex flex-col h-screen transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ background: 'linear-gradient(180deg, #0F4C75 0%, #0a3254 100%)', flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-5 border-b border-white/10" style={{ mixBlendMode: 'screen' }}>
        {collapsed ? (
          <img 
            src="/logo.png" 
            alt="Sankalp" 
            className="w-12 h-12 object-cover flex-shrink-0"
            style={{ filter: 'brightness(1.2) grayscale(1) invert(1) sepia(1) hue-rotate(140deg) saturate(3) brightness(1.5)' }}
          />
        ) : (
          <img 
            src="/logo.png" 
            alt="Sankalp" 
            className="w-48 object-contain"
            style={{ filter: 'brightness(1.2) grayscale(1) invert(1) sepia(1) hue-rotate(140deg) saturate(3) brightness(1.5)' }}
          />
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 z-10 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-[#0F4C75] hover:bg-blue-50 transition-colors"
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide">
        {!collapsed && (
          <p className="text-blue-300/70 text-xs font-semibold uppercase tracking-wider px-3 mb-2">
            {user?.role === 'admin' ? t('adminPanel') : t('supervisor')}
          </p>
        )}
        <ul className="space-y-1">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-150 text-lg ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
                  }`
                }
                title={collapsed ? label : undefined}
              >
                <Icon size={18} className="flex-shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile at bottom */}
      <div className="border-t border-white/10 p-3">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full bg-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-blue-300 text-xs truncate">{user?.designation}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={handleLogout}
              className="text-blue-300 hover:text-white transition-colors"
              title={t('logout')}
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
        {collapsed && (
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex justify-center text-blue-300 hover:text-white transition-colors"
            title={t('logout')}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
