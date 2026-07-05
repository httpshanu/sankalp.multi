import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import {
  upsertPatient, getPatientById, getBabiesByPatient, upsertBaby,
  generateBabyId, classifyBaby, isKmcEligible, generateFollowups,
  addAuditLog, getFacilityCode
} from '../../data/dataStore';
import { UTTARAKHAND_DISTRICTS, HARIDWAR_BLOCKS, FACILITY_LIST } from '../../data/dataStore';
import { SectionA, SectionB, SectionC, SectionD, SectionE, SectionF, SectionG, SectionH, SectionI, SectionJ } from '../../components/Assessment';
import KmcSection from '../../components/Assessment/KmcSection';
import { CheckCircle2, ChevronRight, ChevronLeft, Save, Send, Baby, Plus, Trash2 } from 'lucide-react';

function generateId() {
  return 'SN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
}

const STEPS = [
  { id: 1, key: 'registration', section: 'A' },
  { id: 2, key: 'ancCounselling', section: 'B' },
  { id: 3, key: 'afterBirthCare', section: 'C' },
  { id: 4, key: 'breastfeedingCounselling' },
  { id: 5, key: 'bfAssessment', section: 'D' },
  { id: 6, key: 'postnatalWard', section: 'E' },
  { id: 7, key: 'sickBaby', section: 'F' },
  { id: 8, key: 'dailyMonitoring', section: 'G' },
  { id: 9, key: 'bfProblems', section: 'H' },
  { id: 10, key: 'beforeDischarge', section: 'I' },
  { id: 11, key: 'postDischargePlan', section: 'J' },
];

function StepIndicator({ current, t }) {
  return (
    <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
      {STEPS.map((step, i) => (
        <Fragment key={step.id}>
          <div className="flex items-center flex-shrink-0">
            <div className={`flex flex-col items-center w-8 h-8 rounded-full flex-items-center justify-center text-sm font-bold border-2 transition-all ${
              step.id < current ? 'bg-emerald-500 border-emerald-500 text-white'
                : step.id === current ? 'bg-[#0F4C75] border-[#0F4C75] text-white'
                : 'bg-white border-slate-200 text-slate-400'
            }`}>
              {step.id < current ? <CheckCircle2 size={14} /> : step.section || step.id}
            </div>
            <p className={`text-xs mt-1 font-medium whitespace-nowrap ${step.id === current ? 'text-[#0F4C75]' : 'text-slate-400'}`}>
              {t(step.key)}
            </p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 mb-4 ${step.id < current ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </Fragment>
      ))}
    </div>
  );
}

function BreastfeedingForm({ data, onChange, t }) {
  const items = [
    { key: 'colostrumCounselled', label: t('colostrumFeeding') },
    { key: 'earlyInitiation', label: t('earlyInitiation') },
    { key: 'exclusiveBreastfeeding', label: t('exclusiveBreastfeeding') },
    { key: 'latching', label: t('correctLatching') },
    { key: 'prelactealFeed', label: t('prelactealFeed') },
  ];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{t('breastfeedingCounselling')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('checkTopics')}</p>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.key} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${data[item.key] ? 'border-blue-400 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            onClick={() => onChange({ ...data, [item.key]: !data[item.key] })}>
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${data[item.key] ? 'bg-[#0F4C75] border-[#0F4C75]' : 'border-slate-300'}`}>
              {data[item.key] && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <span className="text-sm font-semibold text-slate-800">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BabyRegistrationForm({ baby, index, totalBabies, onUpdate, onRemove, t }) {
  const classification = classifyBaby(baby.gestational_age, baby.birth_weight);
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-700 flex items-center gap-2">
          <Baby size={16} className="text-[#0F4C75]" /> {t('baby')} {index + 1}
          {baby.baby_id && <span className="text-xs font-mono text-slate-400 ml-2">{baby.baby_id}</span>}
        </h4>
        {totalBabies > 1 && (
          <button onClick={() => onRemove(index)} className="p-1 text-rose-400 hover:text-rose-600"><Trash2 size={14} /></button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('gender')}</label>
          <div className="flex gap-3">
            {['male', 'female'].map(g => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name={`baby_gender_${index}`} value={g} checked={baby.gender === g} onChange={() => onUpdate(index, 'gender', g)} />
                <span className="text-sm capitalize text-slate-700">{g === 'male' ? t('male') : t('female')}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">UHID</label>
          <input type="text" value={baby.uhid || ''} onChange={e => onUpdate(index, 'uhid', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('gestationalAgeWeeks')}</label>
          <input type="number" value={baby.gestational_age || ''} onChange={e => onUpdate(index, 'gestational_age', e.target.value)} placeholder="28-42" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('birthWeightGrams')}</label>
          <input type="number" value={baby.birth_weight || ''} onChange={e => onUpdate(index, 'birth_weight', e.target.value)} placeholder="grams" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        {classification && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('babyClassification')}</label>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold">{classification}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewPatient() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    identification: {
      district: 'Haridwar',
      block_name: '',
      facility_type: 'public',
      facility_name: '',
      other_facility_name: '',
      date_of_admission: '',
      mother_name: '',
      father_name: '',
      mother_mobile: '',
      alternative_mobile: '',
      verified_mobile: 'motherNumber',
      contact_verification_status: 'not_verified',
      village: '',
      rural_urban: 'rural',
      asha_name: '',
      asha_mobile: '',
      anm_name: '',
      anm_mobile: '',
      assessor_name: '',
      mother_age: '',
      gravida: '',
      para: '',
      lmp: '',
      isHRP: 'no',
      hrp_type: '',
      registration_remarks: '',
      baby_count: 1,
      counsellor_id: user?.id,
      counsellor_name: user?.name,
      supervisor_id: user?.id,
      supervisor_name: user?.name,
    },
    ancCounselling: {},
    afterBirth: {},
    breastfeeding: {},
    bfAssessment: {},
    postnatalWard: {},
    sickBaby: {},
    dailyMonitoring: {},
    bfProblems: {},
    discharge: {},
    postDischargePlan: {},
  });

  const [babies, setBabies] = useState([{
    baby_number: 1,
    gender: 'male',
    uhid: '',
    gestational_age: '',
    birth_weight: '',
    outcome_of_delivery: 'live_birth',
    baby_condition: 'normal',
    baby_location: 'with_mother',
  }]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const patient = getPatientById(id);
      const existingBabies = getBabiesByPatient(id);
      const savedData = localStorage.getItem(`sankalp_assessment_${id}`);

      if (savedData) {
        try { setFormData(JSON.parse(savedData)); } catch {}
      }
      if (existingBabies.length > 0) {
        setBabies(existingBabies);
      }
      setIsLoading(false);
    }
  }, [id]);

  const updateSection = (key) => (val) => setFormData(prev => ({ ...prev, [key]: val }));

  const updateBaby = (index, key, val) => {
    setBabies(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: val };
      return updated;
    });
  };

  const addBaby = () => {
    setBabies(prev => [...prev, { baby_number: prev.length + 1, gender: 'male', uhid: '', gestational_age: '', birth_weight: '', outcome_of_delivery: 'live_birth', baby_condition: 'normal', baby_location: 'with_mother' }]);
    setFormData(prev => ({ ...prev, identification: { ...prev.identification, baby_count: babies.length + 1 } }));
  };

  const removeBaby = (index) => {
    if (babies.length <= 1) return;
    setBabies(prev => prev.filter((_, i) => i !== index).map((b, i) => ({ ...b, baby_number: i + 1 })));
    setFormData(prev => ({ ...prev, identification: { ...prev.identification, baby_count: babies.length - 1 } }));
  };

  const handleSave = (statusOverride) => {
    const patientId = id || generateId();
    const facilityCode = getFacilityCode(formData.identification.facility_name);
    const status = statusOverride || 'draft';

    const patientData = {
      id: patientId,
      patient_id: patientId,
      status,
      district: formData.identification.district,
      block_name: formData.identification.block_name,
      facility_type: formData.identification.facility_type,
      facility_name: formData.identification.facility_name,
      other_facility_name: formData.identification.other_facility_name,
      date_of_admission: formData.identification.date_of_admission,
      mother_name: formData.identification.mother_name,
      father_name: formData.identification.father_name,
      mother_mobile: formData.identification.mother_mobile,
      alternative_mobile: formData.identification.alternative_mobile,
      verified_mobile: formData.identification.verified_mobile,
      contact_verification_status: formData.identification.contact_verification_status,
      village: formData.identification.village,
      rural_urban: formData.identification.rural_urban,
      asha_name: formData.identification.asha_name,
      asha_mobile: formData.identification.asha_mobile,
      anm_name: formData.identification.anm_name,
      anm_mobile: formData.identification.anm_mobile,
      assessor_name: formData.identification.assessor_name,
      mother_age: formData.identification.mother_age,
      gravida: formData.identification.gravida,
      para: formData.identification.para,
      lmp: formData.identification.lmp,
      hrp_status: formData.identification.isHRP,
      hrp_type: formData.identification.hrp_type,
      registration_remarks: formData.identification.registration_remarks,
      baby_count: babies.length,
      counsellor_id: user?.id,
      counsellor_name: user?.name,
      supervisor_id: user?.id,
      supervisor_name: user?.name,
      handover_status: status === 'submitted' ? 'submitted_to_admin' : 'in_progress_by_supervisor',
    };

    upsertPatient(patientData);

    babies.forEach((baby, i) => {
      const babyData = {
        ...baby,
        id: `${patientId}_B${i + 1}`,
        patient_id: patientId,
        baby_id: baby.baby_id || generateBabyId(patientId, i + 1, facilityCode),
        baby_number: i + 1,
        baby_classification: classifyBaby(baby.gestational_age, baby.birth_weight),
        date_of_delivery: formData.afterBirth?.dateOfBirth || baby.date_of_delivery,
        time_of_birth: formData.afterBirth?.timeOfBirth || baby.time_of_birth,
        type_of_delivery: formData.afterBirth?.deliveryType,
        gestational_age: baby.gestational_age,
        birth_weight: baby.birth_weight,
      };
      upsertBaby(babyData);
    });

    localStorage.setItem(`sankalp_assessment_${patientId}`, JSON.stringify(formData));

    if (status === 'submitted') {
      generateFollowups(patientId, formData.discharge?.dateOfDischarge || new Date().toISOString().split('T')[0]);
    }

    addAuditLog({
      user_id: user?.id, user_name: user?.name, role: user?.role,
      action: status === 'submitted' ? 'submitted' : status === 'draft' ? 'saved_draft' : 'updated',
      record_id: patientId,
    });

    if (statusOverride) {
      setSubmitted(true);
      setTimeout(() => navigate(id ? `/supervisor/patients/${patientId}` : '/supervisor/patients'), 2000);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const isStillBirth = babies.some(b => b.outcome_of_delivery === 'still_birth');
  const hasKmcEligible = babies.some(b => isKmcEligible(b.outcome_of_delivery, b.birth_weight, b.gestational_age, b.baby_condition));

  if (submitted) return (
    <AppLayout title={id ? t('editPatient') : t('patientRegistration')}>
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t('submittedSuccess')}</h2>
        <p className="text-slate-500">{t('submittedSuccessDesc')}</p>
      </div>
    </AppLayout>
  );

  if (isLoading && id) {
    return (
      <AppLayout title={id ? t('editPatient') : t('patientRegistration')}>
        <div className="flex flex-col items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C75]"></div>
          <p className="mt-4 text-slate-600">{t('loading')}</p>
        </div>
      </AppLayout>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div>
          <SectionA data={formData.identification} onChange={updateSection('identification')} t={t} user={user} />
          {/* Baby Count & Registration */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Baby size={18} className="text-[#0F4C75]" /> {t('babyDetails')}
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">{t('numberOfBabies')}</label>
              <div className="flex gap-3 flex-wrap">
                {[1, 2, 3].map(n => (
                  <button key={n} type="button" onClick={() => {
                    setBabies(Array.from({ length: n }, (_, i) => babies[i] || { baby_number: i + 1, gender: 'male', uhid: '', gestational_age: '', birth_weight: '', outcome_of_delivery: 'live_birth', baby_condition: 'normal', baby_location: 'with_mother' }));
                    setFormData(prev => ({ ...prev, identification: { ...prev.identification, baby_count: n } }));
                  }} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${babies.length === n ? 'bg-[#0F4C75] text-white border-[#0F4C75]' : 'bg-white text-slate-600 border-slate-200'}`}>
                    {n} {n === 1 ? 'Baby' : 'Babies'}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {babies.map((baby, idx) => (
                <BabyRegistrationForm key={idx} baby={baby} index={idx} totalBabies={babies.length} onUpdate={updateBaby} onRemove={removeBaby} t={t} />
              ))}
            </div>
            {babies.length < 3 && (
              <button onClick={addBaby} className="mt-3 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                <Plus size={14} /> {t('addBaby')}
              </button>
            )}
          </div>
        </div>
        );
      case 2: return <SectionB data={formData.ancCounselling} onChange={updateSection('ancCounselling')} t={t} />;
      case 3: return <SectionC data={formData.afterBirth} onChange={updateSection('afterBirth')} t={t} />;
      case 4: return <BreastfeedingForm data={formData.breastfeeding} onChange={updateSection('breastfeeding')} t={t} />;
      case 5: return <SectionD data={formData.bfAssessment} onChange={updateSection('bfAssessment')} t={t} />;
      case 6: return <SectionE data={formData.postnatalWard} onChange={updateSection('postnatalWard')} t={t} />;
      case 7: return <SectionF data={formData.sickBaby} onChange={updateSection('sickBaby')} t={t} />;
      case 8: return <SectionG data={formData.dailyMonitoring} onChange={updateSection('dailyMonitoring')} t={t} />;
      case 9: return <SectionH data={formData.bfProblems} onChange={updateSection('bfProblems')} t={t} />;
      case 10: return <SectionI data={formData.discharge} onChange={updateSection('discharge')} t={t} />;
      case 11: return <SectionJ data={formData.postDischargePlan} onChange={updateSection('postDischargePlan')} t={t} />;
      default: return null;
    }
  };

  return (
    <AppLayout title={id ? t('editPatient') : t('patientRegistration')}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{t('patientRegistration')}</h1>
            <p className="text-slate-500 text-sm">{t('stepOf').replace('{step}', step).replace('{total}', STEPS.length)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave('draft')} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Save size={14} />
              {saved ? t('saved') : t('saveDraft')}
            </button>
          </div>
        </div>

        <StepIndicator current={step} t={t} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
          {renderStep()}
        </div>

        {/* KMC Section - shown if any baby is eligible */}
        {hasKmcEligible && step === 7 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
            <KmcSection babies={babies} formData={formData} updateSection={updateSection} t={t} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/supervisor')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={16} />
            {step === 1 ? t('discardEntry') : t('previous')}
          </button>

          {step < STEPS.length ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0F4C75, #1B6CA8)' }}>
              {t('nextSection')} <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={() => handleSave('submitted')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
              <Send size={14} />
              {t('submitForReview')}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
