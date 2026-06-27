import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_PATIENTS } from '../../data/mockData';
import { formatDate } from '../../lib/utils';
import { Search, Eye, SlidersHorizontal } from 'lucide-react';

const FACILITIES = ['All', 'LR', 'SNCU', 'OBS', 'OPD'];
const STATUS_KEYS = ['all', 'draft', 'submitted', 'returned', 'approved', 'closed'];

export default function AllPatients() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = MOCK_PATIENTS.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      p.motherDetails.motherName.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.babyDetails.uhid.toLowerCase().includes(q) ||
      p.motherDetails.contact?.includes(q) ||
      p.supervisorName?.toLowerCase().includes(q) ||
      p.motherDetails.village?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchFacility = facilityFilter === 'All' || p.facility === facilityFilter;
    return matchSearch && matchStatus && matchFacility;
  });

  return (
    <AppLayout title={t('allPatients')}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('patientRegistry')}</h1>
          <p className="text-slate-500 text-sm">{filtered.length} of {MOCK_PATIENTS.length} records</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal size={15} /> {t('filters')}
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-4 space-y-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchByNameUhid') + ', village, supervisor...'}
            className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{t('status')}</p>
            <div className="flex gap-3 flex-wrap">
              {STATUS_KEYS.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${statusFilter === s ? 'bg-[#0F4C75] text-white border-[#0F4C75]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                  {s === 'all' ? t('all') : t(s)}
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-0 lg:pl-2">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">{t('facility')}</p>
            <div className="flex gap-3 flex-wrap">
              {FACILITIES.map(f => (
                <button key={f} onClick={() => setFacilityFilter(f)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${facilityFilter === f ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[t('patient'), t('uhid'), t('facility'), t('supervisor'), t('risk'), t('status'), t('date'), t('actions')].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">{t('noRecordsMatch')}</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-slate-800">{p.motherDetails.motherName}</p>
                    <p className="text-xs text-slate-400">{p.id}</p>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600 font-mono">{p.babyDetails.uhid}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{p.facility}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-slate-600">{p.supervisorName?.split(' ').slice(0,2).join(' ')}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${p.riskCategory === 'high' ? 'bg-rose-100 text-rose-700' : p.riskCategory === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {p.riskCategory}
                    </span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-xs text-slate-500">{formatDate(p.updatedAt)}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => navigate(`/admin/patients/${p.id}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Eye size={14} />
                    </button>
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
