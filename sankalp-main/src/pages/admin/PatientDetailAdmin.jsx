import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/useAuth';
import { getPatientById, getBabiesByPatient, getFollowupsByPatient, getRemarksByPatient, getAssessmentData, addRemark, updatePatientStatus, addAuditLog, getCallStatusColor } from '../../data/dataStore';
import { formatDateTime, formatDate } from '../../lib/utils';
import FollowupTracker from '../../components/FollowupTracker';
import AssessmentReadOnly from '../../components/Assessment/AssessmentReadOnly';
import {
  ArrowLeft, CheckCircle2, RotateCcw, XCircle, Lock, User, Baby, Heart,
  ClipboardList, ChevronDown, ChevronUp, Phone, MessageSquare
} from 'lucide-react';

export default function PatientDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [patient, setPatient] = useState(null);
  const [patientBabies, setPatientBabies] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [remarks, setRemarksList] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [action, setAction] = useState('');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [newRemark, setNewRemark] = useState('');
  const [done, setDone] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeBabyTab, setActiveBabyTab] = useState(0);

  useEffect(() => {
    if (id) {
      const p = getPatientById(id);
      if (p) setPatient(p);
      setPatientBabies(getBabiesByPatient(id));
      setFollowups(getFollowupsByPatient(id));
      setRemarksList(getRemarksByPatient(id));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const assessmentData = getAssessmentData(id);
      setAssessment(assessmentData);
    }
  }, [id]);

  if (!patient) {
    return (
      <AppLayout title={t('patient')}>
        <div className="text-center py-12 text-slate-400">{t('loading')}</div>
      </AppLayout>
    );
  }

  const isLocked = patient.status === 'approved' || patient.status === 'closed';
  const currentStatus = done ? (action === 'approve' ? 'approved' : action === 'return' ? 'returned' : 'closed') : patient.status;

  const handleAction = () => {
    if (!action) return;
    const newStatus = action === 'approve' ? 'approved' : action === 'return' ? 'returned' : 'closed';
    updatePatientStatus(id, newStatus, user?.id, user?.name, user?.role);
    if (reviewRemarks) {
      addRemark({
        patient_id: id,
        remark_text: reviewRemarks,
        remark_type: 'admin_review',
        added_by_user_id: user?.id,
        added_by_name: user?.name,
        added_by_role: user?.role,
      });
    }
    setDone(true);
  };

  const handleAddRemark = () => {
    if (!newRemark.trim()) return;
    addRemark({
      patient_id: id,
      remark_text: newRemark,
      remark_type: 'admin',
      added_by_user_id: user?.id,
      added_by_name: user?.name,
      added_by_role: user?.role,
    });
    setRemarksList(getRemarksByPatient(id));
    setNewRemark('');
  };

  const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-4">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Icon size={16} className="text-[#0F4C75]" />
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );

  const Field = ({ label, value }) => (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value || '—'}</p>
    </div>
  );

  return (
    <AppLayout title={t('patient')}>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">{patient.mother_name || 'Patient'}</h1>
            <StatusBadge status={currentStatus} />
            {isLocked && <span className="flex items-center gap-1 text-xs text-slate-500"><Lock size={12} /> {t('permanentlyLocked')}</span>}
          </div>
          <p className="text-slate-400 text-sm">ID: {patient.patient_id} · {patient.supervisor_name || '—'} · {patient.counsellor_name || '—'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Section icon={User} title={t('motherDetails')}>
            <Field label={t('motherName')} value={patient.mother_name} />
            <Field label={t('fatherName')} value={patient.father_name} />
            <Field label={t('motherAge')} value={patient.mother_age ? `${patient.mother_age} years` : '—'} />
            <Field label={t('motherMobile')} value={patient.mother_mobile} />
            <Field label={t('alternativeMobile')} value={patient.alternative_mobile} />
            <Field label={t('verifiedMobile')} value={patient.verified_mobile} />
            <Field label={t('village')} value={patient.village} />
            <Field label={t('district')} value={patient.district} />
            <Field label={t('blockName')} value={patient.block_name} />
            <Field label={t('facilityName')} value={patient.facility_name} />
            <Field label={t('ashaWorker')} value={patient.asha_name} />
            <Field label={t('counsellorName')} value={patient.counsellor_name} />
          </Section>

          {/* Baby Details */}
          <Section icon={Baby} title={`${t('babyDetails')} (${patientBabies.length})`}>
            {patientBabies.length > 0 ? (
              <>
                {/* Baby Tabs */}
                {patientBabies.length > 1 && (
                  <div className="col-span-3 flex gap-2 mb-2">
                    {patientBabies.map((b, i) => (
                      <button key={i} onClick={() => setActiveBabyTab(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeBabyTab === i ? 'bg-[#0F4C75] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        Baby {i + 1} ({b.baby_id})
                      </button>
                    ))}
                  </div>
                )}
                {patientBabies[activeBabyTab] && (
                  <>
                    <Field label="Baby ID" value={patientBabies[activeBabyTab].baby_id} />
                    <Field label={t('gender')} value={patientBabies[activeBabyTab].gender} />
                    <Field label="UHID" value={patientBabies[activeBabyTab].uhid} />
                    <Field label={t('gestationalAge')} value={patientBabies[activeBabyTab].gestational_age ? `${patientBabies[activeBabyTab].gestational_age} weeks` : '—'} />
                    <Field label={t('birthWeightGrams')} value={patientBabies[activeBabyTab].birth_weight ? `${patientBabies[activeBabyTab].birth_weight}g` : '—'} />
                    <Field label={t('babyClassification')} value={patientBabies[activeBabyTab].baby_classification} />
                    <Field label="Outcome" value={patientBabies[activeBabyTab].outcome_of_delivery} />
                    <Field label={t('babyCondition')} value={patientBabies[activeBabyTab].baby_condition} />
                    <Field label={t('babyLocation')} value={patientBabies[activeBabyTab].baby_location} />
                  </>
                )}
              </>
            ) : (
              <div className="col-span-3 text-sm text-slate-400 italic">{t('notYetFilled')}</div>
            )}
          </Section>

          {/* Follow-up Tracker */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-4">
            <FollowupTracker
              followups={followups}
              sepsisVisits={assessment?.sepsisVisits || []}
              patient={patient}
            />
          </div>

          {/* Remarks */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <MessageSquare size={16} className="text-[#0F4C75]" />
              <h3 className="font-semibold text-slate-800">{t('remarks')}</h3>
            </div>
            {remarks.length > 0 && (
              <div className="space-y-2 mb-4">
                {remarks.map((r, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-sm text-slate-700">{r.remark_text}</p>
                    <p className="text-xs text-slate-400 mt-1">{r.added_by_name} ({r.added_by_role}) · {formatDateTime(r.created_at)}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={newRemark} onChange={e => setNewRemark(e.target.value)} placeholder={t('addReviewNotes')} className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              <button onClick={handleAddRemark} className="px-4 py-2 bg-[#0F4C75] text-white rounded-xl text-sm font-medium hover:bg-[#0a3254] transition-colors">Add</button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Timeline */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">{t('caseTimeline')}</h3>
            <div className="space-y-3">
              {[
                { label: t('created'), date: patient.created_at, color: 'bg-blue-500' },
                { label: t('submitted'), date: patient.submitted_at || patient.submitted_again_at, color: 'bg-violet-500' },
                { label: t('approved'), date: patient.approved_at, color: 'bg-emerald-500' },
              ].filter(item => item.date).map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.color}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Review Action */}
          {!isLocked && (currentStatus === 'submitted' || currentStatus === 'submitted_again' || currentStatus === 'submitted_to_admin') && !done && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-semibold text-slate-800 mb-4">{t('adminReviewAction')}</h3>
              <div className="space-y-3 mb-4">
                {[
                  { val: 'approve', label: t('approved'), icon: CheckCircle2, color: 'border-emerald-400 bg-emerald-50 text-emerald-700' },
                  { val: 'return', label: t('returned'), icon: RotateCcw, color: 'border-amber-400 bg-amber-50 text-amber-700' },
                  { val: 'close', label: t('closed'), icon: XCircle, color: 'border-slate-300 bg-slate-50 text-slate-600' },
                ].map(opt => (
                  <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${action === opt.val ? opt.color : 'border-slate-100 hover:border-slate-200'}`}>
                    <input type="radio" name="action" value={opt.val} checked={action === opt.val} onChange={() => setAction(opt.val)} className="hidden" />
                    <opt.icon size={16} />
                    <span className="text-sm font-semibold">{opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('remarks')} ({action === 'return' ? 'Required' : 'Optional'})</label>
                <textarea
                  rows={3}
                  value={reviewRemarks}
                  onChange={e => setReviewRemarks(e.target.value)}
                  placeholder={t('addReviewNotes')}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <button
                onClick={handleAction}
                disabled={!action || (action === 'return' && !reviewRemarks.trim())}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all"
                style={{ background: action ? 'linear-gradient(135deg,#0F4C75,#0D9488)' : '#94a3b8' }}
              >
                {t('submitReview')}
              </button>
            </div>
          )}

          {done && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
              <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-emerald-800">{t('reviewSubmitted')}</p>
              <p className="text-emerald-600 text-xs mt-1">{t('caseStatusUpdated')}</p>
            </div>
          )}

          {isLocked && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <Lock size={16} className="text-slate-400" />
              <p className="text-sm text-slate-500">{t('thisCaseLocked')}</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
