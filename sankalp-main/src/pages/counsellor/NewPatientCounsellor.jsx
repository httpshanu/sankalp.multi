import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useAuth } from '../../context/useAuth';
import { useLanguage } from '../../context/useLanguage';
import {
  upsertPatient, getPatientById, getFacilityCode, generateBabyId,
  addAuditLog, HANDOVER_STATUSES
} from '../../data/dataStore';
import { UTTARAKHAND_DISTRICTS, HARIDWAR_BLOCKS, FACILITY_LIST } from '../../data/dataStore';
import SectionA from '../../components/Assessment/SectionA';
import { CheckCircle2, Save, Send, ChevronRight, ChevronLeft, Baby, Plus, Trash2 } from 'lucide-react';

function generateId() {
  return 'SN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
}

export default function NewPatientCounsellor() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form data structure: identification (for SectionA) and babies array
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
      contact_verification_status: 'verified',
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
      supervisor_id: null,
      supervisor_name: null,
    },
    babies: [{ baby_number: 1, gender: 'male', uhid: '', gestational_age: '', birth_weight: '' }],
  });

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      const patient = getPatientById(id);
      if (patient) {
        // Map patient data to our formData structure
        const mappedData = {
          identification: {
            district: patient.district || '',
            block_name: patient.block_name || '',
            facility_type: patient.facility_type || '',
            facility_name: patient.facility_name || '',
            other_facility_name: patient.other_facility_name || '',
            date_of_admission: patient.date_of_admission || '',
            mother_name: patient.mother_name || '',
            father_name: patient.father_name || '',
            mother_mobile: patient.mother_mobile || '',
            alternative_mobile: patient.alternative_mobile || '',
            verified_mobile: patient.verified_mobile || 'motherNumber',
            contact_verification_status: patient.contact_verification_status || 'verified',
            village: patient.village || '',
            rural_urban: patient.rural_urban || 'rural',
            asha_name: patient.asha_name || '',
            asha_mobile: patient.asha_mobile || '',
            anm_name: patient.anm_name || '',
            anm_mobile: patient.anm_mobile || '',
            assessor_name: patient.assessor_name || '',
            mother_age: patient.mother_age || '',
            gravida: patient.gravida || '',
            para: patient.para || '',
            lmp: patient.lmp || '',
            isHRP: patient.hrp_status || 'no',
            hrp_type: patient.hrp_type || '',
            registration_remarks: patient.registration_remarks || '',
            baby_count: patient.baby_count || 1,
            counsellor_id: patient.counsellor_id || (user?.id),
            counsellor_name: patient.counsellor_name || (user?.name),
            supervisor_id: patient.supervisor_id || null,
            supervisor_name: patient.supervisor_name || null,
          },
          babies: patient.babies?.map(baby => ({
            baby_number: baby.baby_number || 1,
            gender: baby.gender || 'male',
            uhid: baby.uhid || '',
            gestational_age: baby.gestational_age || '',
            birth_weight: baby.birth_weight || '',
            outcome_of_delivery: baby.outcome_of_delivery || 'live_birth',
            baby_condition: baby.baby_condition || 'normal',
            baby_location: baby.baby_location || 'with_mother',
          })) || [{ baby_number: 1, gender: 'male', uhid: '', gestational_age: '', birth_weight: '' }],
        };
        setFormData(mappedData);
      }
      setIsLoading(false);
    }
  }, [id, user]);

  const updateIdentification = (key, val) => {
    setFormData(prev => ({
      ...prev,
      identification: { ...prev.identification, [key]: val },
    }));
  };

  const updateBaby = (index, key, val) => {
    setFormData(prev => {
      const babies = [...prev.babies];
      babies[index] = { ...babies[index], [key]: val };
      return { ...prev, babies };
    });
  };

  const addBaby = () => {
    setFormData(prev => {
      const newBabyNumber = prev.babies.length + 1;
      const newBaby = {
        baby_number: newBabyNumber,
        gender: 'male',
        uhid: '',
        gestational_age: '',
        birth_weight: '',
        outcome_of_delivery: 'live_birth',
        baby_condition: 'normal',
        baby_location: 'with_mother',
      };
      return {
        ...prev,
        identification: {
          ...prev.identification,
          baby_count: prev.babies.length + 1,
        },
        babies: [...prev.babies, newBaby],
      };
    });
  };

  const removeBaby = (index) => {
    if (formData.babies.length <= 1) return;
    setFormData(prev => {
      const babies = [...prev.babies];
      babies.splice(index, 1);
      // Re-number babies
      const renumbered = babies.map((b, i) => ({ ...b, baby_number: i + 1 }));
      return {
        ...prev,
        identification: {
          ...prev.identification,
          baby_count: prev.babies.length - 1,
        },
        babies: renumbered,
      };
    });
  };

  const handleSaveDraft = () => {
    const patientId = id || generateId();
    const facilityCode = getFacilityCode(formData.identification.facility_name);
    const patientData = {
      ...formData.identification,
      id: patientId,
      patient_id: patientId,
      status: 'draft',
      babies: formData.babies.map((b, i) => ({
        ...b,
        baby_id: b.baby_id || generateBabyId(patientId, i + 1, facilityCode),
      })),
    };
    upsertPatient(patientData);
    addAuditLog({
      user_id: user?.id, user_name: user?.name, role: user?.role,
      action: 'created', record_id: patientId,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleHandover = () => {
    const patientId = id || generateId();
    const facilityCode = getFacilityCode(formData.identification.facility_name);
    const patientData = {
      ...formData.identification,
      id: patientId,
      patient_id: patientId,
      status: 'draft',
      counsellor_id: user?.id,
      counsellor_name: user?.name,
      supervisor_id: null,
      supervisor_name: null,
      handover_status: 'handed_over_to_supervisor',
      babies: formData.babies.map((b, i) => ({
        ...b,
        baby_id: b.baby_id || generateBabyId(patientId, i + 1, facilityCode),
      })),
    };
    upsertPatient(patientData);
    addAuditLog({
      user_id: user?.id, user_name: user?.name, role: user?.role,
      action: 'handed_over', record_id: patientId,
    });
    setSubmitted(true);
    setTimeout(() => navigate('/counsellor/patients'), 2000);
  };

  if (submitted) return (
    <AppLayout title={t('patientRegistration')}>
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t('handoverSuccess')}</h2>
        <p className="text-slate-500">{t('handoverSuccessDesc')}</p>
      </div>
    </AppLayout>
  );

  if (isLoading && id) {
    return (
      <AppLayout title={t('patientRegistration')}>
        <div className="flex flex-col items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C75]"></div>
          <p className="mt-4 text-slate-600">{t('loading')}</p>
        </div>
      </AppLayout>
    );
  }

  const STEPS = [
    { id: 1, label: t('registration') },
    { id: 2, label: t('babyDetails') },
  ];

  return (
    <AppLayout title={id ? t('editPatient') : t('patientRegistration')}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{t('patientRegistration')}</h1>
            <p className="text-slate-500 text-sm">{t('stepOf').replace('{step}', step).replace('{total}', STEPS.length)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSaveDraft} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Save size={14} />
              {saved ? t('saved') : t('saveDraft')}
            </button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {STEPS.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                step > s.id ? 'bg-emerald-500 border-emerald-500 text-white' :
                step === s.id ? 'bg-[#0F4C75] border-[#0F4C75] text-white' :
                'bg-white border-slate-200 text-slate-400'
              }`}>
                {step > s.id ? <CheckCircle2 size={14} /> : s.id}
              </div>
              <span className={`text-sm font-medium ${step === s.id ? 'text-[#0F4C75]' : 'text-slate-400'}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
          {step === 1 ? (
            <SectionA data={formData.identification} onChange={updateIdentification} t={t} user={user} />
          ) : (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">{t('babyDetails')}</h3>

              {/* Baby Count */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('numberOfBabies')}</label>
                <div className="flex gap-3 flex-wrap">
                  {[1, 2, 3].map(n => (
                    <button key={n} type="button" onClick={() => {
                      const count = Math.max(1, n);
                      setFormData(prev => {
                        const currentBabies = [...prev.babies];
                        // Adjust babies array to match count
                        if (currentBabies.length < count) {
                          // Add new babies
                          const toAdd = count - currentBabies.length;
                          const newBabies = Array.from({ length: toAdd }, (_, i) => ({
                            baby_number: currentBabies.length + i + 1,
                            gender: 'male',
                            uhid: '',
                            gestational_age: '',
                            birth_weight: '',
                            outcome_of_delivery: 'live_birth',
                            baby_condition: 'normal',
                            baby_location: 'with_mother',
                          }));
                          return {
                            ...prev,
                            identification: {
                              ...prev.identification,
                              baby_count: count,
                            },
                            babies: [...currentBabies, ...newBabies],
                          };
                        } else if (currentBabies.length > count) {
                          // Remove extra babies
                          const trimmed = currentBabies.slice(0, count);
                          return {
                            ...prev,
                            identification: {
                              ...prev.identification,
                              baby_count: count,
                            },
                            babies: trimmed,
                          };
                        }
                        return prev;
                      });
                    }} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      formData.identification.baby_count === n ? 'bg-[#0F4C75] text-white border-[#0F4C75]' : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      {n} {n === 1 ? 'Baby' : 'Babies'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Baby Forms */}
              <div className="space-y-4">
                {formData.babies.map((baby, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-700">{t('baby')} {idx + 1}</h4>
                      {formData.babies.length > 1 && (
                        <button onClick={() => removeBaby(idx)} className="p-1 text-rose-400 hover:text-rose-600"><Trash2 size={14} /></button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('gender')}</label>
                        <div className="flex gap-3">
                          {['male', 'female'].map(g => (
                            <label key={g} className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name={`baby_gender_${idx}`} value={g} checked={baby.gender === g} onChange={() => updateBaby(idx, 'gender', g)} />
                              <span className="text-sm capitalize text-slate-700">{g}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">UHID</label>
                        <input type="text" value={baby.uhid} onChange={e => updateBaby(idx, 'uhid', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('gestationalAgeWeeks')}</label>
                        <input type="number" value={baby.gestational_age} onChange={e => updateBaby(idx, 'gestational_age', e.target.value)} placeholder="28-42" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('birthWeightGrams')}</label>
                        <input type="number" value={baby.birth_weight} onChange={e => updateBaby(idx, 'birth_weight', e.target.value)} placeholder="grams" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {formData.identification.baby_count < 3 && (
                <button onClick={addBaby} className="mt-4 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  <Plus size={14} /> {t('addBaby')}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/counsellor')}
            className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={16} />
            {step === 1 ? t('discardEntry') : t('previous')}
          </button>

          {step < 2 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #0F4C75, #1B6CA8)' }}>
              {t('nextSection')} <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleHandover}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors">
              <Send size={14} />
              {t('handoverToSupervisor')}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}