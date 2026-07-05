import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import { useLanguage } from '../../context/useLanguage';
import { getAuditLogs } from '../../data/dataStore';
import { formatDateTime } from '../../lib/utils';
import { Search, Filter } from 'lucide-react';

export default function AuditLogsPage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const filtered = logs.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (l.user_name || '').toLowerCase().includes(q) ||
      (l.record_id || '').toLowerCase().includes(q) ||
      (l.action || '').toLowerCase().includes(q);
    const matchAction = actionFilter === 'all' || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  const actions = [...new Set(logs.map(l => l.action))];

  const getActionColor = (action) => {
    if (action?.includes('created')) return 'bg-blue-100 text-blue-700';
    if (action?.includes('approved')) return 'bg-emerald-100 text-emerald-700';
    if (action?.includes('returned')) return 'bg-amber-100 text-amber-700';
    if (action?.includes('closed')) return 'bg-slate-100 text-slate-600';
    if (action?.includes('submitted')) return 'bg-indigo-100 text-indigo-700';
    if (action?.includes('call')) return 'bg-purple-100 text-purple-700';
    if (action?.includes('remark')) return 'bg-pink-100 text-pink-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <AppLayout title={t('auditLogs')}>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-800">{t('auditLogs')}</h1>
        <p className="text-slate-500 text-sm">{t('auditLogsDesc')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by user, record, action..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none"
          >
            <option value="all">All Actions</option>
            {actions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Timestamp', 'User', 'Role', 'Action', 'Record ID', 'Details'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">{t('noAuditLogs')}</td></tr>
              ) : filtered.map((l, i) => (
                <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDateTime(l.timestamp)}</td>
                  <td className="px-5 py-3 text-sm font-medium text-slate-800">{l.user_name || '—'}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold capitalize">{l.role || '—'}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getActionColor(l.action)}`}>{l.action || '—'}</span>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-slate-600">{l.record_id || '—'}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">
                    {l.old_value && <span>From: {l.old_value}</span>}
                    {l.new_value && <span> → {l.new_value}</span>}
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
