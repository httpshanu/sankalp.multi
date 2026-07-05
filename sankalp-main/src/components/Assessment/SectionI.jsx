import { CheckItem } from './shared';

export default function SectionI({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const counsellingTopics = ['exclusiveBFCounselling', 'dangerSignsCounselling', 'maternalNutrition', 'homeVisitCounselling', 'immunization', 'followupCounselling'];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🚨 {t('beforeDischarge')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('beforeDischargeDesc')}</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <CheckItem label={t('babyExclusivelyBF')} checked={d.exclusivelyBF} onChange={v => update('exclusivelyBF', v)} />
        </div>
        <div>
          <CheckItem label={t('motherConfident')} checked={d.motherConfident} onChange={v => update('motherConfident', v)} />
        </div>
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('counsellingProvided')}</h4>
      <div className="space-y-0 mb-5">
        {counsellingTopics.map(k => (
          <CheckItem key={k} label={t(k)} checked={d[k]} onChange={v => update(k, v)} />
        ))}
      </div>
    </div>
  );
}
