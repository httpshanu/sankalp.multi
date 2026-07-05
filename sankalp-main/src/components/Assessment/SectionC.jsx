import { CheckItem } from './shared';

export default function SectionC({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const noBFReasons = [
    { key: 'motherSick', label: t('motherSick') },
    { key: 'babySick', label: t('babySick') },
    { key: 'caesareanReason', label: t('caesarean') },
    { key: 'staffDelay', label: t('staffDelay') },
    { key: 'familyRefusal', label: t('familyRefusal') },
    { key: 'motherRefusal', label: t('motherRefusal') },
    { key: 'socioCultural', label: t('socioCultural') },
  ];

  const prelactealTypes = [
    { key: 'honey', label: t('honey') },
    { key: 'water', label: t('water') },
    { key: 'formula', label: t('formula') },
    { key: 'ghutti', label: t('ghutti') },
    { key: 'gur', label: t('gur') },
  ];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">🏥 {t('afterBirthCare')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('afterBirthCareDesc')}</p>

      <h4 className="font-semibold text-slate-700 mb-2">{t('birthDetails')}</h4>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('timeOfBirth')}</label>
          <input type="time" value={d.timeOfBirth || ''} onChange={e => update('timeOfBirth', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{t('timeBFStarted')}</label>
          <input type="time" value={d.timeBFStarted || ''} onChange={e => update('timeBFStarted', e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
      </div>

      <div className="space-y-0 mb-5">
        <CheckItem label={t('babyCriedImmediately')} checked={d.babyCried} onChange={v => update('babyCried', v)} />
        <CheckItem label={t('babyDriedImmediately')} checked={d.babyDried} onChange={v => update('babyDried', v)} />
        <CheckItem label={t('delayedCordClamping')} checked={d.delayedCordClamping} onChange={v => update('delayedCordClamping', v)} />
        <CheckItem label={t('skinToSkinInitiated')} checked={d.skinToSkinInitiated} onChange={v => update('skinToSkinInitiated', v)} />
        <CheckItem label={t('bfInitiatedWithin1Hour')} checked={d.bfInitiatedWithin1Hour} onChange={v => update('bfInitiatedWithin1Hour', v)} />
        <CheckItem label={t('babySeparatedFromMother')} checked={d.babySeparated} onChange={v => update('babySeparated', v)} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('requiredResuscitationText')}</label>
        <textarea rows={2} value={d.resuscitationText || ''} onChange={e => update('resuscitationText', e.target.value)} placeholder="Resuscitation details..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>

      {!d.bfInitiatedWithin1Hour && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('ifNoWhy')}</label>
          <div className="space-y-0">
            {noBFReasons.map(item => (
              <CheckItem key={item.key} label={item.label} checked={d[item.key]} onChange={v => update(item.key, v)} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-0 mb-4">
        <CheckItem label={t('prelactealFeedGiven')} checked={d.prelactealGiven} onChange={v => update('prelactealGiven', v)} />
      </div>

      {d.prelactealGiven && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('prelactealType')}</label>
          <div className="space-y-0">
            {prelactealTypes.map(item => (
              <CheckItem key={item.key} label={item.label} checked={d[item.key]} onChange={v => update(item.key, v)} />
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('otherPrelacteal')}</label>
            <input type="text" value={d.otherPrelacteal || ''} onChange={e => update('otherPrelacteal', e.target.value)} placeholder="Other pre-lacteal feed" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
        </div>
      )}
    </div>
  );
}
