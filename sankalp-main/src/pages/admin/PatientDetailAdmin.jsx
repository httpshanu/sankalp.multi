import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { MOCK_PATIENTS } from '../../data/mockData';
import { formatDateTime } from '../../lib/utils';
import { ArrowLeft, CheckCircle2, RotateCcw, XCircle, Lock, User, Baby, Heart } from 'lucide-react';

export default function PatientDetailAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const patient = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];

  const [action, setAction] = useState('');
  const [remarks, setRemarks] = useState('');
  const [done, setDone] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(patient.status);

  const handleAction = () => {
    if (!action) return;
    setCurrentStatus(action === 'approve' ? 'approved' : action === 'return' ? 'returned' : 'closed');
    setDone(true);
  };

  const isLocked = currentStatus === 'approved' || currentStatus === 'closed';

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
            <h1 className="text-xl font-bold text-slate-800">{t('baby')} {patient.motherDetails.motherName}</h1>
            <StatusBadge status={currentStatus} />
            {isLocked && <span className="flex items-center gap-1 text-xs text-slate-500"><Lock size={12} /> {t('permanentlyLocked')}</span>}
          </div>
          <p className="text-slate-400 text-sm">ID: {patient.id} · UHID: {patient.babyDetails.uhid} · {patient.supervisorName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <Section icon={User} title={t('motherDetails')}>
            <Field label={t('motherName')} value={patient.motherDetails.motherName} />
            <Field label={t('fatherName')} value={patient.motherDetails.fatherName} />
            <Field label={t('age')} value={`${patient.motherDetails.age} ${t('years')}`} />
            <Field label={t('contact')} value={patient.motherDetails.contact} />
            <Field label={t('village')} value={patient.motherDetails.village} />
            <Field label={t('ashaWorker')} value={patient.motherDetails.ashaName} />
          </Section>

          <Section icon={Baby} title={t('babyDetails')}>
            <Field label={t('gender')} value={patient.babyDetails.gender} />
            <Field label={t('uhid')} value={patient.babyDetails.uhid} />
            <Field label={t('area')} value={patient.babyDetails.area} />
            <Field label={t('birthWeight')} value={`${patient.babyDetails.birthWeight} ${t('kg')}`} />
            <Field label={t('gestationalAge')} value={`${patient.babyDetails.gestationalAge} ${t('weeks')}`} />
            <Field label={t('admissionLevel')} value={patient.admissionLevel} />
          </Section>

          <Section icon={Heart} title={t('breastfeedingCounselling')}>
            {patient.breastfeeding ? (
              <>
                {[
                  [t('colostrumFeeding'), patient.breastfeeding.colostrum],
                  [t('earlyInitiation'), patient.breastfeeding.earlyInitiation],
                  [t('exclusiveBreastfeeding'), patient.breastfeeding.exclusiveBreastfeeding],
                  [t('correctLatching'), patient.breastfeeding.latching],
                  [t('prelactealFeed'), patient.breastfeeding.prelactealFeed],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
                    <span className={`text-sm font-semibold ${val ? 'text-emerald-600' : 'text-slate-400'}`}>{val ? `✓ ${t('done')}` : `✗ ${t('notDone')}`}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-3 text-sm text-slate-400 italic">{t('notYetFilled')}</div>
            )}
          </Section>

          {patient.adminRemarks && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
              <p className="text-amber-800 text-sm font-semibold mb-1">Admin Remarks (Previous Return)</p>
              <p className="text-amber-700 text-sm">{patient.adminRemarks}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-4">{t('caseTimeline')}</h3>
            <div className="space-y-3">
              {[
                { label: t('created'), date: patient.createdAt, color: 'bg-blue-500' },
                { label: t('submitted'), date: patient.submittedAt, color: 'bg-violet-500' },
                { label: t('approved'), date: patient.approvedAt, color: 'bg-emerald-500' },
              ].filter(t => t.date).map(t => (
                <div key={t.label} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${t.color}`}></div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{t.label}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(t.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isLocked && currentStatus === 'submitted' && !done && (
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
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{t('remarks')} (optional)</label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={t('addReviewNotes')}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
              <button
                onClick={handleAction}
                disabled={!action}
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
