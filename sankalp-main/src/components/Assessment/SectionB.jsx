import { CheckItem } from './shared';

export default function SectionB({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const counsellingItems = [
    { key: 'importanceBF', label: t('importanceBF') },
    { key: 'colostrumFeeding', label: t('colostrumFeeding') },
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

      <h4 className="font-semibold text-slate-700 mb-2">{t('wasMotherCounselled')}</h4>
      <div className="space-y-0 mb-5">
        {counsellingItems.map(item => (
          <CheckItem key={item.key} label={item.label} checked={d[item.key]} onChange={v => update(item.key, v)} />
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('breastAssessment')}</h4>
      <div className="space-y-0 mb-5">
        {breastItems.map(item => (
          <CheckItem key={item.key} label={item.label} checked={d[item.key]} onChange={v => update(item.key, v)} />
        ))}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('actionTaken')}</label>
        <textarea rows={2} value={d.ancAction || ''} onChange={e => update('ancAction', e.target.value)} placeholder="..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>
    </div>
  );
}
