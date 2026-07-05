import { CheckItem, CorrectIncorrect } from './shared';

export default function SectionD({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const positionItems = [
    { key: 'motherComfortable', label: t('motherComfortable') },
    { key: 'babyCloseToMother', label: t('babyCloseToMother') },
    { key: 'babyFacingBreast', label: t('babyFacingBreast') },
    { key: 'wholeBodySupported', label: t('wholeBodySupported') },
  ];

  const attachmentItems = [
    { key: 'mouthWideOpen', label: t('mouthWideOpen') },
    { key: 'chinTouchingBreast', label: t('chinTouchingBreast') },
    { key: 'lowerLipOutward', label: t('lowerLipOutward') },
    { key: 'moreAreolaAbove', label: t('moreAreolaAbove') },
  ];

  const sucklingItems = [
    { key: 'slowDeepSuck', label: t('slowDeepSuck') },
    { key: 'swallowingHeard', label: t('swallowingHeard') },
    { key: 'babySatisfied', label: t('babySatisfied') },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🍼 {t('bfAssessment')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('bfAssessmentDesc')}</p>

      <h4 className="font-semibold text-slate-700 mb-2">{t('position')}</h4>
      <div className="space-y-0 mb-5">
        {positionItems.map(item => (
          <CorrectIncorrect key={item.key} label={item.label} value={d[item.key]} onChange={v => update(item.key, v)} />
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('attachment')}</h4>
      <div className="space-y-0 mb-5">
        {attachmentItems.map(item => (
          <CheckItem key={item.key} label={item.label} checked={d[item.key]} onChange={v => update(item.key, v)} />
        ))}
      </div>

      <h4 className="font-semibold text-slate-700 mb-2">{t('effectiveSuckling')}</h4>
      <div className="space-y-0 mb-5">
        {sucklingItems.map(item => (
          <CheckItem key={item.key} label={item.label} checked={d[item.key]} onChange={v => update(item.key, v)} />
        ))}
      </div>
    </div>
  );
}
