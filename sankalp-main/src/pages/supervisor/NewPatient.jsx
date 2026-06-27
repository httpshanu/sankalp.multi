import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import { useLanguage } from '../../context/useLanguage';
import { CheckCircle2, ChevronRight, ChevronLeft, Save, Send } from 'lucide-react';

const STEPS = [
  { id: 1, key: 'identification' },
  { id: 2, key: 'ancCounselling' },
  { id: 3, key: 'afterBirthCare' },
  { id: 4, key: 'breastfeedingCounselling' },
  { id: 5, key: 'bfAssessment' },
  { id: 6, key: 'postnatalWard' },
  { id: 7, key: 'sickBaby' },
  { id: 8, key: 'dailyMonitoring' },
  { id: 9, key: 'bfProblems' },
  { id: 10, key: 'dischargeTitle' },
];

function StepIndicator({ current, t }) {
  return (
    <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center flex-shrink-0">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              step.id < current ? 'bg-emerald-500 border-emerald-500 text-white'
              : step.id === current ? 'bg-[#0F4C75] border-[#0F4C75] text-white'
              : 'bg-white border-slate-200 text-slate-400'
            }`}>
              {step.id < current ? <CheckCircle2 size={14} /> : step.id}
            </div>
            <p className={`text-xs mt-1 font-medium whitespace-nowrap ${step.id === current ? 'text-[#0F4C75]' : 'text-slate-400'}`}>
              {t(step.key)}
            </p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 mb-4 ${step.id < current ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function CheckItem({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between py-2 border-b border-slate-50 cursor-pointer">
      <span className="text-sm text-slate-700">{label}</span>
      <div className="flex gap-3">
        {['yes', 'no'].map(v => (
          <button key={v} type="button" onClick={() => onChange(v === 'yes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
              (v === 'yes' && checked === true) || (v === 'no' && checked === false)
                ? v === 'yes' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-white text-slate-400 border-slate-200'
            }`}>
            {v === 'yes' ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
    </label>
  );
}

// Step 1: Section A - Identification
function IdentificationForm({ data, onChange, t }) {
  const fields = [
    { key: 'motherName', label: t('motherFullName'), placeholder: 'e.g. Sunita Devi', span: 2 },
    { key: 'fatherName', label: t('fatherFullName'), placeholder: 'e.g. Ramesh Kumar', span: 2 },
    { key: 'age', label: t('ageYears'), placeholder: '24', type: 'number', span: 1 },
    { key: 'contact', label: t('contactNumber'), placeholder: '+91 9876543210', span: 1 },
    { key: 'village', label: t('villageArea'), placeholder: 'Village name', span: 2 },
    { key: 'ashaName', label: t('ashaWorkerName'), placeholder: 'Assigned worker', span: 1 },
    { key: 'ashaContact', label: t('ashaContact'), placeholder: '+91', span: 1 },
  ];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">👩 {t('motherDetails')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('enterMotherInfo')}</p>
      <div className="grid grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
            <input type={f.type || 'text'} value={data[f.key] || ''} onChange={e => onChange({ ...data, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
        ))}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mt-6 mb-1">👶 {t('babyDetails')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('enterBabyInfo')}</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('gender')}</label>
          <div className="flex gap-4">
            {['male', 'female', 'other'].map(g => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value={g} checked={data.gender === g} onChange={() => onChange({ ...data, gender: g })} />
                <span className="text-sm capitalize text-slate-700">{g}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('uhidLabel')}</label>
          <input value={data.uhid || ''} onChange={e => onChange({ ...data, uhid: e.target.value })} placeholder="UHID-XXXX-XXXX" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('areaType')}</label>
          <div className="flex gap-4">
            {['rural', 'urban'].map(a => (
              <label key={a} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="area" value={a} checked={data.area === a} onChange={() => onChange({ ...data, area: a })} />
                <span className="text-sm capitalize text-slate-700">{a}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('birthWeight')} (g)</label>
          <input type="number" value={data.birthWeightG || ''} onChange={e => onChange({ ...data, birthWeightG: e.target.value })} placeholder="e.g. 2450" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('gestationalAge')} (weeks)</label>
          <input type="number" value={data.gestationalAge || ''} onChange={e => onChange({ ...data, gestationalAge: e.target.value })} placeholder="28–42" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('deliveryType')}</label>
          <div className="flex gap-4">
            {[{ key: 'normal', label: t('normal') }, { key: 'assisted', label: t('assisted') }, { key: 'caesarean', label: t('caesarean') }].map(d => (
              <label key={d.key} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="deliveryType" value={d.key} checked={data.deliveryType === d.key} onChange={() => onChange({ ...data, deliveryType: d.key })} />
                <span className="text-sm text-slate-700">{d.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('gravida')}</label>
          <input type="number" value={data.gravida || ''} onChange={e => onChange({ ...data, gravida: e.target.value })} placeholder="G1, G2..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('para')}</label>
          <input type="number" value={data.para || ''} onChange={e => onChange({ ...data, para: e.target.value })} placeholder="P0, P1..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
      </div>
    </div>
  );
}

// Step 2: Section B - ANC Counselling
function ANCForm({ data, onChange, t }) {
  const counsellingItems = [
    { key: 'importanceBF', label: t('importanceBF') },
    { key: 'colostrum', label: t('colostrumFeeding') },
    { key: 'bfWithin1Hour', label: t('bfWithin1Hour') },
    { key: 'exclusiveBF6Months', label: t('exclusiveBF6Months') },
    { key: 'skinToSkin', label: t('skinToSkin') },
    { key: 'noPrelacteal', label: t('noPrelacteal') },
  ];
  const breastItems = [
    { key: 'flatNipple', label: t('flatNipple') },
    { key: 'invertedNipple', label: t('invertedNipple') },
    { key: 'breastAbnormality', label: t('breastAbnormality') },
    { key: 'prevBFDifficulty', label: t('prevBFDifficulty') },
  ];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🤰 {t('ancCounselling')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('ancCounsellingDesc')}</p>
      <div className="space-y-0">
        {counsellingItems.map(item => (
          <CheckItem key={item.key} label={item.label} checked={data[item.key]} onChange={v => onChange({ ...data, [item.key]: v })} />
        ))}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mt-6 mb-1">🔍 {t('breastAssessment')}</h3>
      <div className="space-y-0">
        {breastItems.map(item => (
          <CheckItem key={item.key} label={item.label} checked={data[item.key]} onChange={v => onChange({ ...data, [item.key]: v })} />
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('actionTaken')}</label>
        <textarea rows={2} value={data.ancAction || ''} onChange={e => onChange({ ...data, ancAction: e.target.value })} placeholder="..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>
    </div>
  );
}

// Step 3: Section C - After Birth
function AfterBirthForm({ data, onChange, t }) {
  const immediateCare = [
    { key: 'driedImmediately', label: t('driedImmediately') },
    { key: 'delayedCordClamping', label: t('delayedCordClamping') },
    { key: 'skinToSkinInitiated', label: t('skinToSkinInitiated') },
    { key: 'durationOver1Hour', label: t('durationOver1Hour') },
    { key: 'babySeparated', label: t('babySeparated') },
  ];
  const whyNoBF = ['motherSick', 'babySick', 'caesarean', 'staffDelay', 'familyRefusal'];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🏥 {t('afterBirthCare')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('afterBirthCareDesc')}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('timeOfBirth')}</label>
          <input type="time" value={data.timeOfBirth || ''} onChange={e => onChange({ ...data, timeOfBirth: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('timeBFStarted')}</label>
          <input type="time" value={data.timeBFStarted || ''} onChange={e => onChange({ ...data, timeBFStarted: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      </div>

      <div className="space-y-0 mb-5">
        <CheckItem label={t('babyCriedImmediately')} checked={data.babyCried} onChange={v => onChange({ ...data, babyCried: v })} />
        <CheckItem label={t('requiredResuscitation')} checked={data.resuscitation} onChange={v => onChange({ ...data, resuscitation: v })} />
        <CheckItem label={t('withinOneHour')} checked={data.withinOneHour} onChange={v => onChange({ ...data, withinOneHour: v })} />
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('immediateNewbornCare')}</h4>
      <div className="space-y-0 mb-5">
        {immediateCare.map(item => (
          <CheckItem key={item.key} label={item.label} checked={data[item.key]} onChange={v => onChange({ ...data, [item.key]: v })} />
        ))}
      </div>

      {data.babySeparated && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('reason')}</label>
          <input value={data.separationReason || ''} onChange={e => onChange({ ...data, separationReason: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      )}

      {!data.withinOneHour && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('ifNoWhy')}</label>
          <div className="flex flex-wrap gap-2">
            {whyNoBF.map(k => (
              <button key={k} type="button" onClick={() => onChange({ ...data, whyNoBF: k })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${data.whyNoBF === k ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-0">
        <CheckItem label={t('colostrumGiven')} checked={data.colostrumGiven} onChange={v => onChange({ ...data, colostrumGiven: v })} />
        <CheckItem label={t('prelactealGiven')} checked={data.prelactealGiven} onChange={v => onChange({ ...data, prelactealGiven: v })} />
      </div>
      {data.prelactealGiven && (
        <div className="mt-2 mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('type')}</label>
          <div className="flex flex-wrap gap-2">
            {['honey', 'water', 'formula', 'animalMilk'].map(k => (
              <button key={k} type="button" onClick={() => onChange({ ...data, prelactealType: k })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${data.prelactealType === k ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 4: Breastfeeding Counselling
function BreastfeedingForm({ data, onChange, t }) {
  const items = [
    { key: 'colostrumCounselled', label: t('colostrumFeeding'), desc: t('colostrumDesc') },
    { key: 'earlyInitiation', label: t('earlyInitiation'), desc: t('earlyInitiationDesc') },
    { key: 'exclusiveBreastfeeding', label: t('exclusiveBreastfeeding'), desc: t('exclusiveDesc') },
    { key: 'latching', label: t('correctLatching'), desc: t('latchingDesc') },
    { key: 'prelactealFeed', label: t('prelactealFeed'), desc: t('prelactealDesc') },
  ];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🤱 {t('breastfeedingCounselling')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('checkTopics')}</p>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.key} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${data[item.key] ? 'border-blue-400 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            onClick={() => onChange({ ...data, [item.key]: !data[item.key] })}>
            <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${data[item.key] ? 'bg-[#0F4C75] border-[#0F4C75]' : 'border-slate-300'}`}>
              {data[item.key] && <CheckCircle2 size={12} className="text-white" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{item.label}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('additionalNotes')}</label>
        <textarea rows={3} value={data.notes || ''} onChange={e => onChange({ ...data, notes: e.target.value })} placeholder={t('counsellingNotes')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>
    </div>
  );
}

// Step 5: Section D - Breastfeeding Assessment
function BFAssessmentForm({ data, onChange, t }) {
  const positionItems = ['motherComfortable', 'babyCloseToMother', 'babyFacingBreast', 'wholeBodySupported'];
  const attachmentItems = ['mouthWideOpen', 'chinTouchingBreast', 'lowerLipOutward', 'moreAreolaAbove'];
  const sucklingItems = ['slowDeepSuck', 'swallowingHeard', 'babySatisfied'];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🍼 {t('bfAssessment')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('bfAssessmentDesc')}</p>

      <h4 className="font-semibold text-slate-700 mb-2">{t('position')}</h4>
      <div className="space-y-0 mb-5">
        {positionItems.map(k => (
          <CheckItem key={k} label={t(k)} checked={data[k]} onChange={v => onChange({ ...data, [k]: v })} />
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('attachment')}</h4>
      <div className="space-y-0 mb-5">
        {attachmentItems.map(k => (
          <CheckItem key={k} label={t(k)} checked={data[k]} onChange={v => onChange({ ...data, [k]: v })} />
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('effectiveSuckling')}</h4>
      <div className="space-y-0 mb-5">
        {sucklingItems.map(k => (
          <CheckItem key={k} label={t(k)} checked={data[k]} onChange={v => onChange({ ...data, [k]: v })} />
        ))}
      </div>
    </div>
  );
}

// Step 6: Section E - Postnatal Ward
function PostnatalForm({ data, onChange, t }) {
  const nurseObsOptions = ['everyFeed', 'onceDaily', 'never'];
  const counselItems = ['position', 'attachment', 'feedingCues', 'demandFeeding', 'nightFeeding', 'burping', 'handExpression'];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🏥 {t('postnatalWard')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('bfObservedByNurse')}</p>

      <div className="flex gap-2 mb-5">
        {nurseObsOptions.map(k => (
          <button key={k} type="button" onClick={() => onChange({ ...data, nurseObserved: k })}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${data.nurseObserved === k ? 'bg-[#0F4C75] text-white border-[#0F4C75]' : 'bg-white text-slate-600 border-slate-200'}`}>
            {t(k)}
          </button>
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('motherCounselled')}</h4>
      <div className="space-y-0 mb-5">
        {counselItems.map(k => (
          <CheckItem key={k} label={t(k)} checked={data[k]} onChange={v => onChange({ ...data, [k]: v })} />
        ))}
      </div>

      <CheckItem label={t('familyCounselled')} checked={data.familyCounselled} onChange={v => onChange({ ...data, familyCounselled: v })} />
    </div>
  );
}

// Step 7: Section F - Sick Baby / KMC
function SickBabyForm({ data, onChange, t }) {
  const expressOptions = ['within6Hours', 'within12Hours', 'over12Hours'];
  const feedMethods = ['directBF', 'cup', 'spoon', 'tube', 'expressedMilk'];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🏥 {t('sickBaby')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('applicable')}</p>

      <CheckItem label={t('applicable')} checked={data.sickBabyApplicable} onChange={v => onChange({ ...data, sickBabyApplicable: v })} />

      {data.sickBabyApplicable && (
        <div className="mt-4">
          <h4 className="font-semibold text-slate-700 mb-2">{t('motherExpressingMilk')}</h4>
          <div className="flex gap-2 mb-4">
            {expressOptions.map(k => (
              <button key={k} type="button" onClick={() => onChange({ ...data, expressTiming: k })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${data.expressTiming === k ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>

          <CheckItem label={t('kmcInitiated')} checked={data.kmcStarted} onChange={v => onChange({ ...data, kmcStarted: v })} />

          <h4 className="font-semibold text-slate-700 mt-4 mb-2">{t('feedingMethod')}</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {feedMethods.map(k => (
              <button key={k} type="button" onClick={() => onChange({ ...data, feedingMethod: k })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${data.feedingMethod === k ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-white text-slate-500 border-slate-200'}`}>
                {t(k)}
              </button>
            ))}
          </div>

          <CheckItem label={t('counselledDaily')} checked={data.counselledDaily} onChange={v => onChange({ ...data, counselledDaily: v })} />
        </div>
      )}
    </div>
  );
}

// Step 8: Section G - Daily Monitoring
function DailyMonitoringForm({ data, onChange, t }) {
  const monitored = ['bfObserved', 'goodAttachment', 'feeding8to12', 'urinationAdequate', 'stoolPassed', 'weightMonitored'];
  const days = ['day1', 'day2', 'day3'];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">📊 {t('dailyMonitoring')}</h3>
      <p className="text-slate-500 text-sm mb-5">Day 1–3 monitoring checklist</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-xs font-semibold text-slate-400 uppercase px-4 py-3 border border-slate-200">Observation</th>
              {days.map(d => (
                <th key={d} className="text-center text-xs font-semibold text-slate-400 uppercase px-4 py-3 border border-slate-200">{t(d)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monitored.map(k => (
              <tr key={k} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-700 border border-slate-200">{t(k)}</td>
                {days.map(d => (
                  <td key={d} className="text-center border border-slate-200">
                    <button type="button" onClick={() => {
                      const current = data.dailyMonitoring?.[k]?.[d];
                      const newVal = current === true ? false : current === false ? undefined : true;
                      onChange({ ...data, dailyMonitoring: { ...data.dailyMonitoring, [k]: { ...data.dailyMonitoring?.[k], [d]: newVal } } });
                    }} className={`w-8 h-8 rounded-lg inline-flex items-center justify-center text-sm font-bold transition-all ${
                      data.dailyMonitoring?.[k]?.[d] === true ? 'bg-emerald-500 text-white' :
                      data.dailyMonitoring?.[k]?.[d] === false ? 'bg-rose-100 text-rose-600' :
                      'bg-white text-slate-300 border border-slate-200 hover:border-slate-300'
                    }`}>
                      {data.dailyMonitoring?.[k]?.[d] === true ? '✓' : data.dailyMonitoring?.[k]?.[d] === false ? '✗' : '—'}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Step 9: Section H - Breastfeeding Problems
function BFProblemsForm({ data, onChange, t }) {
  const problems = ['poorAttachment', 'breastEngorgement', 'crackedNipple', 'flatNipple', 'inadequateMilk', 'babySleepy'];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">⚠️ {t('bfProblems')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('bfProblems')}</p>

      <div className="space-y-0 mb-5">
        {problems.map(k => (
          <CheckItem key={k} label={t(k)} checked={data[k]} onChange={v => onChange({ ...data, [k]: v })} />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('managementGiven')}</label>
        <textarea rows={3} value={data.bfManagement || ''} onChange={e => onChange({ ...data, bfManagement: e.target.value })} placeholder="Management details..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>
    </div>
  );
}

// Step 10: Sections I & J - Discharge & Follow-up
function DischargeFollowupForm({ data, onChange, t }) {
  const dischargeTopics = ['exclusiveBFCounselling', 'dangerSignsCounselling', 'maternalNutrition', 'homeVisitCounselling', 'immunization', 'followupCounselling'];
  const hbncDays = ['day1', 'day3', 'day7', 'day14', 'day21', 'day28'];
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🚨 {t('dischargeTitle')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('criticalModule')}</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <CheckItem label={t('exclusivelyBF')} checked={data.exclusivelyBF} onChange={v => onChange({ ...data, exclusivelyBF: v })} />
        </div>
        <div>
          <CheckItem label={t('motherConfident')} checked={data.motherConfident} onChange={v => onChange({ ...data, motherConfident: v })} />
        </div>
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('discussedDanger')}</h4>
      <div className="space-y-0 mb-5">
        {['inabilityToFeed', 'convulsions', 'fastBreathing', 'fever', 'yellowingOfPalms'].map(k => (
          <CheckItem key={k} label={t(k)} checked={data[k]} onChange={v => onChange({ ...data, [k]: v })} />
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('beforeDischarge')}</h4>
      <div className="space-y-0 mb-5">
        {dischargeTopics.map(k => (
          <CheckItem key={k} label={t(k)} checked={data[k]} onChange={v => onChange({ ...data, [k]: v })} />
        ))}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('dischargeAdvice')}</label>
        <textarea rows={3} value={data.dischargeAdvice || ''} onChange={e => onChange({ ...data, dischargeAdvice: e.target.value })} placeholder={t('dischargeInstructions')} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>

      <hr className="my-5 border-slate-200" />

      <h3 className="text-lg font-bold text-slate-800 mb-1">📋 {t('postDischargePlan')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('postDischargeDesc')}</p>

      <CheckItem label={t('ashaInformed')} checked={data.ashaInformed} onChange={v => onChange({ ...data, ashaInformed: v })} />

      <h4 className="font-semibold text-slate-700 mt-4 mb-2">{t('hbncVisitPlanned')}</h4>
      <div className="flex flex-wrap gap-2">
        {hbncDays.map(k => (
          <button key={k} type="button" onClick={() => onChange({ ...data, hbncDay: k })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${data.hbncDay === k ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-slate-500 border-slate-200'}`}>
            {t(k)}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('remarks')}</label>
        <textarea rows={2} value={data.remarks || ''} onChange={e => onChange({ ...data, remarks: e.target.value })} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>
    </div>
  );
}

export default function NewPatient() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    identification: { gender: 'female', area: 'rural' },
    ancCounselling: {},
    afterBirth: {},
    breastfeeding: {},
    bfAssessment: {},
    postnatalWard: {},
    sickBaby: {},
    dailyMonitoring: {},
    bfProblems: {},
    discharge: {},
  });

  const updateSection = (key) => (val) => setFormData(prev => ({ ...prev, [key]: val }));

  const handleDraft = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleSubmit = () => { setSubmitted(true); setTimeout(() => navigate('/supervisor'), 2000); };

  const renderStep = () => {
    switch (step) {
      case 1: return <IdentificationForm data={formData.identification} onChange={updateSection('identification')} t={t} />;
      case 2: return <ANCForm data={formData.ancCounselling} onChange={updateSection('ancCounselling')} t={t} />;
      case 3: return <AfterBirthForm data={formData.afterBirth} onChange={updateSection('afterBirth')} t={t} />;
      case 4: return <BreastfeedingForm data={formData.breastfeeding} onChange={updateSection('breastfeeding')} t={t} />;
      case 5: return <BFAssessmentForm data={formData.bfAssessment} onChange={updateSection('bfAssessment')} t={t} />;
      case 6: return <PostnatalForm data={formData.postnatalWard} onChange={updateSection('postnatalWard')} t={t} />;
      case 7: return <SickBabyForm data={formData.sickBaby} onChange={updateSection('sickBaby')} t={t} />;
      case 8: return <DailyMonitoringForm data={formData.dailyMonitoring} onChange={updateSection('dailyMonitoring')} t={t} />;
      case 9: return <BFProblemsForm data={formData.bfProblems} onChange={updateSection('bfProblems')} t={t} />;
      case 10: return <DischargeFollowupForm data={formData.discharge} onChange={updateSection('discharge')} t={t} />;
      default: return null;
    }
  };

  if (submitted) return (
    <AppLayout title={t('patientRegistration')}>
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">{t('submittedSuccess')}</h2>
        <p className="text-slate-500">{t('submittedSuccessDesc')}</p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout title={t('patientRegistration')}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{t('patientRegistration')}</h1>
            <p className="text-slate-500 text-sm">{t('stepOf').replace('{step}', step).replace('{total}', STEPS.length)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDraft} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <Save size={14} />
              {saved ? t('saved') : t('saveDraft')}
            </button>
          </div>
        </div>

        <StepIndicator current={step} t={t} />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
          {renderStep()}
        </div>

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
            <button onClick={handleSubmit}
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
