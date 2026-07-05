import { useState } from 'react';
import { X, Phone, PhoneOff } from 'lucide-react';
import { upsertFollowup, addAuditLog } from '../data/dataStore';
import { useLanguage } from '../context/useLanguage';

const CALL_STATUSES = [
  { value: 'connected', label: 'Connected', key: 'callConnected', color: 'bg-green-100 text-green-700 border-green-300' },
  { value: 'not_connected', label: 'Not Connected', key: 'callNotConnected', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'switched_off', label: 'Switched Off', key: 'switchedOff', color: 'bg-orange-100 text-orange-700 border-orange-300' },
  { value: 'invalid_number', label: 'Invalid Number', key: 'invalidNumber', color: 'bg-red-100 text-red-700 border-red-300' },
  { value: 'wrong_number', label: 'Wrong Number', key: 'wrongNumber', color: 'bg-red-100 text-red-700 border-red-300' },
];

const BREASTFEEDING_STATUS = [
  { value: 'Good', key: 'goodBf' },
  { value: 'Poor', key: 'poorBf' },
  { value: 'Not Feeding', key: 'notFeeding' },
  { value: 'Mixed Feeding', key: 'mixedFeeding' },
];
const FEEDING_PATTERN = [
  { value: 'Exclusive Breastfeeding', key: 'exclusiveBreastfeeding' },
  { value: 'Formula', key: 'formula' },
  { value: 'Mixed', key: 'mixed' },
  { value: 'Other', key: 'other' },
];
const KMC_STATUS_OPTIONS = [
  { value: 'Continuing', key: 'continuing' },
  { value: 'Stopped', key: 'stopped' },
  { value: 'Not Applicable', key: 'kmcNotApplicable' },
];

export default function FollowupCallModal({ followup, patient, onClose, onSave }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState(followup.call_status === 'pending' ? '' : followup.call_status);
  const [callDateTime, setCallDateTime] = useState(followup.call_datetime || new Date().toISOString().slice(0, 16));
  const [calledNumber, setCalledNumber] = useState(followup.called_number || patient?.mother_mobile || '');
  const [bfStatus, setBfStatus] = useState(followup.breastfeeding_status || '');
  const [feedingPattern, setFeedingPattern] = useState(followup.feeding_pattern || '');
  const [kmcStatus, setKmcStatus] = useState(followup.kmc_status || '');
  const [dangerSigns, setDangerSigns] = useState(followup.danger_signs_present || null);
  const [referralRequired, setReferralRequired] = useState(followup.referral_required || null);
  const [referralDone, setReferralDone] = useState(followup.referral_done || null);
  const [remarks, setRemarks] = useState(followup.remarks || '');

  const handleSave = () => {
    const updated = {
      ...followup,
      call_status: status || 'pending',
      call_attempt_count: (followup.call_attempt_count || 0) + 1,
      call_datetime: callDateTime,
      called_number: calledNumber,
      breastfeeding_status: bfStatus || null,
      feeding_pattern: feedingPattern || null,
      kmc_status: kmcStatus || null,
      danger_signs_present: dangerSigns,
      referral_required: referralRequired,
      referral_done: referralDone,
      remarks,
      completed_by: patient?.supervisor_id,
    };
    if (status === 'connected') {
      updated.completed_at = new Date().toISOString();
    }
    upsertFollowup(updated);
    addAuditLog({
      user_id: patient?.supervisor_id,
      user_name: patient?.supervisor_name,
      role: 'supervisor',
      action: `followup_day_${followup.followup_day}_${status}_referral_${referralRequired ? 'yes' : 'no'}_done_${referralDone ? 'yes' : 'no'}`,
      record_id: patient?.id,
      baby_id: null,
      old_value: followup.call_status,
      new_value: status,
    });
    onSave(updated);
    onClose();
  };

  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{t('day')} {followup.followup_day} {t('followUpNoun')}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
          {/* Call Buttons */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('callPatient')}</label>
            <div className="flex gap-3">
              {patient?.mother_mobile && (
                <button onClick={() => handleCall(patient.mother_mobile)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors">
                  <Phone size={14} /> {t('mother')}: {patient.mother_mobile}
                </button>
              )}
              {patient?.alternative_mobile && (
                <button onClick={() => handleCall(patient.alternative_mobile)} className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                  <Phone size={14} /> {t('alt')}: {patient.alternative_mobile}
                </button>
              )}
            </div>
          </div>

          {/* Call Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('callStatus')}</label>
            <div className="grid grid-cols-2 gap-2">
              {CALL_STATUSES.map(cs => (
                <button key={cs.value} onClick={() => setStatus(cs.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${status === cs.value ? cs.color : 'bg-white text-slate-500 border-slate-200'}`}>
                  {t(cs.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Called Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('calledNumber')}</label>
            <input type="tel" value={calledNumber} onChange={e => setCalledNumber(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          {/* Call Date/Time */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('callDateTime')}</label>
            <input type="datetime-local" value={callDateTime} onChange={e => setCallDateTime(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>

          {/* BF Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('breastfeedingStatus')}</label>
            <div className="flex gap-2 flex-wrap">
              {BREASTFEEDING_STATUS.map(s => (
                <button key={s.key} onClick={() => setBfStatus(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${bfStatus === s.value ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {t(s.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Feeding Pattern */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('feedingPattern')}</label>
            <div className="flex gap-2 flex-wrap">
              {FEEDING_PATTERN.map(f => (
                <button key={f.key} onClick={() => setFeedingPattern(f.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${feedingPattern === f.value ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {t(f.key)}
                </button>
              ))}
            </div>
          </div>

          {/* KMC Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('kmcStatusFollowup')}</label>
            <div className="flex gap-2 flex-wrap">
              {KMC_STATUS_OPTIONS.map(k => (
                <button key={k.key} onClick={() => setKmcStatus(k.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${kmcStatus === k.value ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                  {t(k.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Danger Signs */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('dangerSignsPresent')}</label>
            <div className="flex gap-3">
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setDangerSigns(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${dangerSigns === v ? (v ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-green-100 text-green-700 border-green-300') : 'bg-white text-slate-500 border-slate-200'}`}>
                  {v ? t('yes') : t('no')}
                </button>
              ))}
            </div>
          </div>

          {/* Referral Required */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">{t('referralRequired')}</label>
            <div className="flex gap-3">
              {[true, false].map(v => (
                <button key={String(v)} onClick={() => setReferralRequired(v)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${referralRequired === v ? (v ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-green-100 text-green-700 border-green-300') : 'bg-white text-slate-500 border-slate-200'}`}>
                  {v ? t('yes') : t('no')}
                </button>
              ))}
            </div>
          </div>

          {/* Referral Done (only shown if required is yes) */}
          {referralRequired && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('referralDone')}</label>
              <div className="flex gap-3">
                {[true, false].map(v => (
                  <button key={String(v)} onClick={() => setReferralDone(v)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${referralDone === v ? (v ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-green-100 text-green-700 border-green-300') : 'bg-white text-slate-500 border-slate-200'}`}>
                    {v ? t('yes') : t('no')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">{t('remarks')}</label>
            <textarea rows={3} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder={t('addCallRemarks')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">{t('cancel')}</button>
          <button onClick={handleSave} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[#0F4C75] hover:bg-[#0a3254] transition-colors">{t('saveFollowup')}</button>
        </div>
      </div>
    </div>
  );
}

// Sepsis Follow-up Modal for editing sepsis visit details
export function SepsisFollowupModal({ visit, patient, onClose, onSave }) {
  const { t } = useLanguage();
  const [actualDate, setActualDate] = useState(visit.actualDate || '');
  const [visitCompleted, setVisitCompleted] = useState(visit.visitCompleted || false);
  const [visitType, setVisitType] = useState(visit.visitType || '');
  const [conductedBy, setConductedBy] = useState(visit.conductedBy || '');
  const [remarks, setRemarks] = useState(visit.remarks || '');

  // Sepsis signs
  const [allLimbsLimp, setAllLimbsLimp] = useState(visit.sepsisSigns?.allLimbsLimp || false);
  const [feedingLessOrStopped, setFeedingLessOrStopped] = useState(visit.sepsisSigns?.feedingLessOrStopped || false);
  const [cryWeakOrStopped, setCryWeakOrStopped] = useState(visit.sepsisSigns?.cryWeakOrStopped || false);
  const [distendedAbdomenOrVomiting, setDistendedAbdomenOrVomiting] = useState(visit.sepsisSigns?.distendedAbdomenOrVomiting || false);
  const [coldToTouchOrFever, setColdToTouchOrFever] = useState(visit.sepsisSigns?.coldToTouchOrFever || false);
  const [chestIndrawing, setChestIndrawing] = useState(visit.sepsisSigns?.chestIndrawing || false);
  const [respiratoryRateAbove60, setRespiratoryRateAbove60] = useState(visit.sepsisSigns?.respiratoryRateAbove60 || false);
  const [pusOnUmblicus, setPusOnUmblicus] = useState(visit.sepsisSigns?.pusOnUmblicus || false);

  // Referral fields
  const [immediateReferralRequired, setImmediateReferralRequired] = useState(visit.immediateReferralRequired || false);
  const [referralAdvised, setReferralAdvised] = useState(visit.referralAdvised || false);
  const [babyReferred, setBabyReferred] = useState(visit.babyReferred || false);
  const [referralFacility, setReferralFacility] = useState(visit.referralFacility || '');
  const [referralDateTime, setReferralDateTime] = useState(visit.referralDateTime || '');
  const [actionTaken, setActionTaken] = useState(visit.actionTaken || '');
  const [currentBabyStatus, setCurrentBabyStatus] = useState(visit.currentBabyStatus || '');

  // Supervisor review
  const [supervisorReviewStatus, setSupervisorReviewStatus] = useState(visit.supervisorReviewStatus || 'pending');
  const [supervisorWorkAssessment, setSupervisorWorkAssessment] = useState(visit.supervisorWorkAssessment || '');
  const [supervisorNote, setSupervisorNote] = useState(visit.supervisorNote || '');
  const [supervisorRemarks, setSupervisorRemarks] = useState(visit.supervisorRemarks || '');
  const [visitRemarks, setVisitRemarks] = useState(visit.visitRemarks || '');

  // ASHA details
  const [ashaName, setAshaName] = useState(visit.ashaName || '');
  const [ashaUserId, setAshaUserId] = useState(visit.ashaUserId || '');
  const [ashaRemarks, setAshaRemarks] = useState(visit.ashaRemarks || '');
  const [ashaSignatureUrl, setAshaSignatureUrl] = useState(visit.ashaSignatureUrl || '');
  const [visitCompletedByAsha, setVisitCompletedByAsha] = useState(visit.visitCompletedByAsha || false);

  // Facilitator/ANM review
  const [facilitatorAnmName, setFacilitatorAnmName] = useState(visit.facilitatorAnmName || '');
  const [facilitatorAnmObservations, setFacilitatorAnmObservations] = useState(visit.facilitatorAnmObservations || '');
  const [facilitatorAnmSignatureUrl, setFacilitatorAnmSignatureUrl] = useState(visit.facilitatorAnmSignatureUrl || '');
  const [verificationStatus, setVerificationStatus] = useState(visit.facilitatorAnmVerificationStatus || 'pending');

  // ANM/Vaccination (mainly for day 42)
  const [anmName, setAnmName] = useState(visit.anmName || '');
  const [dpt1Received, setDpt1Received] = useState(visit.dpt1Received || false);
  const [dpt1Date, setDpt1Date] = useState(visit.dpt1Date || '');
  const [ageAtDpt1Days, setAgeAtDpt1Days] = useState(visit.ageAtDpt1Days || '');
  const [manualAgeCorrection, setManualAgeCorrection] = useState(visit.manualAgeCorrection || '');
  const [anmObservations, setAnmObservations] = useState(visit.anmObservations || '');
  const [anmSignatureUrl, setAnmSignatureUrl] = useState(visit.anmSignatureUrl || '');

  const isDay42 = visit?.visitDay === 42;

  const handleSave = () => {
    // Update sepsis signs
    const sepsisSigns = {
      allLimbsLimp,
      feedingLessOrStopped,
      cryWeakOrStopped,
      distendedAbdomenOrVomiting,
      coldToTouchOrFever,
      chestIndrawing,
      respiratoryRateAbove60,
      pusOnUmblicus
    };

    const updatedVisit = {
      ...visit,
      actualDate,
      visitCompleted,
      visitType,
      conductedBy,
      remarks,
      sepsisSigns,
      immediateReferralRequired,
      referralAdvised,
      babyReferred,
      referralFacility: babyReferred ? referralFacility : '',
      referralDateTime: babyReferred ? referralDateTime : '',
      actionTaken: babyReferred ? actionTaken : '',
      currentBabyStatus: babyReferred ? currentBabyStatus : '',
      supervisorReviewStatus,
      supervisorWorkAssessment,
      supervisorNote,
      supervisorRemarks,
      ashaName: ashaName || '',
      ashaUserId: ashaUserId || '',
      ashaRemarks: ashaRemarks || '',
      ashaSignatureUrl: ashaSignatureUrl || '',
      visitCompletedByAsha,
      facilitatorAnmName: facilitatorAnmName || '',
      facilitatorAnmObservations: facilitatorAnmObservations || '',
      facilitatorAnmSignatureUrl: facilitatorAnmSignatureUrl || '',
      facilitatorAnmVerificationStatus: verificationStatus,
      ...(isDay42 && {
        anmName: anmName || '',
        dpt1Received,
        dpt1Date: dpt1Received ? dpt1Date : '',
        ageAtDpt1Days,
        manualAgeCorrection,
        anmObservations: anmObservations || '',
        anmSignatureUrl: anmSignatureUrl || ''
      })
    };

    // Add audit log
    addAuditLog({
      user_id: patient?.supervisor_id,
      user_name: patient?.supervisor_name,
      role: 'supervisor',
      action: `sepsis_visit_day_${visit.visitDay}_${visitCompleted ? 'completed' : 'updated'}`,
      record_id: patient?.id,
      baby_id: visit.baby_id || null,
      old_value: visit,
      new_value: updatedVisit,
    });

    onSave(updatedVisit);
    onClose();
  };

  const handleSaveSepsis = () => {
    const sepsisSigns = {
      allLimbsLimp,
      feedingLessOrStopped,
      cryWeakOrStopped,
      distendedAbdomenOrVomiting,
      coldToTouchOrFever,
      chestIndrawing,
      respiratoryRateAbove60,
      pusOnUmblicus
    };

    const updatedVisit = {
      ...visit,
      actualDate,
      visitCompleted,
      visitType,
      conductedBy,
      remarks,
      visitRemarks,
      sepsisSigns,
      immediateReferralRequired,
      referralAdvised,
      babyReferred,
      referralFacility: babyReferred ? referralFacility : '',
      referralDateTime: babyReferred ? referralDateTime : '',
      actionTaken: babyReferred ? actionTaken : '',
      currentBabyStatus: babyReferred ? currentBabyStatus : '',
      supervisorReviewStatus,
      supervisorWorkAssessment,
      supervisorNote,
      supervisorRemarks,
      ashaName: ashaName || '',
      ashaUserId: ashaUserId || '',
      ashaRemarks: ashaRemarks || '',
      ashaSignatureUrl: ashaSignatureUrl || '',
      visitCompletedByAsha,
      facilitatorAnmName: facilitatorAnmName || '',
      facilitatorAnmObservations: facilitatorAnmObservations || '',
      facilitatorAnmSignatureUrl: facilitatorAnmSignatureUrl || '',
      facilitatorAnmVerificationStatus: verificationStatus,
      anmName: anmName || '',
      dpt1Received,
      dpt1Date: dpt1Received ? dpt1Date : '',
      ageAtDpt1Days,
      manualAgeCorrection,
      anmObservations: anmObservations || '',
      anmSignatureUrl: anmSignatureUrl || ''
    };

    addAuditLog({
      user_id: patient?.supervisor_id,
      user_name: patient?.supervisor_name,
      role: 'supervisor',
      action: `sepsis_visit_day_${visit.visitDay}_${visitCompleted ? 'completed' : 'updated'}`,
      record_id: patient?.id,
      baby_id: visit.baby_id || null,
      old_value: visit,
      new_value: updatedVisit,
    });

    onSave(updatedVisit);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{t('day')} {visit.visitDay} {t('sepsisScreening')}</h2>
          <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">

          {/* Basic Visit Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('actualDateOfVisit')}</label>
              <input type="date" value={actualDate} onChange={e => setActualDate(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('visitCompleted')}</label>
              <div className="flex gap-3">
                {[true, false].map(value => (
                  <label key={String(value)} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={value}
                      checked={visitCompleted === value}
                      onChange={(e) => setVisitCompleted(e.target.value === 'true')}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm font-medium">{value ? t('yes') : t('no')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('visitType')}</label>
              <select value={visitType} onChange={e => setVisitType(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option value="">{t('selectVisitType')}</option>
                <option value="Home Visit">{t('homeVisit')}</option>
                <option value="Facility Visit">{t('facilityVisit')}</option>
                <option value="Telephone Follow-up">{t('telephoneFollowup')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">{t('conductedBy')}</label>
              <input type="text" value={conductedBy} onChange={e => setConductedBy(e.target.value)} placeholder={t('conductedByNamePlaceholder')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
          </div>

          {/* Sepsis Signs Assessment */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Sepsis Signs Assessment</h3>
            <p className="text-xs text-slate-500 mb-2">Check the baby for the following signs of sepsis. Select Yes if the sign is present and No if the sign is absent.</p>
            <div className="space-y-3">
              {/* Create checkboxes for each sepsis sign */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="allLimbsLimp"
                  checked={allLimbsLimp}
                  onChange={(e) => setAllLimbsLimp(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="allLimbsLimp" className="text-sm font-medium">All limbs limp</label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="feedingLessOrStopped"
                  checked={feedingLessOrStopped}
                  onChange={(e) => setFeedingLessOrStopped(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="feedingLessOrStopped" className="text-sm font-medium">Feeding less or stopped</label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="cryWeakOrStopped"
                  checked={cryWeakOrStopped}
                  onChange={(e) => setCryWeakOrStopped(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="cryWeakOrStopped" className="text-sm font-medium">Cry weak or stopped</label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="distendedAbdomenOrVomiting"
                  checked={distendedAbdomenOrVomiting}
                  onChange={(e) => setDistendedAbdomenOrVomiting(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="distendedAbdomenOrVomiting" className="text-sm font-medium">Distended abdomen or baby vomits often</label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="coldToTouchOrFever"
                  checked={coldToTouchOrFever}
                  onChange={(e) => setColdToTouchOrFever(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="coldToTouchOrFever" className="text-sm font-medium">Mother says baby is cold to touch or has fever with temperature above 99°F / 37.2°C</label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="chestIndrawing"
                  checked={chestIndrawing}
                  onChange={(e) => setChestIndrawing(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="chestIndrawing" className="text-sm font-medium">Chest indrawing</label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="respiratoryRateAbove60"
                  checked={respiratoryRateAbove60}
                  onChange={(e) => setRespiratoryRateAbove60(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="respiratoryRateAbove60" className="text-sm font-medium">Respiratory rate greater than 60 per minute</label>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="pusOnUmblicus"
                  checked={pusOnUmblicus}
                  onChange={(e) => setPusOnUmblicus(e.target.checked)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="pusOnUmblicus" className="text-sm font-medium">Pus present on umbilicus</label>
              </div>
            </div>
          </div>

          {/* Referral Section (conditionally shown) */}
          {(allLimbsLimp || feedingLessOrStopped || cryWeakOrStopped || distendedAbdomenOrVomiting ||
            coldToTouchOrFever || chestIndrawing || respiratoryRateAbove60 || pusOnUmblicus) && (
            <div className="border-t pt-4 mb-4">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Referral Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Immediate Referral Required</label>
                  <div className="flex gap-3">
                    {[true, false].map(value => (
                      <label key={String(value)} className="flex items-center gap-2">
                        <input
                          type="radio"
                          value={value}
                          checked={immediateReferralRequired === value}
                          onChange={(e) => setImmediateReferralRequired(e.target.value === 'true')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm font-medium">{value ? 'Yes' : 'No'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Referral Advised</label>
                  <div className="flex gap-3">
                    {[true, false].map(value => (
                      <label key={String(value)} className="flex items-center gap-2">
                        <input
                          type="radio"
                          value={value}
                          checked={referralAdvised === value}
                          onChange={(e) => setReferralAdvised(e.target.value === 'true')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm font-medium">{value ? 'Yes' : 'No'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Baby Referred</label>
                  <div className="flex gap-3">
                    {[true, false].map(value => (
                      <label key={String(value)} className="flex items-center gap-2">
                        <input
                          type="radio"
                          value={value}
                          checked={babyReferred === value}
                          onChange={(e) => setBabyReferred(e.target.value === 'true')}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="text-sm font-medium">{value ? 'Yes' : 'No'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {babyReferred && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Referral Facility</label>
                      <input type="text" value={referralFacility} onChange={e => setReferralFacility(e.target.value)} placeholder="Referral facility name" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Referral Date and Time</label>
                      <input type="datetime-local" value={referralDateTime} onChange={e => setReferralDateTime(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Action Taken</label>
                      <textarea rows={3} value={actionTaken} onChange={e => setActionTaken(e.target.value)} placeholder="Actions taken after referral" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Current Baby Status</label>
                      <select value={currentBabyStatus} onChange={e => setCurrentBabyStatus(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="">Select Status</option>
                        <option value="Stable">Stable</option>
                        <option value="Under Observation">Under Observation</option>
                        <option value="Referred">Referred</option>
                        <option value="Admitted">Admitted</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Supervisor Review Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold text-slate-800 mb-3">Supervisor Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Review Status</label>
                <select value={supervisorReviewStatus} onChange={e => setSupervisorReviewStatus(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">{t('workAssessment')}</label>
                <select value={supervisorWorkAssessment} onChange={e => setSupervisorWorkAssessment(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                  <option value="">{t('selectAssessment')}</option>
                  <option value="Complete">{t('completeWork')}</option>
                  <option value="Incomplete">{t('incompleteWork')}</option>
                </select>
              </div>

              {/* Visit Remarks */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitRemarks')}</label>
                <textarea rows={3} value={visitRemarks} onChange={e => setVisitRemarks(e.target.value)} placeholder={t('actionTakenPlaceholder')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50">{t('cancel')}</button>
          <button onClick={handleSaveSepsis} className="px-6 py-2 rounded-xl text-sm font-semibold text-white bg-[#0F4C75] hover:bg-[#0a3254] transition-colors">{t('saveFollowup')}</button>
        </div>
      </div>
    </div>
  );
}
