import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_PATIENTS } from '../../data/mockData';
import { formatDate, canEdit } from '../../lib/utils';
import { Search, Plus, Eye, Edit } from 'lucide-react';

const STATUS_KEYS = ['all', 'draft', 'submitted', 'returned', 'approved', 'closed'];

export default function PatientRegistry() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myCases = MOCK_PATIENTS.filter(p => p.supervisorId === 'sup1');

  const filtered = myCases.filter(p => {
    const matchSearch = !search ||
      p.motherDetails.motherName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.motherDetails.contact?.includes(search);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AppLayout title={t('patientRegistry')}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('myPatientRecords')}</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} {t('recordsFound')}</p>
        </div>
        <button
          onClick={() => navigate('/supervisor/patients/new')}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#0F4C75,#1B6CA8)' }}
        >
          <Plus size={16} /> {t('registerNewPatient')}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-6">
        <div className="flex flex-col gap-5">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchByNameUhid')}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {STATUS_KEYS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border-2 transition-all ${
                  statusFilter === s
                    ? 'bg-[#0F4C75] text-white border-[#0F4C75]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {s === 'all' ? t('all') : t(s)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[t('patient'), t('uhid'), t('dob'), t('facility'), t('risk'), t('status'), t('updated'), t('actions')].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-6 py-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-slate-400 text-sm">{t('noRecords')}</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">{t('baby')} {p.motherDetails.motherName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{p.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{p.babyDetails.uhid}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{formatDate(p.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{p.facility}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                      p.riskCategory === 'high' ? 'bg-rose-100 text-rose-700' :
                      p.riskCategory === 'moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>{p.riskCategory}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-4 text-xs text-slate-400">{formatDate(p.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => navigate(`/supervisor/patients/${p.id}`)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title={canEdit(p.status) ? 'Edit' : 'View'}
                      >
                        {canEdit(p.status) ? <Edit size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
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
