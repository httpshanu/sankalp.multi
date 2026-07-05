import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/useAuth';
import {
  getPatientsByNurse, getBabiesByPatient, getFollowupsByPatient,
  addRemark, canEditRecord
} from '../../data/dataStore';
import { Search, Plus, Eye, Edit, Phone, ChevronDown } from 'lucide-react';

const STATUS_KEYS = ['all', 'with_nurse', 'submitted_to_supervisor', 'returned'];

export default function NurseRegistry() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patients, setPatients] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [remarkInput, setRemarkInput] = useState({});

  useEffect(() => {
    if (user?.id) {
      setPatients(getPatientsByNurse(user.id));
    }
  }, [user]);

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (p.mother_name || '').toLowerCase().includes(q) ||
      (p.patient_id || '').toLowerCase().includes(q) ||
      (p.mother_mobile || '').includes(q) ||
      (p.father_name || '').toLowerCase().includes(q) ||
      (p.village || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAddRemark = (patientId) => {
    const text = remarkInput[patientId];
    if (!text?.trim()) return;
    addRemark({
      patient_id: patientId,
      remark_text: text,
      remark_type: 'nurse',
      added_by_user_id: user?.id,
      added_by_name: user?.name,
      added_by_role: user?.role,
    });
    setRemarkInput(prev => ({ ...prev, [patientId]: '' }));
  };

  const getFollowupStatusSummary = (patientId) => {
    const fups = getFollowupsByPatient(patientId);
    if (fups.length === 0) return '—';
    const completed = fups.filter(f => f.completed_at).length;
    return `${completed}/${fups.length}`;
  };

  return (
    <AppLayout title={t('patientRegistry')}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('myRegistrations')}</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} {t('recordsFound')}</p>
        </div>
        <button
          onClick={() => navigate('/nurse/patients/new')}
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
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('patientID')}</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('motherName')}</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('fatherName')}</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('contact')}</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('facility')}</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('babyCount')}</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('status')}</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide px-4 py-3">{t('actions')}</th>
              </tr>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th colSpan="8" className="px-4 py-2 text-xs text-slate-500">{t('clickToExpandDetails')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-slate-400 text-sm">{t('noRecords')}</td></tr>
              ) : filtered.map(p => {
                const isExpanded = expandedRow === p.id;
                const babyCount = p.baby_count || 1;
                const canEdit = canEditRecord(p.status, user?.role, user);
                return (
                  <Fragment key={p.id}>
                    {/* Main row */}
                    <tr
                      className={`cursor-pointer hover:bg-slate-50/70 transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}
                      onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                    >
                      <td className="px-4 py-3 text-xs font-mono text-slate-600">{p.patient_id}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-slate-800">{p.mother_name || '—'}</p>
                        <p className="text-xs text-slate-400">{p.village || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">{p.father_name || '—'}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-slate-600">{p.mother_mobile || '—'}</p>
                        {p.alternative_mobile && (
                          <p className="text-xs text-slate-400">Alt: {p.alternative_mobile}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{p.facility_name || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-700">{babyCount} {babyCount === 1 ? 'Baby' : 'Babies'}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {canEdit && (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/nurse/patients/${p.id}/edit`); }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                          )}
                          {!canEdit && (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/nurse/patients/${p.id}`); }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          {p.mother_mobile && (
                            <a href={`tel:${p.mother_mobile}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Call">
                              <Phone size={14} />
                            </a>
                          )}
                          <button
                            onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Details"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded row for details */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="px-4 pt-0 pb-4">
                          <div className="bg-slate-50 rounded-xl p-4">
                            <div className="space-y-4">
                              {/* Basic Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('fatherName')}:</p>
                                  <p className="text-sm text-slate-600">{p.father_name || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('district')}:</p>
                                  <p className="text-sm text-slate-600">{p.district || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('blockName')}:</p>
                                  <p className="text-sm text-slate-600">{p.block_name || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('village')}:</p>
                                  <p className="text-sm text-slate-600">{p.village || '—'}</p>
                                </div>
                              </div>

                              {/* Contact Info */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('motherMobile')}:</p>
                                  <p className="text-sm text-slate-600">{p.mother_mobile || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('alternativeMobile')}:</p>
                                  <p className="text-sm text-slate-600">{p.alternative_mobile || '—'}</p>
                                </div>
                              </div>

                              {/* Baby Details */}
                              {p.babies?.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-slate-700 mb-2">{t('babyDetails')}:</p>
                                  <div className="space-y-2">
                                    {p.babies.map((baby, idx) => (
                                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                        <span className="font-medium">{baby.baby_id || `Baby ${baby.baby_number}`}:</span>
                                        <span>
                                          <span className="mr-2 capitalize">{baby.gender === 'male' ? t('male') : t('female')}</span>
                                          {baby.gestational_age && <span className="mr-2">{baby.gestational_age} {t('weeks')}</span>}
                                          {baby.birth_weight && <span>{baby.birth_weight} {t('grams')}</span>}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Remarks Section */}
                              <div>
                                <p className="text-sm font-medium text-slate-700 mb-2">{t('remarks')}:</p>
                                <div className="flex gap-2">
                                  <input
                                    value={remarkInput[p.id] || ''}
                                    onChange={(e) => setRemarkInput(prev => ({ ...prev, [p.id]: e.target.value }))}
                                    placeholder={t('addRemark')}
                                    className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleAddRemark(p.id); }}
                                    className="px-3 py-2 bg-[#0F4C75] text-white rounded-xl text-sm font-semibold hover:bg-[#0a3254] transition-colors"
                                  >
                                    {t('add')}
                                  </button>
                                </div>
                              </div>

                              {/* Follow-up Status */}
                              <div>
                                <p className="text-sm font-medium text-slate-700">{t('followUpStatus')}: {getFollowupStatusSummary(p.id)}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
