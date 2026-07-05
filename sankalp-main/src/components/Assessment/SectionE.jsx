import { CheckItem } from './shared';

export default function SectionE({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const nurseObsOptions = ['everyFeed', 'onceDaily', 'never'];
  const counselItems = ['position', 'attachment', 'feedingCues', 'demandFeeding', 'nightFeeding', 'burping', 'handExpression'];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🏥 {t('postnatalWard')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('bfObservedByNurse')}</p>

      <h4 className="font-semibold text-slate-700 mb-2">{t('breastfeedingObservedByNurse')}</h4>
      <div className="flex gap-2 mb-5">
        {nurseObsOptions.map(k => (
          <button key={k} type="button" onClick={() => update('nurseObserved', k)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${d.nurseObserved === k ? 'bg-[#0F4C75] text-white border-[#0F4C75]' : 'bg-white text-slate-600 border-slate-200'}`}>
            {t(k)}
          </button>
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('motherCounselled')}</h4>
      <div className="space-y-0 mb-5">
        {counselItems.map(k => (
          <CheckItem key={`mother_${k}`} label={t(k)} checked={d[`mother_${k}`]} onChange={v => update(`mother_${k}`, v)} />
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('familyCounselled')}</h4>
      <div className="space-y-0 mb-5">
        {counselItems.map(k => (
          <CheckItem key={`family_${k}`} label={t(k)} checked={d[`family_${k}`]} onChange={v => update(`family_${k}`, v)} />
        ))}
      </div>
    </div>
  );
}
