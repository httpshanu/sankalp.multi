import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import StatusBadge from '../../components/patient/StatusBadge';
import { useLanguage } from '../../context/useLanguage';
import { useAuth } from '../../context/useAuth';
import {
  getPatientById, getBabiesByPatient, getAssessmentData, getFollowupsByPatient,
} from '../../data/dataStore';
import AssessmentReadOnly from '../../components/Assessment/AssessmentReadOnly';
import FollowupTracker from '../../components/FollowupTracker';
import {
  ArrowLeft, Lock, User, Baby, Heart, Save, ClipboardList, ChevronDown, ChevronUp, Phone, MessageSquare, Send
} from 'lucide-react';

export default function SupervisorPatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [patient, setPatient] = useState(null);
  const [patientBabies, setPatientBabies] = useState([]);
  const [assessment, setAssessment] = useState(null);
  const [followups, setFollowups] = useState([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [activeBabyTab, setActiveBabyTab] = useState(0);

  useEffect(() => {
    if (id) {
      const p = getPatientById(id);
      if (p) setPatient(p);
      setPatientBabies(getBabiesByPatient(id));
      setFollowups(getFollowupsByPatient(id));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const data = getAssessmentData(id);
      if (data) setAssessment(data);
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
  const canEdit = patient.status === 'draft' || patient.status === 'returned';

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

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <AppLayout title={t('patient')}>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-slate-800">{patient.mother_name || 'Patient'}</h1>
            <StatusBadge status={patient.status} />
            {isLocked && <span className="flex items-center gap-1 text-xs text-slate-500"><Lock size={12} /> {t('permanentlyLocked')}</span>}
            {!isLocked && canEdit && (
              <button onClick={() => navigate(`/supervisor/patients/${id}/edit`)}
                className="px-3 py-1 rounded-lg text-xs font-semibold border transition-all hover:bg-slate-50"
              >
                {t('edit')}
              </button>
            )}
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
            <Field label={t('verifiedMobile')} value={
              patient.verified_mobile === 'motherNumber' ? t('motherNumber') :
                patient.verified_mobile === 'alternativeNumber' ? t('alternativeNumber') : t('other')
            } />
            <Field label={t('contactVerificationStatus')} value={
              patient.contact_verification_status === 'verified' ? t('verified') : t('not_verified')
            } />
            <Field label={t('village')} value={patient.village} />
            <Field label={t('district')} value={patient.district} />
            <Field label={t('blockName')} value={patient.block_name} />
            <Field label={t('facilityName')} value={patient.facility_name} />
            <Field label={t('otherFacilityName')} value={patient.other_facility_name || '—'} />
            <Field label={t('ashaName')} value={patient.asha_name} />
            <Field label={t('ashaMobile')} value={patient.asha_mobile} />
            <Field label={t('anmName')} value={patient.anm_name} />
            <Field label={t('anmMobile')} value={patient.anm_mobile} />
            <Field label={t('assessorName')} value={patient.assessor_name} />
            <Field label={t('motherAge')} value={patient.mother_age} />
            <Field label={t('gravida')} value={patient.gravida} />
            <Field label={t('para')} value={patient.para} />
            <Field label={t('lmp')} value={patient.lmp ? formatDateTime(patient.lmp) : '—'} />
            <Field label={t('wasMotherHRP')} value={patient.hrp_status === 'yes' ? t('yes') : t('no')} />
            {patient.hrp_status === 'yes' && (
              <Field label={t('hrpType')} value={patient.hrp_type || '—'} />
            )}
            <Field label={t('registrationRemarks')} value={patient.registration_remarks || '—'} />
          </Section>

          {/* Baby Details */}
          <Section icon={Baby} title={`${t('babyDetails')} (${patientBabies.length})`}>
            {patientBabies.length > 0 ? (
              <>
                {/* Baby Tabs */}
                {patientBabies.length > 1 && (
                  <div className="col-span-3 flex gap-2 mb-2">
                    {patientBabies.map((baby, index) => (
                      <button key={index} onClick={() => setActiveBabyTab(index)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeBabyTab === index ? 'bg-[#0F4C75] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        Baby {index + 1} ({baby.baby_id})
                      </button>
                    ))}
                  </div>
                )}
                {patientBabies[activeBabyTab] && (
                  <>
                    <Field label="Baby ID" value={patientBabies[activeBabyTab].baby_id} />
                    <Field label={t('gender')} value={patientBabies[activeBabyTab].gender} />
                    <Field label="UHID" value={patientBabies[activeBabyTab].uhid} />
                    <Field label={t('gestationalAgeWeeks')} value={patientBabies[activeBabyTab].gestational_age ? `${patientBabies[activeBabyTab].gestational_age} weeks` : '—'} />
                    <Field label={t('birthWeightGrams')} value={patientBabies[activeBabyTab].birth_weight ? `${patientBabies[activeBabyTab].birth_weight}g` : '—'} />
                    <Field label={t('babyClassification')} value={patientBabies[activeBabyTab].baby_classification} />
                    <Field label="Outcome of Delivery" value={patientBabies[activeBabyTab].outcome_of_delivery} />
                    <Field label={t('babyCondition')} value={patientBabies[activeBabyTab].baby_condition} />
                    <Field label={t('babyLocation')} value={patientBabies[activeBabyTab].baby_location} />
                    <Field label={t('criedImmediately')} value={patientBabies[activeBabyTab].cried_immediately ? t('yes') : t('no')} />
                    <Field label={t('requiredResuscitation')} value={patientBabies[activeBabyTab].required_resuscitation ? t('yes') : t('no')} />
                    <Field label={t('driedImmediately')} value={patientBabies[activeBabyTab].dried_immediately ? t('yes') : t('no')} />
                    <Field label={t('delayedCordClamping')} value={patientBabies[activeBabyTab].delayed_cord_clamping ? t('yes') : t('no')} />
                    <Field label={t('skinToSkinContact')} value={patientBabies[activeBabyTab].skin_to_skin_contact ? t('yes') : t('no')} />
                    <Field label={t('breastfeedingWithin1Hour')} value={patientBabies[activeBabyTab].breastfeeding_within_1_hour ? t('yes') : t('no')} />
                    <Field label={t('babySeparatedFromMother')} value={patientBabies[activeBabyTab].separated_from_mother ? t('yes') : t('no')} />
                  </>
                )}
              </>
            ) : (
              <div className="col-span-3 text-sm text-slate-400 italic">{t('noBabyData')}</div>
            )}
          </Section>

          {/* Assessment Tool - All Sections A-J */}
          {assessment ? (
            <div className="mb-4">
              <button
                onClick={() => setShowAssessment(s => !s)}
                className="w-full flex items-center justify-between px-5 py-3.5 bg-white rounded-xl border border-slate-200 shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-[#0F4C75]" />
                  <span>Individual Mother–Newborn Assessment Tool (Sections A–J)</span>
                </div>
                {showAssessment ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showAssessment && (
                <div className="mt-3">
                  <AssessmentReadOnly assessment={assessment} t={t} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 flex items-center gap-3">
              <ClipboardList size={16} className="text-slate-400" />
              <p className="text-sm text-slate-500">Assessment tool not yet filled for this patient.</p>
            </div>
          )}

          {/* Follow-up Tracker */}
          <FollowupTracker
            followups={followups}
            sepsisVisits={assessment?.sepsisVisits || []}
            patient={patient}
          />
        </div>

        <div className="xl:col-span-1">
          <Section icon={Heart} title={t('vitalSigns')}>
            <Field label={t('temperature')} value={patient.vital_signs?.temperature ? `${patient.vital_signs?.temperature} ${t('celsius')}` : '—'} />
            <Field label={t('heartRate')} value={patient.vital_signs?.heart_rate ? `${patient.vital_signs?.heart_rate} ${t('bpm')}` : '—'} />
            <Field label={t('respiratoryRate')} value={patient.vital_signs?.respiratory_rate ? `${patient.vital_signs?.respiratory_rate} ${t('rpm')}` : '—'} />
            <Field label={t('oxygenSaturation')} value={patient.vital_signs?.oxygen_saturation ? `${patient.vital_signs?.oxygen_saturation}%` : '—'} />
          </Section>

          <Section icon={Heart} title={t('riskAssessment')}>
            <Field label={t('riskLevel')} value={patient.risk_category} />
            {patient.risk_tags && patient.risk_tags.length > 0 ? (
              <div className="space-y-1">
                {patient.risk_tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">{t('none')}</p>
            )}
          </Section>

          {/* Follow-up Summary */}
          {followups.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <MessageSquare size={16} className="text-[#0F4C75]" />
                <h3 className="font-semibold text-slate-800">{t('followupSummary')}</h3>
              </div>
              <div className="space-y-2">
                {followups.map((f, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 {f.call_status === 'connected' ? 'bg-green-500' : f.call_status === 'pending' ? 'bg-yellow-500' : f.call_status === 'overdue' ? 'bg-red-500' : f.call_status === 'not_connected' || f.call_status === 'switched_off' ? 'bg-orange-500' : 'bg-gray-500'}"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{t(`day${f.followup_day}`)}:</p>
                      <p className="text-sm text-slate-600">
                        {f.call_status === 'connected' ? t('connected') :
                          f.call_status === 'pending' ? t('pending') :
                          f.call_status === 'overdue' ? t('overdue') :
                          f.call_status === 'not_connected' ? t('notConnected') :
                          f.call_status === 'switched_off' ? t('switchedOff') :
                          f.call_status === 'invalid_number' ? t('invalidNumber') :
                          f.call_status === 'wrong_number' ? t('wrongNumber') : '—'}
                        {f.call_date_time && (
                          <span className="ml-2 text-xs text-slate-400">
                            {formatDateTime(f.call_date_time)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {!isLocked && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t('actionsAvailable')}</h2>
          <div className="space-y-3">
            {patient.status === 'draft' && (
              <button onClick={() => {
                // Update status to submitted
                const updatedPatient = { ...patient, status: 'submitted' };
                // We would need to update the patient in the dataStore, but for now we just show a message
                alert('Patient submitted for review. In a real app, this would update the status.');
              }}
                className="w-full flex items-center justify-between px-5 py-3 bg-gradient text-sm hover:bg-green-700"
              >
                <span>{t('submitForReview')}</span>
                <Send size={16} />
              </button>
            )}
            {patient.status === 'returned' && (
              <button onClick={() => {
                // Update status to submitted_again
                const updatedPatient = { ...patient, status: 'submitted_again' };
                alert('Patient resubmitted for review. In a real app, this would update the status.');
              }}
                className="w-full flex items-center justify-between px-5 py-3 bg-gradient text-sm hover:bg-green-700"
              >
                <span>{t('resubmitForReview')}</span>
                <Send size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
