import { isKmcEligible } from '../../data/dataStore';

export default function KmcSection({ babies, formData, updateSection, t }) {
  const kmcData = formData.kmc || {};
  const update = (key, val) => updateSection('kmc')({ ...kmcData, [key]: val });

  const eligibleBabies = babies.filter(b => isKmcEligible(b.outcome_of_delivery, b.birth_weight, b.gestational_age, b.baby_condition));

  if (eligibleBabies.length === 0) return null;

  const kmcReasons = [];
  eligibleBabies.forEach(b => {
    if (Number(b.birth_weight) < 2500) kmcReasons.push('Birth Weight <2500g');
    if (Number(b.gestational_age) < 37) kmcReasons.push('Preterm <37 weeks');
    if (b.baby_condition === 'sick') kmcReasons.push('Sick Baby');
  });

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{t('kmcTitle')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('kmcDesc')}</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
        <p className="text-sm font-semibold text-blue-800 mb-1">{t('kmcEligible')}</p>
        <p className="text-xs text-blue-600">{eligibleBabies.length} baby(ies) eligible for KMC</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {[...new Set(kmcReasons)].map((r, i) => (
            <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{r}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcAvailability')}</label>
          <select value={kmcData.availability || ''} onChange={e => update('availability', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">{t('selectLevel')}</option>
            <option value="available">{t('kmcAvailable')}</option>
            <option value="not_available">{t('kmcNotAvailable')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcInitiated')}</label>
          <div className="flex gap-3">
            {['yes', 'no'].map(v => (
              <button key={v} type="button" onClick={() => update('initiated', v === 'yes')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${kmcData.initiated === (v === 'yes') ? (v === 'yes' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-300') : 'bg-white text-slate-400 border-slate-200'}`}>
                {v === 'yes' ? t('yes') : t('no')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {kmcData.initiated && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcInitiationDate')}</label>
            <input type="date" value={kmcData.initiation_date || ''} onChange={e => update('initiation_date', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcInitiationTime')}</label>
            <input type="time" value={kmcData.initiation_time || ''} onChange={e => update('initiation_time', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
          </div>
        </div>
      )}

      {/* Counselling checkboxes */}
      <div className="space-y-2 mb-4">
        {[
          { key: 'mother_counselled', label: t('motherCounselledKMC') },
          { key: 'family_counselled', label: t('familyCounselledKMC') },
          { key: 'duration_explained', label: t('kmcDurationExplained') },
          { key: 'position_demonstrated', label: t('kmcPositionDemonstrated') },
        ].map(item => (
          <label key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50 cursor-pointer">
            <span className="text-sm text-slate-700">{item.label}</span>
            <div className="flex gap-3">
              {['yes', 'no'].map(v => (
                <button key={v} type="button" onClick={() => update(item.key, v === 'yes')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${kmcData[item.key] === (v === 'yes') ? (v === 'yes' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-rose-100 text-rose-700 border-rose-300') : 'bg-white text-slate-400 border-slate-200'}`}>
                  {v === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcDuration')}</label>
          <input type="text" value={kmcData.duration || ''} onChange={e => update('duration', e.target.value)} placeholder="e.g. 8 hours/day" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcAcceptance')}</label>
          <select value={kmcData.acceptance || ''} onChange={e => update('acceptance', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Select</option>
            <option value="accepted">{t('kmcAccepted')}</option>
            <option value="refused">{t('kmcRefused')}</option>
            <option value="partial">{t('kmcPartial')}</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcProblems')}</label>
        <textarea rows={2} value={kmcData.problems || ''} onChange={e => update('problems', e.target.value)} placeholder="Any problems encountered..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>

      {!kmcData.initiated && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('kmcNotInitiatedReason')}</label>
          <select value={kmcData.not_initiated_reason || ''} onChange={e => update('not_initiated_reason', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option value="">Select reason</option>
            <option value="baby_sncu">Baby in SNCU</option>
            <option value="mother_unavailable">Mother unavailable</option>
            <option value="baby_sick">Baby sick</option>
            <option value="refused">Refused</option>
            <option value="other">Other</option>
          </select>
        </div>
      )}
    </div>
  );
}
