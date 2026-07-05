import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/useAuth';
import {
  getPatientsByCounsellor, getBabiesByPatient, getFollowupsByPatient,
  addRemark, getCallStatusColor
} from '../../data/dataStore';
import { Search, Plus, Eye, Edit, Phone, MessageSquare, ChevronDown } from 'lucide-react';

const STATUS_KEYS = ['all', 'draft', 'submitted', 'returned', 'approved', 'closed'];

export default function CounsellorRegistry() {
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
      setPatients(getPatientsByCounsellor(user.id));
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
      remark_type: 'counsellor',
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

  const getCallStatusSummary = (patientId) => {
    const fups = getFollowupsByPatient(patientId);
    if (fups.length === 0) return null;
    const statuses = fups.map(f => f.call_status);
    if (statuses.every(s => s === 'connected' || s === 'completed')) return { label: 'All Connected', color: 'bg-green-100 text-green-700' };
    if (statuses.some(s => s === 'invalid_number' || s === 'wrong_number')) return { label: 'Invalid Number', color: 'bg-red-100 text-red-700' };
    if (statuses.some(s => s === 'not_connected' || s === 'switched_off')) return { label: 'Not Connected', color: 'bg-orange-100 text-orange-700' };
    return { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' };
  };

  return (
    <AppLayout title={t('patientRegistry')}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t('myRegistrations')}</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} {t('recordsFound')}</p>
        </div>
        <button
          onClick={() => navigate('/counsellor/patients/new')}
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
                const isExpandable = true;
                return (
                  <>
                    {/* Main row */}
                    <tr
                      key={p.id}
                      className={`cursor-pointer hover:bg-slate-50/70 transition-colors ${isExpanded ? 'bg-blue-50' : ''}`}
                      onClick={() => {
                        if (isExpandable) {
                          setExpandedRow(expandedRow === p.id ? null : p.id);
                        }
                      }}
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
                          {canEdit(p.status) && (
                            <button
                              onClick={() => navigate(`/counsellor/patients/${p.id}/edit`)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                          )}
                          {!canEdit(p.status) && (
                            <button
                              onClick={() => navigate(`/counsellor/patients/${p.id}`)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          {p.mother_mobile && (
                            <a href={`tel:${p.mother_mobile}`} className="p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors" title="Call">
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
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('verifiedMobile')}:</p>
                                  <p className="text-sm text-slate-600">
                                    {p.verified_mobile === 'motherNumber' ? t('motherNumber') : p.verified_mobile === 'alternativeNumber' ? t('alternativeNumber') : t('other')}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('contactVerificationStatus')}:</p>
                                  <p className="text-sm text-slate-600">
                                    {p.contact_verification_status === 'verified' ? t('verified') : t('not_verified')}
                                  </p>
                                </div>
                              </div>

                              {/* ASHA/ANM */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('ashaName')}:</p>
                                  <p className="text-sm text-slate-600">{p.asha_name || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('ashaMobile')}:</p>
                                  <p className="text-sm text-slate-600">{p.asha_mobile || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('anmName')}:</p>
                                  <p className="text-sm text-slate-600">{p.anm_name || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('anmMobile')}:</p>
                                  <p className="text-sm text-slate-600">{p.anm_mobile || '—'}</p>
                                </div>
                              </div>

                              {/* Assessor & Mother Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('assessorName')}:</p>
                                  <p className="text-sm text-slate-600">{p.assessor_name || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('motherAge')}:</p>
                                  <p className="text-sm text-slate-600">{p.mother_age || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('gravida')}:</p>
                                  <p className="text-sm text-slate-600">{p.gravida || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('para')}:</p>
                                  <p className="text-sm text-slate-600">{p.para || '—'}</p>
                                </div>
                              </div>

                              {/* LMP & HRP */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('lmp')}:</p>
                                  <p className="text-sm text-slate-600">{p.lmp || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('wasMotherHRP')}:</p>
                                  <p className="text-sm text-slate-600">
                                    {p.hrp_status === 'yes' ? t('yes') : t('no')}
                                  </p>
                                </div>
                                {p.hrp_status === 'yes' && (
                                  <div className="col-span-2">
                                    <p className="text-sm font-medium text-slate-700">{t('hrpType')}:</p>
                                    <p className="text-sm text-slate-600">{p.hrp_type || '—'}</p>
                                  </div>
                                )}
                              </div>

                              {/* Registration Remarks */}
                              <div className="mb-4">
                                <p className="text-sm font-medium text-slate-700">{t('registrationRemarks')}:</p>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{p.registration_remarks || '—'}</p>
                              </div>

                              {/* Baby Details */}
                              <div className="mb-4">
                                <p className="text-sm font-medium text-slate-700">{t('babyDetails')}:</p>
                                <div className="space-y-2">
                                  {p.babies?.map((baby, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                                      <span className="font-medium">{baby.baby_id || `Baby ${baby.baby_number}`}:</span>
                                      <span className="flex-1">
                                        <span className="mr-2">{baby.gender === 'male' ? t('male') : t('female')}</span>
                                        {baby.gestational_age && (
                                          <>
                                            {baby.gestational_age}{' '}
                                            {t('weeks')}
                                          </>
                                        )}
                                        {baby.birth_weight && (
                                          <>
                                            {baby.birth_weight}{' '}
                                            {t('grams')}
                                          </>
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Counsellor & Supervisor */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('counsellorName')}:</p>
                                  <p className="text-sm text-slate-600">{p.counsellor_name || '—'}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-slate-700">{t('supervisorName')}:</p>
                                  <p className="text-sm text-slate-600">{p.supervisor_name || '—'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
