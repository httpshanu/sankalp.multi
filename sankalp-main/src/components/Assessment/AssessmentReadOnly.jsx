import { ClipboardList, Baby, Heart, Activity, Users, ShieldAlert, BarChart2, AlertCircle, AlertTriangle, LogOut, FileText, Bell, CheckCircle2, Clock, Phone, Monitor, Users as UsersIcon, FileText as FileIcon } from 'lucide-react';

// ── Shared helpers ────────────────────────────────────────

function Section({ icon: Icon, title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-100 shadow-sm p-5 mb-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <Icon size={16} className="text-[#0F4C75]" />
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>;
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value !== undefined && value !== null && value !== '' ? String(value) : '—'}</p>
    </div>
  );
}

function BoolField({ label, value }) {
  if (value === undefined || value === null) return <Field label={label} value="—" />;
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${value ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
        {value ? '✓ Yes' : '✗ No'}
      </span>
    </div>
  );
}

function TagField({ label, value }) {
  if (!value) return <Field label={label} value="—" />;
  const color = value === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700';
  return (
    <div>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${color}`}>{value}</span>
    </div>
  );
}

// ── Section A ─────────────────────────────────────────────
function SectionAView({ data, t }) {
  if (!data) return null;
  return (
    <Section icon={ClipboardList} title={`A. ${t('identification')}`}>
      <Grid>
        <Field label={t('district')} value={data.district} />
        <Field label={t('blockName')} value={data.blockName} />
        <Field label={t('facilityType')} value={data.facilityType} />
        <Field label={t('facilityName')} value={data.facilityName} />
        {data.facilityType === 'other' && (
          <Field label={t('otherFacilityName')} value={data.other_facility_name} />
        )}
        <Field label={t('dateOfAdmission')} value={data.date_of_admission} />
        <Field label={t('motherNameField')} value={data.mother_name} />
        <Field label={t('fatherName')} value={data.father_name} />
        <Field label={t('motherMobile')} value={data.mother_mobile} />
        {data.alternative_mobile && (
          <Field label={t('alternativeMobile')} value={data.alternative_mobile} />
        )}
        <Field label={t('verifiedMobile')} value={
          data.verified_mobile === 'motherNumber' ? t('motherNumber') :
          data.verified_mobile === 'alternativeNumber' ? t('alternativeNumber') : t('other')}
        />
        <Field label={t('contactVerificationStatus')} value={
          data.contact_verification_status === 'verified' ? t('verified') : t('not_verified')}
        />
        <Field label={t('village')} value={data.village} />
        <Field label={t('ruralUrban')} value={data.rural_urban} />
        <Field label={t('ashaName')} value={data.asha_name} />
        <Field label={t('ashaMobile')} value={data.asha_mobile} />
        <Field label={t('anmName')} value={data.anm_name} />
        <Field label={t('anmMobile')} value={data.anm_mobile} />
        <Field label={t('assessorName')} value={data.assessor_name} />
        <Field label={t('motherAge')} value={data.mother_age} />
        <Field label={t('gravida')} value={data.gravida} />
        <Field label={t('para')} value={data.para} />
        <Field label={t('lmp')} value={data.lmp} />
        <Field label={t('wasMotherHRP')} value={
          data.isHRP === 'yes' ? `Yes — ${t(data.hrp_type || '')}` : t('no')
        }/>
        <Field label={t('registrationRemarks')} value={data.registration_remarks} />
        <Field label={t('babyCount')} value={data.baby_count} />
        <Field label={t('counsellorName')} value={data.counsellor_name} />
        <Field label={t('supervisorName')} value={data.supervisor_name} />
      </Grid>
    </Section>
  );
}

// ── Section B ─────────────────────────────────────────────
function SectionBView({ data, t }) {
  if (!data) return null;
  const counsel = ['importanceBF', 'colostrumFeeding', 'bfWithin1Hour', 'exclusiveBF6Months', 'skinToSkin', 'noPrelacteal'];
  const breast = ['flatNipple', 'invertedNipple', 'breastAbnormality', 'prevBFDifficulty'];
  return (
    <Section icon={Heart} title={`B. ${t('ancCounselling')}`}>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('wasMotherCounselled')}</p>
      <Grid>
        {counsel.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}
      </Grid>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2 mt-4">{t('breastAssessment')}</p>
      <Grid>
        {breast.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}
      </Grid>
      {data.ancAction && (
        <div className="mt-4">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('actionTaken')}</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{data.ancAction}</p>
        </div>
      )}
    </Section>
  );
}

// ── Section C ─────────────────────────────────────────────
function SectionCView({ data, t }) {
  if (!data) return null;
  const noBFReasons = ['motherSick', 'babySick', 'caesareanReason', 'staffDelay', 'familyRefusal', 'motherRefusal', 'socioCultural'];
  const prelactealTypes = ['honey', 'water', 'formula', 'ghutti', 'gur'];
  return (
    <Section icon={Baby} title={`C. ${t('afterBirthCare')}`}>
      <Grid>
        <Field label={t('timeOfBirth')} value={data.timeOfBirth} />
        <Field label={t('timeBFStarted')} value={data.timeBFStarted} />
        <BoolField label={t('babyCriedImmediately')} value={data.babyCried} />
        <BoolField label={t('babyDriedImmediately')} value={data.babyDried} />
        <BoolField label={t('delayedCordClamping')} value={data.delayedCordClamping} />
        <BoolField label={t('skinToSkinInitiated')} value={data.skinToSkinInitiated} />
        <BoolField label={t('bfInitiatedWithin1Hour')} value={data.bfInitiatedWithin1Hour} />
        <BoolField label={t('babySeparatedFromMother')} value={data.babySeparated} />
      </Grid>
      {data.resuscitationText && (
        <div className="mt-3">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('requiredResuscitationText')}</p>
          <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{data.resuscitationText}</p>
        </div>
      )}
      {data.bfInitiatedWithin1Hour === false && (
        <div className="mt-3">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('ifNoWhy')}</p>
          <Grid>{noBFReasons.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}</Grid>
        </div>
      )}
      <div className="mt-3">
        <BoolField label={t('prelactealGiven')} value={data.prelactealGiven} />
      </div>
      {data.prelactealGiven && (
        <div className="mt-3">
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('prelactealType')}</p>
          <Grid>
            {prelactealTypes.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}
            <Field label={t('otherPrelacteal')} value={data.otherPrelacteal} />
          </Grid>
        </div>
      )}
    </Section>
  );
}

// ── KMC Section ─────────────────────────────────────────────
function KmcSectionView({ data, t }) {
  if (!data) return null;
  return (
    <Section icon={Baby} title={`KMC. ${t('kmcTitle')}`}>
      <Grid>
        <Field label={t('kmcAvailability')} value={
          data.availability === 'available' ? t('kmcAvailable') :
          data.availability === 'not_available' ? t('kmcNotAvailable') : '—'
        } />
        <Field label={t('kmcInitiated')} value={data.initiated ? t('yes') : t('no')} />
        {data.initiated && (
          <>
            <Field label={t('kmcInitiationDate')} value={data.initiation_date || '—'} />
            <Field label={t('kmcInitiationTime')} value={data.initiation_time || '—'} />
          </>
        )}
        <Field label={t('kmcDuration')} value={data.duration || '—'} />
        <Field label={t('kmcAcceptance')} value={
          data.acceptance === 'accepted' ? t('kmcAccepted') :
          data.acceptance === 'refused' ? t('kmcRefused') :
          data.acceptance === 'partial' ? t('kmcPartial') : '—'
        } />
        <Field label={t('kmcProblems')} value={data.problems || '—'} />
        {!data.initiated && (
          <Field label={t('kmcNotInitiatedReason')} value={
            data.not_initiated_reason ? t(data.not_initiated_reason) : '—'
          } />
        )}
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('kmcCounsellingProvided')}</p>
        <Grid>
          <BoolField label={t('motherCounselled')} value={data.mother_counselled} />
          <BoolField label={t('familyCounselled')} value={data.family_counselled} />
          <BoolField label={t('kmcDurationExplained')} value={data.duration_explained} />
          <BoolField label={t('kmcPositionDemonstrated')} value={data.position_demonstrated} />
        </Grid>
      </Grid>
    </Section>
  );
}

// ── Section D ─────────────────────────────────────────────
function SectionDView({ data, t }) {
  if (!data) return null;
  const positionItems = ['motherComfortable', 'babyCloseToMother', 'babyFacingBreast', 'wholeBodySupported'];
  const attachmentItems = ['mouthWideOpen', 'chinTouchingBreast', 'lowerLipOutward', 'moreAreolaAbove'];
  const sucklingItems = ['slowDeepSuck', 'swallowingHeard', 'babySatisfied'];
  return (
    <Section icon={Heart} title={`D. ${t('bfAssessment')}`}>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('position')}</p>
      <Grid>{positionItems.map(k => <TagField key={k} label={t(k)} value={data[k]} />)}</Grid>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2 mt-4">{t('attachment')}</p>
      <Grid>{attachmentItems.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}</Grid>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2 mt-4">{t('effectiveSuckling')}</p>
      <Grid>{sucklingItems.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}</Grid>
    </Section>
  );
}

// ── Section E ─────────────────────────────────────────────
function SectionEView({ data, t }) {
  if (!data) return null;
  const counselItems = ['position', 'attachment', 'feedingCues', 'demandFeeding', 'nightFeeding', 'burping', 'handExpression'];
  return (
    <Section icon={Users} title={`E. ${t('postnatalWard')}`}>
      <div className="mb-3">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('breastfeedingObservedByNurse')}</p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 capitalize">{data.nurseObserved ? t(data.nurseObserved) : '—'}</span>
      </div>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('motherCounselled')}</p>
      <Grid>{counselItems.map(k => <BoolField key={`mother_${k}`} label={t(k)} value={data[`mother_${k}`]} />)}</Grid>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2 mt-4">{t('familyCounselled')}</p>
      <Grid>{counselItems.map(k => <BoolField key={`family_${k}`} label={t(k)} value={data[`family_${k}`]} />)}</Grid>
    </Section>
  );
}

// ── Section F ─────────────────────────────────────────────
function SectionFView({ data, t }) {
  if (!data) return null;
  return (
    <Section icon={ShieldAlert} title={`F. ${t('sickBaby')}`}>
      <div className="mb-3">
        <BoolField label={t('applicable')} value={data.sickBabyApplicable} />
      </div>
      {data.sickBabyApplicable && (
        <Grid>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('directMotherMilkStarted')}</p>
            <span className="text-sm font-medium text-slate-800">{data.directMilkTiming ? t(data.directMilkTiming) : '—'}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('motherExpressingMilk')}</p>
            <span className="text-sm font-medium text-slate-800">{data.expressTiming ? t(data.expressTiming) : '—'}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('kmcStarted')}</p>
            <span className="text-sm font-medium text-slate-800">{data.kmcTiming ? t(data.kmcTiming) : '—'}</span>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('feedingMethod')}</p>
            <span className="text-sm font-medium text-slate-800">{data.feedingMethod ? t(data.feedingMethod) : '—'}</span>
          </div>
          <BoolField label={t('counselledDaily')} value={data.counselledDaily} />
        </Grid>
      )}
    </Section>
  );
}

// ── Section G ─────────────────────────────────────────────
function SectionGView({ data, t }) {
  if (!data) return null;
  const rows = ['bfObserved', 'goodAttachment', 'feeding8to12', 'urinationAdequate', 'stoolPassed', 'weightMonitored'];
  const days = ['day1', 'day2', 'day3'];
  return (
    <Section icon={BarChart2} title={`G. ${t('dailyMonitoring')}`}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-3 border border-slate-200">Observation</th>
              {days.map(d => (
                <th key={d} className="text-center text-xs font-semibold text-slate-400 uppercase px-4 py-3 border border-slate-200">{t(d)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(k => (
              <tr key={k} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-700 border border-slate-200">{t(k)}</td>
                {days.map(d => {
                  const val = data[k]?.[d];
                  return (
                    <td key={d} className="text-center border border-slate-200 px-4 py-3">
                      {val === true ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">✓ Yes</span>
                      ) : val === false ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">✗ No</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

// ── Section H ─────────────────────────────────────────────
function SectionHView({ data, t }) {
  if (!data) return null;
  const problems = ['poorAttachment', 'breastEngorgement', 'crackedNipple', 'flatNipple', 'inadequateMilk', 'babySleepy'];
  return (
    <Section icon={AlertCircle} title={`H. ${t('bfProblems')}`}>
      <Grid>
        {problems.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}
      </Grid>
      {data.bfManagement && (
        <div className="mt-4">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('managementGiven')}</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{data.bfManagement}</p>
        </div>
      )}
    </Section>
  );
}

// ── Section I ─────────────────────────────────────────────
function SectionIView({ data, t }) {
  if (!data) return null;
  const counsel = ['exclusiveBFCounselling', 'dangerSignsCounselling', 'maternalNutrition', 'homeVisitCounselling', 'immunization', 'followupCounselling'];
  return (
    <Section icon={LogOut} title={`I. ${t('beforeDischarge')}`}>
      <Grid>
        <BoolField label={t('babyExclusivelyBF')} value={data.exclusivelyBF} />
        <BoolField label={t('motherConfident')} value={data.motherConfident} />
      </Grid>
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2 mt-4">{t('counsellingProvided')}</p>
      <Grid>{counsel.map(k => <BoolField key={k} label={t(k)} value={data[k]} />)}</Grid>
    </Section>
  );
}

// ── Section J ─────────────────────────────────────────────
function SectionJView({ data, t }) {
  if (!data) return null;

  return (
    <Section icon={FileText} title={`J. ${t('postDischargePlan')}`}>
      <Grid>
        <BoolField label={t('followupScheduled')} value={data.followupScheduled} />
        {data.followupScheduled && <Field label={t('followupDate')} value={data.followupDate} />}
        <BoolField label={t('ashaInformed')} value={data.ashaInformed} />
        <BoolField label={t('hbncVisitPlanned')} value={data.hbncVisitPlanned} />
        {data.hbncVisitPlanned && data.hbncDay && <Field label={t('selectDay')} value={t(data.hbncDay)} />}
        <BoolField label={t('motherKnowsDangerSigns')} value={data.motherKnowsDangerSigns} />
        <BoolField label={t('immunizationCardProvided')} value={data.immunizationCardProvided} />
        <BoolField label={t('emergencyContact')} value={data.emergencyContact} />
      </Grid>
      {data.postDischargeNotes && (
        <div className="mt-4">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('postDischargeNotes')}</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-3">{data.postDischargeNotes}</p>
        </div>
      )}
    </Section>
  );
}

// ── Section K: Sepsis Screening ────────────────────────────────
function SepsisSectionView({ data, t }) {
  if (!data) return null;
  const sepsisVisits = data.sepsisVisits || [];
  const babyDOB = data.dateOfBirth || null; // Expecting YYYY-MM-DD

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Helper to compute expected date from DOB + days
  const getExpectedDate = (days) => {
    if (!babyDOB) return null;
    const date = new Date(babyDOB);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  const visitDays = [1, 3, 7, 14, 21, 28, 42];

  // Determine visit status
  const getVisitStatus = (visit) => {
    if (!visit) return 'upcoming';
    const { actualDate, visitCompleted, expectedDate } = visit;
    const today = new Date().toISOString().split('T')[0];
    if (visitCompleted) return 'completed';
    if (!actualDate && expectedDate < today) return 'overdue';
    if (!actualDate && expectedDate === today) return 'due_today';
    if (!actualDate && expectedDate > today) return 'upcoming';
    return 'pending';
  };

  // Status to color and label
  const getStatusInfo = (status) => {
    const map = {
      upcoming: { label: t('upcoming'), color: 'bg-blue-100 text-blue-700' },
      due_today: { label: t('due_today'), color: 'bg-yellow-100 text-yellow-700' },
      pending: { label: t('pending'), color: 'bg-yellow-100 text-yellow-700' },
      overdue: { label: t('overdue'), color: 'bg-red-100 text-red-700' },
      completed: { label: t('completed'), color: 'bg-green-100 text-green-700' },
    };
    return map[status] || map.upcoming;
  };

  // Determine if any sepsis sign is positive
  const hasSepsisSign = (visit) => {
    if (!visit) return false;
    const signs = visit.sepsisSigns || {};
    return Object.values(signs).some(v => v === true);
  };

  return (
    <Section icon={AlertCircle} title={`K. ${t('sepsisScreening')}`}>
      <div className="space-y-4">
        {visitDays.map((day) => {
          const visit = sepsisVisits.find(v => v.visitDay === day) || {};
          const expectedDate = getExpectedDate(day) || visit.expectedDate || '';
          const status = getVisitStatus({ ...visit, expectedDate });
          const statusInfo = getStatusInfo(status);
          const hasSign = hasSepsisSign(visit);
          const isDay42 = day === 42;

          return (
            <div key={day} className={`border-2 p-4 rounded-xl ${status === 'overdue' ? 'border-red-300 bg-red-50' : status === 'due_today' ? 'border-yellow-300 bg-yellow-50' : status === 'completed' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${status === 'overdue' ? 'bg-red-600' : status === 'due_today' ? 'bg-yellow-600' : status === 'completed' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    Day {day}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t('visitDay', { day })}</p>
                    <p className="text-xs text-slate-500">{t('expectedDate')}: {formatDate(expectedDate)}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>

              {hasSign && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                  <p className="text-sm font-medium text-red-800 flex items-center gap-1">
                    <AlertTriangle size={14} className="text-red-500" />
                    {t('sepsisRiskDetected')}
                  </p>
                </div>
              )}

              <Grid>
                <Field label={t('actualVisitDate')} value={formatDate(visit.actualDate)} />
                <Field label={t('visitCompleted')} value={visit.visitCompleted ? t('yes') : t('no')} />
                <Field label={t('visitType')} value={visit.visitType || '—'} />
                <Field label={t('conductedBy')} value={visit.conductedBy || '—'} />
              </Grid>

              {/* Remarks */}
              <div className="mb-3">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{t('visitRemarks')}</p>
                <p className="text-sm text-slate-600 whitespace-pre-wrap bg-slate-50 rounded p-2">{visit.remarks || '—'}</p>
              </div>

              {/* Sepsis Signs */}
              <div className="mb-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('sepsisSignsAssessment')}</p>
                <p className="text-xs text-slate-500 mb-1">{t('sepsisSignsInstruction')}</p>
                <Grid className="gap-2">
                  {[
                    { key: 'allLimbsLimp', label: t('allLimbsLimp') },
                    { key: 'feedingLessOrStopped', label: t('feedingLessOrStopped') },
                    { key: 'cryWeakOrStopped', label: t('cryWeakOrStopped') },
                    { key: 'distendedAbdomenOrVomiting', label: t('distendedAbdomenOrVomiting') },
                    { key: 'coldToTouchOrFever', label: t('coldToTouchOrFever') },
                    { key: 'chestIndrawing', label: t('chestIndrawing') },
                    { key: 'respiratoryRateAbove60', label: t('respiratoryRateAbove60') },
                    { key: 'pusOnUmblicus', label: t('pusOnUmblicus') },
                  ].map(s => (
                    <BoolField key={s.key} label={s.label} value={visit.sepsisSigns?.[s.key]} />
                  ))}
                </Grid>
              </div>

              {/* Referral Section (shown if sepsis risk detected) */}
              {hasSign && (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('referralInformation')}</p>
                  <Grid>
                    <Field label={t('immediateReferralRequired')} value={visit.immediateReferralRequired ? t('yes') : t('no')} />
                    <Field label={t('referralAdvised')} value={visit.referralAdvised ? t('yes') : t('no')} />
                    <Field label={t('babyReferred')} value={visit.babyReferred ? t('yes') : t('no')} />
                    {visit.babyReferred && (
                      <>
                        <Field label={t('referralFacility')} value={visit.referralFacility || '—'} />
                        <Field label={t('referralDateTime')} value={formatDateTime(visit.referralDateTime)} />
                        <Field label={t('actionTaken')} value={visit.actionTaken || '—'} />
                        <Field label={t('currentBabyStatus')} value={visit.currentBabyStatus || '—'} />
                      </>
                    )}
                  </Grid>
                </div>
              )}

              {/* Supervisor Review */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('supervisorReview')}</p>
                <Grid>
                  <Field label={t('supervisorReviewStatus')} value={visit.supervisorReviewStatus || t('pending')} />
                  <Field label={t('supervisorWorkAssessment')} value={visit.supervisorWorkAssessment || '—'} />
                  <Field label={t('supervisorNote')} value={visit.supervisorNote || '—'} />
                  <Field label={t('supervisorRemarks')} value={visit.supervisorRemarks || '—'} />
                  <Field label={t('reviewedBy')} value={visit.reviewedBy || '—'} />
                  <Field label={t('reviewDateTime')} value={formatDateTime(visit.reviewedAt)} />
                </Grid>
              </div>

              {/* ASHA Details */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('ashaDetails')}</p>
                <Grid>
                  <Field label={t('ashaName')} value={visit.ashaName || '—'} />
                  <Field label={t('ashaUserId')} value={visit.ashaUserId || '—'} />
                  <Field label={t('ashaRemarks')} value={visit.ashaRemarks || '—'} />
                  <Field label={t('ashaSignature')} value={visit.ashaSignatureUrl ? t('provided') : t('not_provided')} />
                  <Field label={t('visitCompletedByAsha')} value={visit.visitCompletedByAsha ? t('yes') : t('no')} />
                </Grid>
              </div>

              {/* Facilitator/ANM Review */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('facilitatorAnmReview')}</p>
                <Grid>
                  <Field label={t('facilitatorAnmName')} value={visit.facilitatorAnmName || '—'} />
                  <Field label={t('facilitatorAnmObservations')} value={visit.facilitatorAnmObservations || '—'} />
                  <Field label={t('facilitatorAnmSignature')} value={visit.facilitatorAnmSignatureUrl ? t('provided') : t('not_provided')} />
                  <Field label={t('verificationStatus')} value={visit.facilitatorAnmVerificationStatus || t('pending')} />
                  <Field label={t('verificationDate')} value={formatDateTime(visit.facilitatorAnmVerificationDate)} />
                </Grid>
              </div>

              {/* ANM/Vaccination Section (only for day 42) */}
              {isDay42 && (
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2">{t('anmVaccinationDetails')}</p>
                  <Grid>
                    <Field label={t('anmName')} value={visit.anmName || '—'} />
                    <Field label={t('dpt1Received')} value={visit.dpt1Received ? t('yes') : t('no')} />
                    {visit.dpt1Received && (
                      <>
                        <Field label={t('dpt1Date')} value={formatDate(visit.dpt1Date)} />
                        <Field label={t('ageAtDpt1Days')} value={visit.ageAtDpt1Days !== undefined ? `${visit.ageAtDpt1Days} ${t('days')}` : '—'} />
                        <Field label={t('manualAgeCorrection')} value={visit.manualAgeCorrection || '—'} />
                        <Field label={t('anmObservations')} value={visit.anmObservations || '—'} />
                        <Field label={t('anmSignature')} value={visit.anmSignatureUrl ? t('provided') : t('not_provided')} />
                      </>
                    )}
                  </Grid>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// Helper for date-time formatting
function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Main Export ───────────────────────────────────────────────
/**
 * AssessmentReadOnly renders all assessment sections (A-K) in read-only mode.
 *
 * @param {object} assessment - The full assessment data object from localStorage
 * @param {function} t - Translation function from useLanguage()
 */
export default function AssessmentReadOnly({ assessment, t }) {
  if (!assessment) return null;

  return (
    <div className="space-y-0">
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
        <ClipboardList size={16} className="text-blue-600" />
        <p className="text-sm font-semibold text-blue-800">Individual Mother–Newborn Assessment Tool</p>
      </div>

      <SectionAView data={assessment.identification} t={t} />
      <SectionBView data={assessment.ancCounselling} t={t} />
      <SectionCView data={assessment.afterBirth} t={t} />
      <KmcSectionView data={assessment.kmc} t={t} />
      <SectionDView data={assessment.bfAssessment} t={t} />
      <SectionEView data={assessment.postnatalWard} t={t} />
      <SectionFView data={assessment.sickBaby} t={t} />
      <SectionGView data={assessment.dailyMonitoring} t={t} />
      <SectionHView data={assessment.bfProblems} t={t} />
      <SectionIView data={assessment.discharge} t={t} />
      <SectionJView data={assessment.postDischargePlan || assessment.discharge} t={t} />
      <SepsisSectionView data={assessment} t={t} />
    </div>
  );
}
