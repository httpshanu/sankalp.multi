import { CheckItem } from './shared';

export default function SectionH({ data = {}, onChange, t }) {
  const d = data;
  const update = (key, val) => onChange({ ...d, [key]: val });

  const problems = ['poorAttachment', 'breastEngorgement', 'crackedNipple', 'flatNipple', 'inadequateMilk', 'babySleepy'];

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">⚠️ {t('bfProblems')}</h3>
      <p className="text-slate-500 text-sm mb-5">{t('bfProblemsDesc')}</p>

      <div className="space-y-0 mb-5">
        {problems.map(k => (
          <CheckItem key={k} label={t(k)} checked={d[k]} onChange={v => update(k, v)} />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{t('managementGiven')}</label>
        <textarea rows={3} value={d.bfManagement || ''} onChange={e => update('bfManagement', e.target.value)} placeholder="Management details..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" />
      </div>
    </div>
  );
}
